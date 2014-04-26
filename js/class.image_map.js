Orange = ( function( rootApp ){
    
  rootApp.ImageMap = function(imgData){
    
    var _image = imgData.image,
        _nFrames = [];

        // obtencion automatica de frames en base a la transparencia del frame
        // si el frame es totalmente transparente, entonces se considera que la animacion llego a su fin.
        // contra: no se podra tener frames totalmente transparentes.
        var _tmpCanvas = document.createElement("canvas");
        _tmpCanvas.width = _image.width;
        _tmpCanvas.height = _image.height;
        var _tempContext = _tmpCanvas.getContext('2d');
        
        _tempContext.clearRect(0,0,_image.width,_image.height);
        _tempContext.drawImage(_image, 0, 0);

        var _imagenWidth = _image.width;
        var _imagenHeight = _image.height;
        var _spriteWidth  = imgData.width;
        var _spriteHeight = imgData.height;
        var _dieStatus = imgData.dieStatus || 0;
        var _cantidadFrames = Math.ceil(_imagenWidth / _spriteWidth);
        var _statusLength =  Math.ceil(_imagenHeight / _spriteHeight);
        var _status = 0;

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
            
            // si no encontro el ultimo frame vacio, entonces setea el ultimo con el valor maximo
            if(columna == _cantidadFrames - 1) _nFrames[fila] = _cantidadFrames;
                
        } // for columna
        } // for fila
        // fin inicializacion ImageMap;

    
    
       return {
           getChar : function(charNumber) {
               var tWidth = Math.floor(_imagenWidth / _spriteWidth);
               var s = Math.floor(charNumber / tWidth);
               var frame = charNumber % tWidth;
               return { image : _image, px : _spriteWidth * frame, py : _spriteHeight * s};
           },
           
           getFrame : function(frame, status) {
               var s = (_.isUndefined(status))? _status : status;
               return { image : _image, px : _spriteWidth * frame, py : _spriteHeight * s};
           },
           
           setStatus : function(s) {
               _status = s;
           },
           
           _fnGetDieStatus : function() {
                return _dieStatus;
           },
           
           setStatusDie : function() {
                _status = _dieStatus;
           },
           
           getImage : function() {
                return _image;
           },
           

           getSpriteWidth : function() {
                return _spriteWidth; 
           },
           
           getSpriteHeight : function() {
               return _spriteHeight;
           },
           
           getType : function() {
                return "ImageMap";
           },
            
           getCantFrames : function(status) {
               return _nFrames[status];
           },
           
           _fnGetStatusDieCantFrames : function() {
               return _nFrames[_dieStatus];
           }
       }
  };
 
  return rootApp;
 
}( Orange || {} ));