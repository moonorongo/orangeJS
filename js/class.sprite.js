Orange = ( function( rootApp ){

    
  // customSettings.src puede ser ImageMap o Animation, ambos deben retornar un object con la referencia a la image, 
  // la posicion x,y y el width,height
  rootApp.Sprite = function(customSettings){
    var _layer,
        _x,
        _y,
        _pivot,
        _eventCallback = {},
        _src = customSettings.src;
        _w = _src.getSpriteWidth();
        _h = _src.getSpriteHeight();
    
    var orangeRoot;         
        
    // settings por defecto
    var settings = {
        _fnSetLayer : function (layer) {
            _layer = layer;
        },
        
        _fnSetRootContext : function(root) {
            orangeRoot = root;
        },
        
        setX : function(x) {
            _x = x;
            return this;
        },
        
        setY : function(y) {
            _y = y;
            return this;
        },

        getX : function(x) {
            return _x;
        },
        
        getY : function(y) {
            return _y;
        },
        

        decX : function(x) { _x--; },
        decY : function(y) { _y--; },
        incX : function(x) { _x++; },
        incY : function(y) { _y++; },
        
        

        getWidth : function(x) {
            return _w;
        },
        
        getHeight : function(y) {
            return _h;
        },

        
        update : function() {
            // aca en vez de src... ver de llamar a una fn de Animation, si lo que pase es una Animation
            var imgData = _src.get(0,0);
            _layer.drawImage(imgData.image, imgData.px, imgData.py, _w, _h, _x,_y,_w, _h);
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
            var extra = {
                relativeX : rX,
                relativeY : rY,
                clicked : false
            };
            
            // si esta dentro de la caja del sprite seteo propiedad "clicked" : true
            if ( (rX >= _x) && 
                 (rY >= _y) && 
                 (rX <= _x + _w) && 
                 (rY <= _y + _h) ) extra.clicked = true;
            
            _eventCallback[eventName](eventName, e, extra);    
        } // end notify
        
    }
    

    customSettings || ( customSettings = {} );
 
    _.extend( settings, customSettings );
    
    
    return settings
  };
 
  
  return rootApp;
 
}( Orange || {} ));