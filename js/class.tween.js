Orange = ( function( rootApp ){
    
  rootApp.Tween = function(config){
    
        var _defaults = {}
        
        var _config = config || _defaults,
            _keys = [{x:80,y:20},
                {x:50,y:30},
                {x:40,y:60},
                {x:40,y:90},
                {x:50,y:120},
                {x:80,y:130},
                {x:110,y:130},
                {x:140,y:120},
                {x:150,y:90},
                {x:150,y:60},
                {x:140,y:30},
                {x:110,y:20}],
            _frames,
            _framePointer = 0;
    
       var _tween = function(p1, p2) {
           var  dx = Math.abs(p1.x - p2.x),
                dy = Math.abs(p1.y - p2.y),
                aOut = [],
                a,
                x,y,i,
                signX = ((p2.x - p1.x) >= 0)? 1 : -1,
                signY = ((p2.y - p1.y) >= 0)? 1 : -1;
                
           if(dy>=dx) { // si es mas alto q ancho
               a = dx/dy;
               for(i=0; i<dy; i++){
                   y = p1.y + (signY * i);
                   x = p1.x + (signX * (i * a));
                   //aOut.push({x : x, y: y});
                   console.log("V: "+ x +', '+ y);
               }
           } else {
               a = dy/dx;
               for(i=0; i<dx; i++){
                   x = p1.x + (signX * i);
                   y = p1.y + (signY * (i * a));
                   console.log("H: "+ x +', '+ y);
                   //aOut.push({x : x, y: y});
               }
           }
           
           return aOut;
       } // _tween
            
            
    
       return {
           _fnTween : function(p1,p2){
                return _tween(p1,p2);
           },
           
           requestFrame : function() {
               
               
           },

           addKeys : function(aKeys) {
                
           },
           
           resetPointer : function(frame){
               
           },
           
           reset : function() {
               
           },
           
           setDir : function(dir) {
               
           },
           
           getType : function() {
                return "Tween";
           },

           onStart : function(callback) {
               
           },
           
           onFinish : function() {
                
           }
           
       } // end return
  };
 
  return rootApp;
 
}( Orange || {} ));