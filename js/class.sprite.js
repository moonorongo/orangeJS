Orange = ( function( rootApp ){

    
  // customSettings.src puede ser ImageMap o Animation, ambos deben retornar un object con la referencia a la image, 
  // la posicion x,y y el width,height
  rootApp.Sprite = function(customSettings){
    var _layer,
        _x = 0,
        _y = 0,
        _pivot,
        _speed = customSettings.speed || 1,
        _eventCallback = {},
        _src = customSettings.src,
        _w = _src.getSpriteWidth(),
        _h = _src.getSpriteHeight(),
        _pivotX = customSettings.pivotX || Math.floor(_w / 2),
        _pivotY = customSettings.pivotY || Math.floor(_h / 2),
        _dirX = 0,name, e, extra
        _dirY = 0;
    
    var orangeRoot;         
    
    // setea la direccion de avance de acuerdo a la posicion suministrada
    var _setDirX = function(x) {
        if(x > _x) {
            _dirX = Orange.SPRITE_MOVE_RIGHT;
        } else if (x < _x) {
            _dirX = Orange.SPRITE_MOVE_LEFT;
        } else {
            _dirX = Orange.SPRITE_MOVE_NONE;
        }
    }
        
    // setea la direccion de avance de acuerdo a la posicion suministrada
    var _setDirY = function(y) {
        if(y > _y) {
            _dirY = Orange.SPRITE_MOVE_UP;
        } else if (y < _y) {
            _dirY = Orange.SPRITE_MOVE_DOWN;
        } else {
            _dirY = Orange.SPRITE_MOVE_NONE;
        }        
    }   
    
    
    var _setX = function(x) {
        _setDirX(x);

        if(_layer.getBoundaryStatus(x + _pivotX, _y + _pivotY).r != 0) { 
            // si puede, lo actualiza
            _x = x;
        } else {
            // si no, veo si puedo ir para arriba o abajo. (la cantidad de _speed pixels...)
            if(_layer.getBoundaryStatus(x + _pivotX, (_y + _pivotY) - _speed).r != 0) { 
                _y -= _speed;
            }
            
            if(_layer.getBoundaryStatus(x + _pivotX, (_y + _pivotY) + _speed).r != 0) { 
                _y += _speed;
            }
        } // puedo posicionar
    }; // setX

    
    var _setY = function(y) {
        _setDirY(y);
        
        if(_layer.getBoundaryStatus(_x + _pivotX, y + _pivotY).r != 0) {
            _y = y;
        } else {
            // si no, veo si puedo ir para izq o der. (la cantidad de _speed pixels...)
            if(_layer.getBoundaryStatus(x + _pivotX - _speed, _y + _pivotY).r != 0) { 
                _x -= _speed;
            }
            
            if(_layer.getBoundaryStatus(x + _pivotX + _speed, _y + _pivotY).r != 0) { 
                _x += _speed;
            }
        }
    }
    
    
    
    
    // settings por defecto
    var settings = {
        _fnSetLayer : function (layer) {
            _layer = layer;
        },
        
        _fnSetRootContext : function(root) {
            orangeRoot = root;
        },
        
        setX : function(x) {
            _setX(x);
            return this;
        },
        
        setY : function(y) {
            _setY(y);
            return this;
        },

        getX : function(x) {
            return _x;
        },
        
        getY : function(y) {
            return _y;
        },
        
        incX : function(dx) { 
            var x = _x;
            x += dx;
            _setX(x);
            return this;
        },
           
        incY : function(dy) { 
            y = _y;
            y += dy;
            _setY(y);
            return this;
        },
        
        setSpeed: function(speed) {
            _speed = speed;
        },
        
        getSpeed: function(speed) {
            return _speed;
        },
        

        getWidth : function(x) {
            return _w;
        },
        
        getHeight : function(y) {
            return _h;
        },

        
        update : function() {
            // aca en vez de src... ver de llamar a una fn de Animation, si lo que pase es una Animation
            var imgData = _src.get(0,0);
            _layer.getCanvas().drawImage(imgData.image, imgData.px, imgData.py, _w, _h, _x,_y,_w, _h);
        },
        
        on : function(event, callback) {
            orangeRoot.addToEventStack(event, this);
            // registrar el evento event en algun lugar por aca, para que la funcion que se llamara notificadora
            // sepa que eventos escuchar
            _eventCallback[event] = callback;
        },
        
        notify : function(eventName, e) {
            var rX = e.clientX - orangeRoot.getCanvasElement().offsetLeft;
            var rY = e.clientY - orangeRoot.getCanvasElement().offsetTop;
            var eventData = {
                relativeX : rX,
                relativeY : rY,
                clicked : false,
                eventName : eventName,
                e : e
            };
            
            // si esta dentro de la caja del sprite seteo propiedad "clicked" : true
            if ( (rX >= _x) && 
                 (rY >= _y) && 
                 (rX <= _x + _w) && 
                 (rY <= _y + _h) ) eventData.clicked = true;
            
            _eventCallback[eventName](eventData, this);    
        } // end notify
        
    }
    

    customSettings || ( customSettings = {} );
 
    _.extend( settings, customSettings );
    
    
    return settings
  }; // sprite
 
  
  return rootApp;
 
}( Orange || {} ));