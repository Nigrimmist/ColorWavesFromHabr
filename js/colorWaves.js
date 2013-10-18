
$(document).ready(function(){
    new HabrTask().init();    
});

function HabrTask() {
    var that = this;
    var gameContainer = $('#gameContainer');
    var initialArray = [];
    var sizeX = 50;
    var sizeY = 50;
    var colorSet = ['red','green','blue','yellow','grey','pink'];
    
    var table = null;
    var currentDirectionsArray = [];
    
    
    this.init = function()
    {
        that._fillMatrix();
        that._appendTable();
        that._setupEvents();
        that._runTimer();        
    }
    
    this._fillMatrix = function(){        
        for(var x=0;x<sizeX;x++){
            var xArray = [];         
            for(var y=0;y<sizeY;y++){ 
                xArray.push({x:x,y:y,color:'white'});             
            }
            initialArray.push(xArray);            
        };       
    }

    this._appendTable = function(){
        table = $('<table />').attr("cellspacing",0).css('border','1px solid black');        
        for(var y=0;y<initialArray.length;y++){
            var xArray = initialArray[y];       
             var tr = $('<tr />');            
            for(var x=0;x<xArray.length;x++){                 
                var td = $('<td/>').css({'width':'20px','height':'20px','background-color':'white','border':'1px solid black'}).attr('x',x).attr('y',y).attr('id','td'+x+'_'+y);                
             $(tr).append(td);
            }            
            $(table).append(tr);
        };
        $(gameContainer).append(table);
    }
    
    this._registerNewAction = function(startFromY){
        var newActionInfo = {
            color : that._getRandomColor(),
            priority : new Date().getTime(),
            upY : startFromY,
            downY : startFromY
        };        
        currentDirectionsArray.push(newActionInfo);         
    }
    
    this._runTimer = function(){
        setInterval(function(){
            //console.log('run');
             that._handle();
            that._fillFirstColumn();            
        },100);
        
    };   
        
    this._setupEvents = function(){
                
        $('tr',table).click(function(){
            var y = parseInt($('td',this).attr('y'));
                    //console.log(y);    
            that._registerNewAction(y); 
            
        });     
        
    }
    
    this._fillFirstColumn = function(){
        //console.log(initialArray[0][1]);

        
        for(var i=0;i<currentDirectionsArray.length;i++){
             var action = currentDirectionsArray[i];
            
            if(action.downY>=0 ){                      
                var td = $('#td0_'+action.downY);
                var currPriority = $(td).attr('priority')!=null ? parseInt($(td).attr('priority')) : 0;
                var newPriority =  action.priority;
                if(newPriority>=currPriority){
                    $(td).css('background-color',action.color).attr('priority',newPriority); 
                    initialArray[0][action.downY].color = action.color;
                    action.downY--;  
                }
                else{
                    action.downY = -1;
                }                          
            }           
            
            if(action.upY <initialArray.length){
               var td = $('#td0_'+action.upY);
                var currPriority = $(td).attr('priority')!=null ? parseInt($(td).attr('priority')) : 0;
                var newPriority =  action.priority;
                //console.log(currPriority+' '+newPriority);
                if(newPriority>=currPriority){
                    $(td).css('background-color',action.color).attr('priority',newPriority);                    
                    initialArray[0][action.upY].color = action.color;                           
                    action.upY++;
                }
                else
                {
                    action.upY = initialArray.length+1;
                }
                    
            }
        }
        
             currentDirectionsArray = jQuery.grep(currentDirectionsArray, function(obj, i){
                      return (obj.downY>=0 || obj.upY<initialArray.length);
              }); 
        
       
       //console.log(initialArray);
    } 
        
        
        
    this._handle = function(){  
        

        for(var x=sizeX-1;x>0;x--)        {
            for(var y=sizeY-1;y>=0;y--){                
                
                var currColor = initialArray[x][y].color;
                var prevColor = initialArray[x-1][y].color;
                //console.log(currColor+' '+prevColor);
                if(currColor!=prevColor){
                     $('#td'+x+'_'+y).css('background-color',prevColor);
                     initialArray[x][y].color = prevColor;
                }
                
            }
        }
    }
    
    var lastColor = null;
    this._getRandomColor = function(){
        while(true)
        {
            var newColor =  colorSet[Math.floor(Math.random()*colorSet.length)];
            if(lastColor!=newColor){
                lastColor = newColor;
                return newColor;                
            }
        }
        
    };
}
