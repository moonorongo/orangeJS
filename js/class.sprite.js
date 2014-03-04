Orange = ( function( rootApp ){
    
  // src puede ser ImageMap o Animation, ambos deben retornar un object con la referencia a la image, 
  // la posicion x,y y el width,height
  rootApp.Sprite = function(src){
    var _layer,
        _x,
        _y,
        _pivot,
        _src = src;
    
    
    

    
    
    return {
        _fnSetLayer : function (layer) {
            _layer = layer;
        },
        
        setX : function(x) {
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
  };
 
  
  return rootApp;
 
}( Orange || {} ));