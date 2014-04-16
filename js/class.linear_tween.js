Orange = ( function( rootApp ){
    
  rootApp.LinearTween = function(config){

      //    _keys = config.keys || [],
//           _loopMode = config.loopMode || rootApp.Tween.NONE,
        
        var _frames = [],
           _dir = 1,
           _framePointer = 0,
           _play = false,
           _posAnterior;

           
           
       var _tween = function(p1, p2) {
           
           if(_.isUndefined(p1)) {
               _posAnterior = p2;
               _play = false;
               _framePointer = 0;
               return [{x : p2.x, y: p2.y}];
           }
           
           
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
           
/*           
       var _genFrames = function() {
           _frames = [];
            var i;
            for(i=0; i<_keys.length - 1; i++) {
                var aTween = _tween(_keys[i], _keys[i+1]);
                _frames = _frames.concat(aTween);
            }
       }
*/           
/*           
       if(_keys.length != 0) {
           _genFrames();
       }
*/        
    
       var _finishCallback, _startCallback;
    
    
    
       return {
           
           tweenTo : function(p2) {
                _frames = _tween(_posAnterior, p2);
                return this;
           },
           
           _fnTween : function(p1,p2){
                _frames = _tween(p1,p2);
                return this;
           },
           
           requestFrame : function() {
               
               if(_play) {
                    _framePointer += _dir;
                
                    if(_framePointer > _frames.length - 1) { 
                        _framePointer = _frames.length - 1;
                        _play = false;
                        if(!_.isUndefined(_finishCallback)) _finishCallback(this);
                    }
                    
                    if(_framePointer < 0) { 
                        _framePointer = 0;
                        _play = false;
                        if(!_.isUndefined(_startCallback)) _startCallback(this);
                    }
               }
               
               return _frames[_framePointer];
           },

/*           
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
*/

           play : function() {
                _play = true;
                return this;
           },

           pause : function() {
                _play = false;
                return this;
           },
           
           resetPointer : function(frame){
               _framePointer = (_.isUndefined(frame)? 0:frame);
               return this;
           },
           
           reset : function() {
               _frames = []; 
               _posAnterior = undefined;
               return this;
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
 
  rootApp.LinearTween.NONE = 0;
  rootApp.LinearTween.PINGPONG = 1;
  rootApp.LinearTween.LOOP = 2;
  
  return rootApp;
 
}( Orange || {} ));