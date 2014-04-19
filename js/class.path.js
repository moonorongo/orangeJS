Orange = ( function( rootApp ){
    
    rootApp.Path = function(config){
        // un path tiene que tener por lo menos TRES _keys... si no no es valido.
        var _keys = config.keys || [],
            _loopMode = config.loopMode || rootApp.Path.NONE,
            _tween = config.tween || null,
            _dir = 1,
            _play = false,
            _keyPointer = 0;

        var _finishCallback, _startCallback;

        var _requestKey = function() {
            // quiza aca haya que poner un param optativo que permita obtener key, pero sin avanzar el _keyPointer
            if(_play) {
                _keyPointer += _dir;
            
                if(_keyPointer > _keys.length - 2) { 
                    switch(_loopMode) {
                        Orange.Path.NONE :      _keyPointer = _keys.length - 2;
                                                break;
                        Orange.Path.PINGPONG :  _keyPointer = _keys.length - 2;
                                                _dir = -_dir;
                                                break;
                        Orange.Path.LOOP :      _keyPointer = 0;
                    }
                    if(!_.isUndefined(_finishCallback)) _finishCallback(this);
                }
                
                if(_keyPointer < 0) { 
                    switch(_loopMode) {
                        Orange.Path.NONE :      _keyPointer = 0;
                                                break;
                        Orange.Path.PINGPONG :  _keyPointer = 0;
                                                _dir = -_dir;
                                                break;
                        Orange.Path.LOOP :      _keyPointer = _keys.length - 2;
                    }
                    
                    if(!_.isUndefined(_startCallback)) _startCallback(this);
                }
            }
        
            return _keys[_keyPointer];
        } // _requestKey



        return {
            setLoopMode : function(l) {
                _loopMode = l;
                return this;
            },
            
            setTween : function(tween) {
                // aca al tween le asigno como onFinish y onStart una funcion que voy a tener aca, que lo que va a hacer
                // es obtener un nuevo par de keys, y regenerar en el tween los frames.
                // tambien asignara Path._dir a Tween._dir
                // y seguramente algo mas... 
                _tween = tween;
                _tween._fnTween(_keys[_keyPointer], _keys[_keyPointer + 1]);
                _tween.resetPointer();
                _tween.play();
                
            
                return this;
            },  
            
            requestKey : function() {
                return _requestKey();
            },
            
            requestFrame : function() {
                // aca usar el _tween asignado, ver si puedo obtener un frame, si obtengo el ultimo _key, interpolar los siguientes... ver mas
                if(_.isUndefined(_tween)) {
                    // retornar una _key
                } else {
                    // retornar una interpolacion
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
                return this;
            },
            
            reset : function() {
                _keys = []; 
                return this;
            },
            
            setDir : function(dir) {
                _dir = dir;
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