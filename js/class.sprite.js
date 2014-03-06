Orange = ( function( rootApp ){
    
  // customSettings.src puede ser ImageMap o Animation, ambos deben retornar un object con la referencia a la image, 
  // la posicion x,y y el width,height
  rootApp.Sprite = function(customSettings){
    var _layer,
        _x,
        _y,
        _pivot,
        _src = customSettings.src;
    
    // settings por defecto
    var settings = {
        _fnSetLayer : function (layer) {
            _layer = layer;
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
        }
        
        
    }
    

    customSettings || ( customSettings = {} );
 
    _.extend( settings, customSettings );
    
    
    return settings
  };
 
  
  return rootApp;
 
}( Orange || {} ));