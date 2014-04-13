Orange = ( function( rootApp ){
    
  rootApp.Tween = function(config){
    
        var _defaults = {}
        
        var _config = config || _defaults,
            _keys = [{x : 80, y : 20, nFrames : 15},
                {x : 50, y : 30, nFrames : 7},
                {x:40,y:60, nFrames : 5},
                {x:40,y:90, nFrames : 7},
                {x:50,y:120, nFrames : 15},
                {x:80,y:130, nFrames : 30},
                {x:110,y:130, nFrames : 15},
                {x:140,y:120, nFrames : 7},
                {x:150,y:90, nFrames : 5},
                {x:150,y:60, nFrames : 7},
                {x:140,y:30, nFrames : 15},
                {x:110,y:20, nFrames : 30},
                {x : 80, y : 20, nFrames : 10}
            ],
           _frames = [],
           _dir = 1,
           _framePointer = 0;
    
       var _tween = function(p1, p2) {
           var  dx = Math.abs(p1.x - p2.x),
                dy = Math.abs(p1.y - p2.y),
                aOut = [],
                a,
                x,y,i,j,
                signX = ((p2.x - p1.x) >= 0)? 1 : -1,
                signY = ((p2.y - p1.y) >= 0)? 1 : -1;
                
           if(dy>=dx) { // si es mas alto q ancho
               a = dx/dy;
               var nSteps = (_.isUndefined(p1.nFrames))? dy : p1.nFrames;
               var interval = dy / nSteps;
               
               for(i=0; i<nSteps; i++){
                   j = i * interval;
                   y = p1.y + (signY * j);
                   x = p1.x + (signX * (j * a));
                   aOut.push({x : x, y: y});
               }
           } else {
               a = dy/dx;
               var nSteps = (_.isUndefined(p1.nFrames))? dx : p1.nFrames;
               var interval = dx / nSteps;
               
               for(i=0; i<nSteps; i++){
                   j = i * interval;
                   x = p1.x + (signX * j);
                   y = p1.y + (signY * (j * a));
                   aOut.push({x : x, y: y});
               }
           }
           
           return aOut;
       } // _tween
            
    
    var _finishCallback = function(callback) {
        // por ahora reseteo...
        _framePointer = 0;
        if(!_.isUndefined(callback)) callback();
    }
    
    
    
    
    
       return {
           _fnTween : function(p1,p2){
                return _tween(p1,p2);
           },
           
           requestFrame : function() {
               var out = _frames[_framePointer];
               _framePointer++;
               if(_framePointer == _frames.length) _finishCallback();
               return out;
           },

           addKeys : function(aKeys) {
                // aca determinar que es aKeys, si obj o array de obj, y agregar a _keys
                // _keys = _keys.concat(aKeys)
                var i;
                for(i=0; i<_keys.length - 1; i++) {
                    var aTween = _tween(_keys[i], _keys[i+1]);
                    _frames = _frames.concat(aTween);
                }
           },
           
           resetPointer : function(frame){
               _framePointer = (_.isUndefined(frame)? 0:frame);
           },
           
           reset : function() {
               _frames = []; 
           },
           
           setDir : function(dir) {
               _dir = dir;
           },
           
           getType : function() {
                return "Tween";
           },

           onStart : function(callback) {
               
           },
           
           onFinish : function(callback) {
                _finishCallback(callback);
           }
           
       } // end return
  };
 
  return rootApp;
 
}( Orange || {} ));