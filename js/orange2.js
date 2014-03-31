/*
 * Declares {@link Orange} class etc.
 * @file orange2.js
 * @version 0.1
  */

/**
 * @class Orange
 * Clase Principal, contiene todos los metodos para inicializar la libreria, precargar imagenes, arrancar el loop, etc.
 * @constructor Orange
 */
var Orange = (function(){
        /** @property {private canvasContext} _context El contexto 2D creado al inicializar la libreria, y donde se dibuja todo. */
    var _context, 
        /** @property {private canvas} canvasElement El elemento canvas en el DOM. */
        canvasElement,
        /** @property {private array} _layers Los layers que contiene el videojuego. */
        _layers = [],
        /** @property {private ImageManager} _imageManager Una instancia de ImageManager, encargada de la precarga de imagenes y todo lo que necesite el juego. */
        _imageManager,
        /** @property {private boolean} _bPlay Estado del videojuego, puede ser ejecutandose o en pausa. */
        _bPlay = false,
        /** @property {private int} _counter Contador interno de 1 a 256, que por ahora no sirve para nada, pero seguramente servira para algo. */
        _counter = 1,
        /** @property {private int} _speed el intervalo de ms entre llamadas al loop, 20ms son 60 fps. */
        _speed = 20, // ms;
        /** @property {private object} _eventStack Aqui se guardan las instancias de los sprites a los que se asignaron eventos. */
        _eventStack = { 
            mousedown : [],
            keydown : [],
            keyup : [],
            collision : [],
            enterFrame : []
        },
        /** @property {private callback} _cbMainLoop Callback asignado por el usuario, el cual es llamado al final de la ejecucion de los eventos, y el dibujado de la pantalla. */
        _cbMainLoop;

/** @property {private Orange} orangeRoot Referencia a Orange, utilizado en diferentes lugares. */
    var orangeRoot;
 
/**
 * @function {} _init Inicializa la libreria, en el elemento DOM que le pasemos. Si no especificamos el elemento lo crea. 
 * Tambien crea una instancia del ImageManager, y asigna los eventos a los sprites registrados.
 * @param {optional} el El elemento opcional sobre el que se desarrollara la accion
 */    
    var _init = function(el) {
        // aca chequear si el es undefined no ejecutar esto...
        var domBody = document.getElementsByTagName("body")[0];

        if(_.isUndefined(el)) {
            domBody.innerHTML += '<canvas id="orange" width="500" height="198" style="border: 1px solid orange"></canvas>';
            canvasElement = domBody.getElementsByTagName("canvas")[0];
        } else {
            canvasElement = el;
        }
        
        _context = canvasElement.getContext("2d");
        _imageManager = new Orange.ImageManager();
        
        _bindEvents();
    }

    
    
    
// EVENTS! ---------------------------    
    
    var _listener = function(e) {

        var key = e.type;
        var keyCode = e.keyCode;
        
        if( (keyCode == 38) ||  
            (keyCode == 40) ||  
            (keyCode == 39) ||  
            (keyCode == 37)
        ) e.preventDefault();
        
        _.each(_eventStack[key], function(s) {
            s._fnNotify(key, e);
        }); 
    };

    
    var _bindEvents  = function() {
        _.each(_eventStack, function(event, key) {
            if(key!="collision") {
                var regExKey =  /key/g;
                var _element = (regExKey.test(key))? window : canvasElement;
                _element.addEventListener(key, _listener);            
            } 
        });        
    }

    
    var _update = function() {
        _.each(_layers, function(l) {
            l.update();
        });
    }
    
    
    var _start = function() {
        _loop();
    }
    
    
    var _loop = function() {
        // incrementa counter interno, utilizado para Animation
        _counter++;
        if (_counter >= 256) _counter = 1; // se utiliza ^2 para facilitar la division con >>
        // bloque para determinar el costo en ms del bloque _cbMainLoop.
        var msStart = new Date().getMilliseconds();
              
        // _update: se encarga de recorrer el array _layers y pintar cada layer en el canvas
        // nota para recordar: a su vez, cada layer tiene un metodo _update, que se encarga de pintar los sprites que tiene sobre si mismo.
        _update();      
        
        // evento collision: se ejecuta para cada sprite registrado.
        _.each(_eventStack.collision, function(sprite) {
            sprite._fnNotify("collision");
        });                      
              
        _.each(_eventStack.enterFrame, function(sprite) {
            sprite._fnNotify("enterFrame");
        });                      

        _cbMainLoop();
              
        var msStop = new Date().getMilliseconds();
        var msLoop = msStop - msStart; 
        if(msLoop < 0) msLoop = 0; // Hack horrible para evitar el cambio de segundo
              
        if(_bPlay) {
            setTimeout(_loop,_speed - msLoop);
        }
    }
    
    

/* ------------- Public Section ------------- */
    return {
        addLayer : function(layer) {
            layer._fnInit(_context);
            layer._fnSetRootContext(orangeRoot);
            _layers.push(layer);
        },
        
        getImageManager : function() {
            return _imageManager;
        },
        
        init : function(el) {
            _init(el);
            orangeRoot = this;
        },
        
        getCanvasElement : function () {
            return canvasElement;
        },
        
        _fnUpdate: function() {
            _update();
        },
        
        start : function() {
            _bPlay = true;
            _start();
        },
        
        stop : function() {
            _bPlay = false;
        },
        
        setMainCallback : function(callback) {
            _cbMainLoop = callback;
        },
        
        getCounter : function() {
            return _counter;
        },
        
        addToEventStack : function(event,sprite) {
            _eventStack[event].push(sprite);
        },
        
        removeFromEventStack : function(sprite) {
            _.each(_eventStack, function(e, key) {
                var i = e.indexOf(sprite);
                if(i != -1) {
                    e.splice(i,1);
                    return true;
                } else {
                    return false;
                }
            });
        }
        
    };
})();



