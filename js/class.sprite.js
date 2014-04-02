/*
 * Declares {@link Sprite} class etc.
 * @file class.sprite.js
 * @version 0.1
  */

/**
 * @class Sprite 
 * un sprite es un bloque que se puede mover, y que va a recibir eventos.
 * Cada sprite puede tener asignada una ImageMap o una Animation.
 * Si recibe un imageMap pone por defecto el primer cuadro/estado
 * 
 * @constructor Sprite
 * @param {Object} customSettings Un objeto de inicializacion del Sprite. El objeto debera tener las siguientes propiedades: <br>
 * <em>src</em> : ImageMap o Animation utilizada por el Sprite <br>
 * optional int <em>pivotX</em>: el punto utilizado como limite contra el _boundary Layer.<br>
 * optional int <em>pivotY</em>: idem <br>
 * optional int <em>class</em>: Un identificador que indica a que clase pertenece. Puedes utilizar algunos de los identificadores predefinidos internamente, o  crear indicadores propios<br>
 * optional <em>speed</em>: la velocidad con la que avanzara... no demasiado util, todavia<br>
 */
Orange = ( function( rootApp ){

  rootApp.Sprite = function(customSettings){
/** @property {private Layer} _layer Referencia al Layer que pertenece. */
    var _layer,
/** @property {private int} _x Posicion x del Sprite. */
        _x = 0,
/** @property {private int} _y Posicion y del Sprite. */
        _y = 0,
        _pivot,
        
/** @property {private int} _speed Velocidad interna. */
        _speed = customSettings.speed || 1,
        
/** @property {private Object} _eventCallback Objecto interno con los distintos callbacks de los eventos asignados al Sprite. */
        _eventCallback = {},
        
/** @property {private ImageMap} _src Imagen asociada al Sprite, puede ser un ImageMap o una Animation. */
        _src = customSettings.src,
        
/** @property {private int} _w Ancho del Sprite. */
        _w = _src.getSpriteWidth(),
/** @property {private int} _h Alto del Sprite. */
        _h = _src.getSpriteHeight(),
           
/** @property {private int} _pivotX Punto utilizado para ver si se puede colocar el sprite en esa posicion. */
        _pivotX = customSettings.pivotX || Math.floor(_w / 2),
/** @property {private int} _pivotY Punto utilizado para ver si se puede colocar el sprite en esa posicion.  */
        _pivotY = customSettings.pivotY || Math.floor(_h / 2),
           
/** @property {private int} _class Numero interno para clasificar de alguna manera al Sprite. */
        _class = customSettings.class || 0,
/** @property {private int} _dirX Direccion horizontal hacia donde esta yendo el Sprite. */
        _dirX = 0,
/** @property {private int} _dirY Direccion vertical hacia donde esta yendo el Sprite. */
        _dirY = 0,
//        name, 
        e, 
//        extra,
        
/** @property {private boolean} _prepareToDestroy Flag, se pone en true cuando llamo a Sprite.destroy(). */
        _prepareToDestroy = false,
        
/** @property {private boolean} _removeFromLayer Flag, cuando llamo a Sprite.destroy() indica si debo, ademas, quitar del Layer el sprite. 
 * Esto es util para cuando quiero destruir un Sprite, pero quiero dejar el "cadaver" como imagen. 
 */
        _removeFromLayer = false,
        
/** @property {private int} _muriendo Numero que tiene la cantidad de frames que dura la animacion que se ejecuta cuando destruyo al Sprite. */
        _muriendo = (_src.getType() == "Animation")?  _src._fnGetStatusDieCantFrames() : 1;
    
    var orangeRoot;         
    
/**
 * @function {private void} _setDirX Establece la direccion de movimiento del Sprite.
 * @param {int} x nueva posicion.
 */    
    var _setDirX = function(x) {
        if(x > _x) {
            _dirX = Orange.Sprite.MOVE_RIGHT;
        } else if (x < _x) {
            _dirX = Orange.Sprite.MOVE_LEFT;
        } else {
            _dirX = Orange.Sprite.MOVE_NONE;
        }
    }
        
        
/**
 * @function {private void} _setDirY Establece la direccion de movimiento del Sprite.
 * @param {int} y nueva posicion.
 */    
    var _setDirY = function(y) {
        if(y > _y) {
            _dirY = Orange.Sprite.MOVE_UP;
        } else if (y < _y) {
            _dirY = Orange.Sprite.MOVE_DOWN;
        } else {
            _dirY = Orange.Sprite.MOVE_NONE;
        }        
    }   
    
    
/**
 * @function {private void} _setX Posiciona el Sprite en la pantalla. Checkea si puede posicionarlo, y actualiza la direccion de movimiento.
 * @param {int} x nueva posicion.
 */    
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

/**
 * @function {private void} _setY Posiciona el Sprite en la pantalla. Checkea si puede posicionarlo, y actualiza la direccion de movimiento.
 * @param {int} y nueva posicion.
 */    
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
        
        destroy : function(removeFromLayer) {
            _prepareToDestroy = true;
            _removeFromLayer = (_.isUndefined(removeFromLayer))? true : removeFromLayer;
        },
        
        getClass : function() {
            return _class;
        },
        
        setClass : function(c) {
            _class = c;
        },
        
        _fnUpdate : function() {
            // esto funciona asi: _src puede ser una Animation o ImageMap... le paso (0) por si es un ImageMap, 
            // ImageMap.getFrame puede tomar (frame) o (frame, status): si no especifico status, toma el status interno (esto es para compatibilidad con Animation)
            // y si es una Animation, no es tenido en cuenta.
            // getFrame(), en Animation o ImageMap devuelven imgData.

            var imgData; 
            if(_prepareToDestroy) {
                _src.setStatusDie(); 
                imgData = _src.getFrame(0);
                _layer._fnGetCanvas().drawImage(imgData.image, imgData.px, imgData.py, _w, _h, _x,_y,_w, _h);

                if(_muriendo > 0) { 
                    _muriendo--;
                } else { // ya murio, lo reviento del todo.
                    orangeRoot.removeFromEventStack(this);
                    if(_removeFromLayer) _layer.removeSprite(this);
                }                
            } else {
                imgData = _src.getFrame(0);
                _layer._fnGetCanvas().drawImage(imgData.image, imgData.px, imgData.py, _w, _h, _x,_y,_w, _h);
            }

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

    
    // clases predefinidas.
    // se pueden agregar las que quiera el usuario, siempre que sean potencias de 2
    rootApp.Sprite.Classes = { 
        "NONE" : 0,
        "FRIEND" : 1,
        "ENEMY" : 2
    }
  
  
  return rootApp;
 
}( Orange || {} ));