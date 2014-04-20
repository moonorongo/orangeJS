/*
 * Declares {@link LinearTween} class etc.
 * @file class.linear_tween.js
 * @version 0.1
  */

/**
 * @class LinearTween 
 * Un Tween es una interpolacion entre 2 puntos. La clase puede interpolar 2 puntos que se le pasen, o puede ser asignada a un Sprite para que interpole todos sus movimientos
 * 
 * @constructor LinearTween
 */

Orange = ( function( rootApp ){
    
  rootApp.LinearTween = function(config){
        
/** @property {private Array} _frames Array con las posiciones interpoladas */
        var _frames = [],
/** @property {private int} _dir Direccion de avance en cada requestFrame. */
           _dir = 1,
/** @property {private int} _framePointer Puntero interno con la posicion de _frame. */
           _framePointer = 0,
/** @property {private boolean} _play Estado del Tween. */
           _play = false,
           
/** @property {private Object} _posAnterior Tiene el punto anterior, utilizado por tweenTo() */
           _posAnterior;

           
/**
 * @function {private Array} _tween Genera un Array de {x:nn, y:nn}, o sea los puntos de la interpolacion. No inicializa el puntero interno, por lo que hay que resetear el puntero si es necesario
 * @param {Object} p1 El punto inicial.
 * @param {Object} p2 El punto final.
 */    
       var _tween = function(p1, p2) {
           // aqui determino si no tiene el punto anterior, entonces lo setea con el actual, y devuelve un Array con 1 solo frame. 
           if(_.isUndefined(p1) || 
               ((p1.x == p2.x) && 
               (p1.y == p2.y)) ) {
               _posAnterior = p2;
               //_play = false;
               _framePointer = 0;
               return [{x : p2.x, y: p2.y}];
           }
           

           _posAnterior = p2;
           //_framePointer = 0;
           
           var  dx = Math.abs(p1.x - p2.x),
                dy = Math.abs(p1.y - p2.y),
                aOut = [],
                a,
                x,y,i,j,
                signX = ((p2.x - p1.x) >= 0)? 1 : -1,
                signY = ((p2.y - p1.y) >= 0)? 1 : -1;
           
                
           if(dy>=dx) { // si es mas alto q ancho
               a = dx/dy;
               var nSteps = (_.isUndefined(p1.nFrames))? dy : p1.nFrames;
               var interval = dy / nSteps;
               
               for(i=0; i<nSteps; i++){
                   j = i * interval;
                   y = p1.y + (signY * j);
                   x = p1.x + (signX * (j * a));
                   aOut.push({x : x, y: y});
               }
           } else {
               a = dy/dx;
               var nSteps = (_.isUndefined(p1.nFrames))? dx : p1.nFrames;
               var interval = dx / nSteps;
               
               for(i=0; i<nSteps; i++){
                   j = i * interval;
                   x = p1.x + (signX * j);
                   y = p1.y + (signY * (j * a));
                   aOut.push({x : x, y: y});
               }
           }
           
           return aOut;
       } // _tween
           
    
/** @property {private Callback} _finishCallback El callback que se ejecuta al finalizar la interpolacion */
       var _finishCallback, 
       
/** @property {private Callback} _startCallback El callback que se ejecuta al llegar al frame 0 */
       _startCallback;
    
    
    
       return {
/**
 * @function {public LinearTween} tweenTo Realiza una interpolacion al punto dado, desde el punto actual.
 * @param {Object} p Objeto con las coordenadas {x,y}.
 */    
           tweenTo : function(p2) {
                _framePointer = 0;
                _frames = _tween(_posAnterior, p2);
                return this;
           },
           
/**
 * @function {public LinearTween} _fnTween Realiza una interpolacion entre dos puntos.
 * @param {Object} p Objeto con las coordenadas {x,y}.
 * @param {Object} p Objeto con las coordenadas {x,y}.
 */    
           _fnTween : function(p1,p2){
                _frames = _tween(p1,p2);
                return this;
           },
           
/**
 * @function {public Object} requestFrame Obtiene un frame de lo interpolado con _fnTween o tweenTo. Si llega al final de la interpolacion dispara el evento onFinish.
 */    
           requestFrame : function() {
               
               if(_play) {
                    _framePointer += _dir;
                
                    if(_framePointer > _frames.length - 1) { 
                        _framePointer = _frames.length - 1;
                        _play = false;
                        if(!_.isUndefined(_finishCallback)) _finishCallback(this);
                    }
                    
                    if(_framePointer < 0) { 
                        _framePointer = 0;
                        _play = false;
                        if(!_.isUndefined(_startCallback)) _startCallback(this);
                    }
               }
               
               return _frames[_framePointer];
           },

/**
 * @function {public LinearTween} play Habilita el avance del puntero interno... o sea... play, obvio.
 */    
           play : function() {
                _play = true;
                return this;
           },

/**
 * @function {public LinearTween} play Inhabilita el avance del puntero interno... o sea... pause, obvio.
 */    
           pause : function() {
                _play = false;
                return this;
           },
           
/**
 * @function {public LinearTween} resetPointer Inicializa el puntero interno, si se le proporciona un frame lo inicializa en ese punto.
 * @param {optional int} frame 
 */    
           resetPointer : function(frame){
               _framePointer = (_.isUndefined(frame)? 0:frame);
               return this;
           },
           
/**
 * @function {public LinearTween} reset Inicializa el Tween, vacia _frames, pone _framePointer en 0, y algo mas que no recuerdo.
 */    
           reset : function() {
               _frames = []; 
               _framePointer = 0;
               _posAnterior = undefined;
               return this;
           },
           
/**
 * @function {public void} setDir establece si avanza o retrocede en cada requestFrame. Puedo establecer la cantidad que avanza o retrocede.
 * @param {int} dir positivo avanza el puntero, negativo retrocede.
 */    
           setDir : function(dir) {
               _dir = dir;
           },
           
           getType : function() {
                return "LinearTween";
           },

/**
 * @function {public void} onStart establece un callback que se ejecuta cuando el puntero interno llega a 0.
 * @param {Callback} callback al funcion que se ejecuta.
 */    
           onStart : function(callback) {
               _startCallback = callback;
           },
           
/**
 * @function {public void} onFinish establece un callback que se ejecuta cuando el puntero interno llega al final.
 * @param {Callback} callback al funcion que se ejecuta.
 */    
           onFinish : function(callback) {
                _finishCallback = callback;
           }
           
       } // end return
  };
 
  return rootApp;
 
}( Orange || {} ));