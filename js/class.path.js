Orange = ( function( rootApp ){
    
    rootApp.Path = function(config){
        // un path tiene que tener por lo menos DOS _keys... si no no es valido.
        var _keys = config.keys || [],
            _loopMode = config.loopMode || rootApp.Path.LOOP,
            _tween = config.tween || null,
            _dir = 1,
            _play = false,
/** @property {private Object} _posAnterior Tiene el punto anterior */
           _posAnterior;
            _keyPointer = 0;

        var _finishCallback, _startCallback;

        
        var _requestKey = function() {
            // quiza aca haya que poner un param optativo que permita obtener key, pero sin avanzar el _keyPointer
            if(_play) {
                _keyPointer += _dir;
            
                if(_keyPointer > _keys.length - 1) { 
                    switch(_loopMode) {
                        case 0 : _keyPointer = _keys.length - 1;
                                 break;
                        case 1 : _keyPointer = _keys.length - 1;
                                 _dir = -_dir;
                                 break;
                        case 2 : _keyPointer = 0;
                    }
                    if(!_.isUndefined(_finishCallback)) _finishCallback(this);
                }
                
                if(_keyPointer < 0) { 
                    switch(_loopMode) {
                        case 0 : _keyPointer = 0;
                                 break;
                        case 1 : _keyPointer = 0;
                                 _dir = -_dir;
                                 break;
                        case 2 : _keyPointer = _keys.length - 1;
                    }
                    
                    if(!_.isUndefined(_startCallback)) _startCallback(this);
                }
            }
        
            return _keys[_keyPointer];
        } // _requestKey


        
        var _getNextKey = function() {
            _tween.tweenTo(_requestKey());
        } // _getNextKey
        

        
        
        var _setTween = function(t) {
            _tween = t;
            _tween.resetPointer();
            
            var p1 = _requestKey();
            var p2 = _requestKey();
            _posAnterior = p2;
            _tween._fnTween(p1, p2);
            _tween.play();

            _tween.onStart(_getNextKey);
            _tween.onFinish(_getNextKey);
        }
        
        
        if(!_.isNull(_tween)) _setTween(_tween);
        
          

        return {
            setLoopMode : function(l) {
                _loopMode = l;
                return this;
            },
            
            setTween : function(tween) {
                _setTween(tween);
                return this;
            },  

            getTween : function() {
                return _tween;
            },  
           
           // para que querria esta mierda???
/*           
            requestKey : function() {
                return _requestKey();
            },
*/            
            requestFrame : function() {
                if(_.isUndefined(_tween)) {
                    return _requestKey();
                } else {
                    return _tween.requestFrame();
                }
            },

            addKeys : function(aKeys) {
                if(_.isArray(aKeys)) {
                    _keys = _keys.concat(aKeys);
                } else {
                    _keys.push(aKeys);
                }
                
                return this;
            },
            
            resetPointer : function(frame){
                _keyPointer = (_.isUndefined(frame)? 0:frame);
                _tween.resetPointer();
                return this;
            },
            
            reset : function() {
                _keys = []; 
                _tween.reset();
                return this;
            },
            
            setDir : function(dir) {
                _dir = dir;
                _tween.setDir(dir);
                return this;
            },

/**
 * @function {public Path} play Habilita el avance del puntero interno... o sea... play, obvio.
 */    
           play : function() {
                _play = true;
                _tween.play();
                return this;
           },

/**
 * @function {public Path} play Inhabilita el avance del puntero interno... o sea... pause, obvio.
 */    
           pause : function() {
                _play = false;
                _tween.pause();
                return this;
           },
           
           
            getType : function() {
                return "Path";
            },

            onStart : function(callback) {
                _startCallback = callback;
            },
            
            onFinish : function(callback) {
                _finishCallback = callback;
            }
            
        } // end return
    };
 
    rootApp.Path.NONE = 0;
    rootApp.Path.PINGPONG = 1;
    rootApp.Path.LOOP = 2;

    return rootApp;
 
}( Orange || {} ));