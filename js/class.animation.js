Orange = ( function( rootApp ){
    
  rootApp.Animation = function(imageMap, config){
    
        var _imageMap = imageMap;

        var _defaults = {
            speed : 20
        }
        
        
        var _imagenWidth = _imageMap.getSpriteWidth(),
            _imagenHeight = _imageMap.getSpriteHeight(),
            _config = config || defaults,
            _frame=0, _status = 0,
            _speed = _config.speed,
            _speedCounter = 0;
    
    
       return {
           getFrame : function() {
               var currentSpeed = ( _.isUndefined(_config.statusConfig[_status].speed) )? _speed : _config.statusConfig[_status].speed;
               if(_speedCounter < currentSpeed) {
                   _speedCounter++;
               } else {
                   _speedCounter = 0;
                   if(_frame < _imageMap.getCantFrames(_status) - 1) {
                       _frame++;
                   } else {
                       _frame = 0;       
                   }
               } // if _speedCounter < _speed
               
               return { image : _imageMap.getImage(), px : _imagenWidth * _frame, py : _imagenHeight * _status};
           },

           getSpriteWidth : function() {
                return _imagenWidth;
           },
           
           getSpriteHeight : function() {
               return _imagenHeight;
           },
           
           getType : function() {
                return "Animation";
           },
/*           
           _fnGetStatusSpeed : function(i) {
               var speed = ( _.isUndefined(_config.statusConfig[i].speed) )? _speed : _config.statusConfig[i].speed;
               return speed;
           },
*/           
           setStatus : function(s) {
               _status = s;
           },
           
           setStatusDie : function() {
                _status = _imageMap._fnGetDieStatus();
           },
           
           // retorna la cantidad de frames que vamos a necesitar para la propiedad _muriendo en Sprite.
           _fnGetStatusDieCantFrames : function() {
               var i = _imageMap._fnGetDieStatus();
               var speed = ( _.isUndefined(_config.statusConfig[i].speed) )? _speed : _config.statusConfig[i].speed;
               return _imageMap._fnGetStatusDieCantFrames() * (speed - 1);
           }           
           
       }
  };
 
  return rootApp;
 
}( Orange || {} ));