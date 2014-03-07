Orange = ( function( rootApp ){

    
  // customSettings.src puede ser ImageMap o Animation, ambos deben retornar un object con la referencia a la image, 
  // la posicion x,y y el width,height
  rootApp.Sprite = function(customSettings){
    var _layer,
        _x,
        _y,
        _pivot,
        _eventCallback,
        _src = customSettings.src;
    
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
            // interesante que this aca es el objeto... 
            _x = x;
            return this;
        },
        
        setY : function(y) {
            _y = y;
            return this;
        },
        
        update : function() {
            // aca en vez de src... ver de llamar a una fn de Animation, si lo que pase es una Animation
            var imgData = _src.get(0,0);
            _layer.drawImage(imgData.image, imgData.px, imgData.py, imgData.pw, imgData.ph, _x,_y,imgData.pw, imgData.ph);
        },
        
        on : function(event, callback) {
            orangeRoot.addToEventStack(this);
            // registrar el evento event en algun lugar por aca, para que la funcion que se llamara notificadora
            // sepa que eventos escuchar
            _eventCallback = callback;
        },
        
        notify : function(e) {
            // aca revisar si la posicion del mouse esta dentro de los limites de este sprite, entonces SI llamo al callback.
            _eventCallback(e);
        }
        
    }
    

    customSettings || ( customSettings = {} );
 
    _.extend( settings, customSettings );
    
    
    return settings
  };
 
  
  return rootApp;
 
}( Orange || {} ));