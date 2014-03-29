Orange = ( function( rootApp ){

    
  // customSettings.src puede ser ImageMap o Animation
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
        _dirX = 0,
        name, 
        e, 
        extra,
        _dirY = 0,
        _prepareToDestroy = false,
        _muriendo = 0;
    
    var orangeRoot;         
    
    // setea la direccion de avance de acuerdo a la posicion suministrada
    var _setDirX = function(x) {
        if(x > _x) {
            _dirX = Orange.Sprite.MOVE_RIGHT;
        } else if (x < _x) {
            _dirX = Orange.Sprite.MOVE_LEFT;
        } else {
            _dirX = Orange.Sprite.MOVE_NONE;
        }
    }
        
        
        
    // setea la direccion de avance de acuerdo a la posicion suministrada
    var _setDirY = function(y) {
        if(y > _y) {
            _dirY = Orange.Sprite.MOVE_UP;
        } else if (y < _y) {
            _dirY = Orange.Sprite.MOVE_DOWN;
        } else {
            _dirY = Orange.Sprite.MOVE_NONE;
        }        
    }   
    
    
    var _setX = function(x) {
        _setDirX(x);

        if(_layer._fnGetBoundaryStatus(x + _pivotX, _y + _pivotY).r != 0) { 
            // si puede, lo actualiza
            _x = x;
        } else {
            // si no, veo si puedo ir para arriba o abajo. (la cantidad de _speed pixels...)
            if(_layer._fnGetBoundaryStatus(x + _pivotX, (_y + _pivotY) - _speed).r != 0) { 
                _y -= _speed;
            }
            
            if(_layer._fnGetBoundaryStatus(x + _pivotX, (_y + _pivotY) + _speed).r != 0) { 
                _y += _speed;
            }
        } // puedo posicionar
    }; // setX

    
    var _setY = function(y) {
        _setDirY(y);
        
        if(_layer._fnGetBoundaryStatus(_x + _pivotX, y + _pivotY).r != 0) {
            _y = y;
        } else {
            // si no, veo si puedo ir para izq o der. (la cantidad de _speed pixels...)
            if(_layer._fnGetBoundaryStatus(x + _pivotX - _speed, _y + _pivotY).r != 0) { 
                _x -= _speed;
            }
            
            if(_layer._fnGetBoundaryStatus(x + _pivotX + _speed, _y + _pivotY).r != 0) { 
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
        
        getDir : function() {
            return _dirX + _dirY;
        },

        getAnimation : function() {
            return _src;
        },
        
        destroy : function() {
            _prepareToDestroy = true;
        },
        
        _fnUpdate : function() {
            // aca en vez de src... ver de llamar a una fn de Animation, si lo que pase es una Animation
            // esto funciona asi: _src puede ser una Animation o ImageMap... le paso (0,0) por si es un ImageMap, 
            // y si es una Animation, no es tenido en cuenta.
            // getFrame(), en Animation o ImageMap devuelven imgData.
/*
             1) quitar todos los bind del sprite, eso es, eliminar de Orange._eventStack.____ cada instancia.
            2) quitar este sprite de todos los layers en que se encuentre... es muy loco, pero se puede poner el mismo
            sprite en varios layers...
            3) hacer algo asi como destroy this... sera posible? uhmm... esto pendiente... pero estaria bueno destruir la instancia...
 */            
            var imgData; 
            if(_prepareToDestroy) {
                _prepareToDestroy = false;
                _src.setStatus(1); // luego ver como definir en la animation de alguna manera indicar cual es el status A MORIIIR
                imgData = _src.getFrame(0);
                _layer._fnGetCanvas().drawImage(imgData.image, imgData.px, imgData.py, _w, _h, _x,_y,_w, _h);
                _muriendo = 10; // inicia un timer para destruir el sprite
            } else {
                imgData = _src.getFrame(0,0);
                _layer._fnGetCanvas().drawImage(imgData.image, imgData.px, imgData.py, _w, _h, _x,_y,_w, _h);
            }

/*            
            if(_muriendo > 0) { 
                _muriendo--;
            } else { // ya murio, lo reviento del todo.
                orangeRoot.removeFromEventStack(this);
                _layer.removeSprite(this);
            }
*/
        },
        
        on : function(event, callback) {
            orangeRoot.addToEventStack(event, this);
            _eventCallback[event] = callback;
        },
        
        _fnNotify : function(eventName, e) {
            var rX, rY, eventData, aCollision = [];
            var _this = this;
            
            // para cualquier evento que no sea collision voy a tomar algunos valores para enviar al objeto q le mando al callback
                if (eventName=="collision"){ 
                // ver si solo hay un sprite... ;P
                _.each(_layer._fnGetSprites(), function(sprite) {
                    if(sprite !== _this) {
                        var p1x = _x;
                        var p1y = _y;
                        var p2x = _x + _w;
                        var p2y = _y + _h;
                        
                        var o1x = sprite.getX();
                        var o1y = sprite.getY();
                        var o2x = sprite.getX() + sprite.getWidth();
                        var o2y = sprite.getY() + sprite.getHeight();
                        
                        var totalWidth = _w + sprite.getWidth();
                        var totalHeight = _h + sprite.getHeight();
                        var restaX = o2x - p1x;
                        var restaY = o2y - p1y;
                        
                        if(
                            (restaX > 0) && (restaX < totalWidth) &&
                            (restaY > 0) && (restaY < totalHeight) 
                        ) {
                         // se colisiona... 
                         aCollision.push(sprite);
                        }
                    } // if
                });
            } else  if(eventName=="enterFrame"){ // o enterFrame
                eventData = {
                    eventName : eventName
                };
                
            } else { // si es lo demas (keypress, keydown, click)
                
                var rX = e.clientX - orangeRoot.getCanvasElement().offsetLeft;
                var rY = e.clientY - orangeRoot.getCanvasElement().offsetTop;
                eventData = {
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
            } // end if keypress
            
            // el callback del evento que se ejecuta, envia eventData, el sprite, y si es collision un array de sprites con los que esta colisionando
            _eventCallback[eventName](eventData, this, aCollision);    
        } // end notify
        
    }
    

    customSettings || ( customSettings = {} );
 
    _.extend( settings, customSettings );
    
    
    return settings
  }; // sprite
 

 
// constantes utilizadas por la clase
  rootApp.Sprite.MOVE_NONE = 0;
  rootApp.Sprite.MOVE_UP = 1;
  rootApp.Sprite.MOVE_UP_RIGHT = 5;
  rootApp.Sprite.MOVE_RIGHT = 4;
  rootApp.Sprite.MOVE_DOWN_RIGHT = 20;
  rootApp.Sprite.MOVE_DOWN = 16;
  rootApp.Sprite.MOVE_DOWN_LEFT = 80;
  rootApp.Sprite.MOVE_LEFT = 64;
  rootApp.Sprite.MOVE_UP_LEFT = 65;
  
  
  return rootApp;
 
}( Orange || {} ));