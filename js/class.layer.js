Orange = ( function( rootApp ){
    
    
  rootApp.Layer = function(width, height){
    // Sprites del Layer
    var _sprites = [];
    // canvas layer
    var _layer,
        _boundary,
        _context,
        _width = width,
        _height = height,
        _bgLayer,
        _bgX,
        _bgY;

    var _tmpCanvas;
    var _tmpCanvasBoundary;
    var orangeRoot;
        
    var _putInContext = function() {
        _fnUpdate();
        _context.drawImage(_layer.canvas,0,0); // a futuro la posicion debera poder moverse. (o hacer scroll loop)
        //_context.drawImage(_boundary.canvas,0,0); // a futuro la posicion debera poder moverse. (o hacer scroll loop)
        
    }

    
    var _fnUpdate = function() {
        _layer.drawImage(_bgLayer, _bgX, _bgY);
        _.each(_sprites, function(s) {
            s._fnUpdate();
        });
    }
    
    
    
    
    return {
        
        _fnGetCanvas : function() {
            return _layer;
        },
        
        _fnGetSprites : function() {
            return _sprites;
        },
        
        setBackground : function(img, x,y) {
            _bgX = x || 0;
            _bgY = y || 0;
            _bgLayer = img;
        },
        
        update : function() {
            _putInContext();
        },

        
        addSprite : function(sprite) {
            sprite._fnSetLayer(this);
            sprite._fnSetRootContext(orangeRoot);
            _sprites.push(sprite);
        },


        setBoundary : function(img) {
            _tmpCanvasBoundary = document.createElement("canvas");
            _tmpCanvasBoundary.width = _tmpCanvas.width;
            _tmpCanvasBoundary.height = _tmpCanvas.height;
            _boundary = _tmpCanvasBoundary.getContext("2d");
            _boundary.drawImage(img,0,0);
        },
        
        getBoundary : function() {
            return _boundary;
        },
        
        _fnGetBoundaryStatus : function(x,y) {
            var data  = _boundary.getImageData(x, y,  1, 1).data;
            return {
                r : data[0],
                g : data[1],
                b : data[2],
                a : data[3]
            }
        },
        
/*        
        AGREGAR PROPERTY z-index, que me permita luego (mediante un setter y getter) ordenar en Orange el array _layers
        para que, al momento de dibujar, haya una estructura multicapa.
*/        
        _fnInit : function(context) {
            _context = context;
            _tmpCanvas = document.createElement("canvas");
            _tmpCanvas.width = _width || _context.canvas.width;
            _tmpCanvas.height = _height || _context.canvas.height;
            _layer = _tmpCanvas.getContext("2d");
        },
        

        
        _fnSetRootContext : function(root) {
            orangeRoot = root;
        }
    }
  };
 
  return rootApp;
 
}( Orange || {} ));