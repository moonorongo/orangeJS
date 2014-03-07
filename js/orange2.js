var Orange = (function(){
    var _context, 
        canvasElement,
        _layers = [],
        _imageManager,
        _bPlay = false,
        _counter = 1,
        _eventStack = [],
        _cbMainLoop;

    var orangeRoot;
        
    var _init = function(el) {
        // aca chequear si el es undefined no ejecutar esto...
        var domBody = document.getElementsByTagName("body")[0];
        domBody.innerHTML += '<canvas id="orange" width="360" height="240" style="border: 1px solid orange"></canvas>';
        canvasElement = el || domBody.getElementsByTagName("canvas")[0];
        _context = canvasElement.getContext("2d");
        _imageManager = new Orange.ImageManager();
        
        canvasElement.addEventListener("mousedown", function(e) {
            _.each(_eventStack, function(s) {
                s.notify(e);
            });
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
            setTimeout(_loop,20 - msLoop);
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
        
        update: function() {
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
        
        addToEventStack : function(sprite) {
            _eventStack.push(sprite);
        }
        
    };
})();



