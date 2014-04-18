Orange = ( function( rootApp ){
    
  rootApp.Tween = function(config){
    
        
        var _keys = config.keys || [],
           _loopMode = config.loopMode || rootApp.Tween.NONE,
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
           
           
       var _genFrames = function() {
           _frames = [];
            var i;
            for(i=0; i<_keys.length - 1; i++) {
                var aTween = _tween(_keys[i], _keys[i+1]);
                _frames = _frames.concat(aTween);
            }
       }
           
           
       if(_keys.length != 0) {
           _genFrames();
       }
        
    
       var _finishCallback, _startCallback;
    
    
    
    
    
       return {
           _fnTween : function(p1,p2){
                return _tween(p1,p2);
           },
           
           requestFrame : function() {
               
               _framePointer += _dir;

               if(_loopMode == rootApp.Tween.PINGPONG) {
                   if(_framePointer > _frames.length - 1) { 
                       _dir = -_dir;
                       _framePointer = _frames.length - 1;
                       if(!_.isUndefined(_finishCallback)) _finishCallback(this);
                   }
                   
                   if(_framePointer < 0) { 
                       _dir = -_dir;
                       _framePointer = 0;
                       if(!_.isUndefined(_startCallback)) _startCallback(this);
                   }
               }
               
               
               if(_loopMode == rootApp.Tween.LOOP) {
                   if(_framePointer > _frames.length - 1) { 
                       _framePointer = 0;
                       if(!_.isUndefined(_finishCallback)) _finishCallback(this);
                   }
                   
                   if(_framePointer < 0) { 
                       _framePointer = _frames.length - 1;
                       if(!_.isUndefined(_startCallback)) _startCallback(this);
                   }
               }
          
               return _frames[_framePointer];
           },

           addKeys : function(aKeys) {
                // aca determinar que es aKeys, si obj o array de obj, y agregar a _keys
                // _keys = _keys.concat(aKeys)
                if(_.isArray(aKeys)) {
                    _keys = _keys.concat(aKeys);
                } else {
                    _keys.push(aKeys);
                }
                
                _genFrames();
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
               _startCallback = callback;
           },
           
           onFinish : function(callback) {
                _finishCallback = callback;
           }
           
       } // end return
  };
 
  rootApp.Tween.NONE = 0;
  rootApp.Tween.PINGPONG = 1;
  rootApp.Tween.LOOP = 2;
  
  return rootApp;
 
}( Orange || {} ));