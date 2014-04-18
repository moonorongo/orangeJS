/*
 * Declares {@link Animation} class etc.
 * @file class.animation.js
 * @version 0.1
 */

/**
 * @class Animation 
 * Una Animation recibe un ImageMap y gestiona una animacion en base a unos parametros de inicializacion. Una Animation gestiona diferentes "animaciones" que aqui se consideran "status" (por ejemplo animacion a la derecha, a la izquierda... explotando...etc)
 * 
 * @constructor Animation
 * @param {ImageMap} imageMap El ImageMap con los cuadros y estados.
 * @param {optional Object} config La configuracion de la animacion y de cada Status
 */


Orange = ( function( rootApp ){
    
  rootApp.Animation = function(imageMap, config){
    
/** @property {private ImageMap} _imageMap El ImageMap asignado */
        var _imageMap = imageMap;

/** @property {private Object} _defaults Esoo mismo */
        var _defaults = {
            speed : 20
        }
        
        
/** @property {private int} _imagenWidth el ancho del cada frame, tomado del ImageMap asignado */
        var _imagenWidth = _imageMap.getSpriteWidth(),
/** @property {private int} _imagenHeight el alto del cada frame, tomado del ImageMap asignado */
            _imagenHeight = _imageMap.getSpriteHeight(),
/** @property {private Object} _config la configuracion interna de la Animation, tomada de la configuracion de la inicializacion, y los parametros defaults */
            _config = config || _defaults,
/** @property {private int} _frame El puntero interno de la Animation. */
            _frame=0, 
/** @property {private int} _status La animacion que quiero ejecutar (seria la fila del ImageMap). */
            _status = 0,
/** @property {private int} _speed La velocidad con que se ejecuta la animacion. */
            _speed = _config.speed,
/** @property {private int} _speedCounter Contador de uso interno para gestionar la velocidad de la animacion. */
            _speedCounter = 0;
    
    
       return {
/**
 * @function {public Object} getFrame Obtiene un frame, incrementa el puntero interno, y demas. Devuelve un objeto, con una referencia a la imagen, y la posicion x e y dentreo de la misma, segun el status asignado.
 */    
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

/**
 * @function {public int} getSpriteWidth obtiene el ancho del Sprite.
 */    
           getSpriteWidth : function() {
                return _imagenWidth;
           },
           
 /**
 * @function {public int} getSpriteHeight obtiene la altura del Sprite.
 */    
          getSpriteHeight : function() {
               return _imagenHeight;
           },
           
           getType : function() {
                return "Animation";
           },

/**
 * @function {public void} setStatus Asigna el status (la fila) que quiero reproducir.
 * @param {int} status El numero de status que quiero asignar.
 */    
           setStatus : function(s) {
               _status = s;
           },
           
/**
 * @function {public void} setStatusDie Asigna el status al dieStatus asignado en la instanciacion del ImageMap, el default es 0.
 */    
           setStatusDie : function() {
                _status = _imageMap._fnGetDieStatus();
           },

/**
 * @function {public int} _fnGetStatusDieCantFrames Retorna la cantidad de frames que vamos a necesitar para la propiedad _muriendo en Sprite.
 */    
           _fnGetStatusDieCantFrames : function() {
               var i = _imageMap._fnGetDieStatus();
               var speed = ( _.isUndefined(_config.statusConfig[i].speed) )? _speed : _config.statusConfig[i].speed;
               return _imageMap._fnGetStatusDieCantFrames() * (speed - 1);
           }           
       }
  };
 
  return rootApp;
 
}( Orange || {} ));