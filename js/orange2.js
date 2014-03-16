var Orange = (function(){
    var _context, 
        canvasElement,
        _layers = [],
        _imageManager,
        _bPlay = false,
        _counter = 1,
        _speed = 20, // ms;
        _eventStack = { 
            mousedown : [],
            keydown : [],
            keyup : []
        },
        _cbMainLoop;

    var orangeRoot;
        
    var _init = function(el) {
        // aca chequear si el es undefined no ejecutar esto...
        var domBody = document.getElementsByTagName("body")[0];
        domBody.innerHTML += '<canvas id="orange" width="500" height="198" style="border: 1px solid orange"></canvas>';
        canvasElement = el || domBody.getElementsByTagName("canvas")[0];
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
            var regExKey =  /key/g;
            var _element = (regExKey.test(key))? window : canvasElement;
            _element.addEventListener(key, _listener);            
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
        _cbMainLoop();
        _update();
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
        }
        
    };
})();



