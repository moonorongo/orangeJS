Orange = ( function( rootApp ){
    
  rootApp.ImageMap = function(image,width,height){
    
    var _image = image,
        _nFrames = [];

        // obtencion automatica de frames en base a la transparencia del frame
        // si el frame es totalmente transparente, entonces se considera que la animacion llego a su fin.
        // contra: no se podra tener frames totalmente transparentes.
        var _tmpCanvas = document.createElement("canvas");
        _tmpCanvas.width = _image.width;
        _tmpCanvas.height = _image.height;
        var _tempContext = _tmpCanvas.getContext('2d');
        
        _tempContext.clearRect(0,0,500,400);
        _tempContext.drawImage(_image, 0, 0);

        var _imagenWidth = _image.width;
        var _imagenHeight = _image.height;
        var _spriteWidth  = width;
        var _spriteHeight = height;
        var _cantidadFrames = Math.ceil(_imagenWidth / _spriteWidth);
        var _statusLength =  Math.ceil(_imagenHeight / _spriteHeight);

        for(var fila = 0; fila < _statusLength; fila++) {
        for(var columna = 0; columna < _cantidadFrames; columna++) {
            
            var data = _tempContext.getImageData(columna * _spriteWidth, fila * _spriteHeight,  _spriteWidth, _spriteHeight).data;
            var longitudDatos = data.length;
            var celdaTransparente = true;
            
            for(var i = 0;  i < longitudDatos; i+=4) {
            if (data[i+3] != 0) celdaTransparente = false;
            }
            
            if (celdaTransparente) {
                _nFrames[fila] = columna;
                break;
            };
        } // for columna
        } // for fila
        // fin inicializacion ImageMap;

    
    
       return {
           get : function(status, frame) {
               return { image : _image, px : _spriteWidth * frame, py : _spriteHeight * status, pw : _spriteWidth, ph : _spriteHeight};
           },
           
           type : function() {
                return "ImageMap";
           },
            
           getCantFrames : function(status) {
               return _nFrames[status];
           }
       }
  };
 
  return rootApp;
 
}( Orange || {} ));