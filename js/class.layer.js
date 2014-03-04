Orange = ( function( rootApp ){
    
    
  rootApp.Layer = function(width, height){
    // Sprites del Layer
    var _sprites = [];
    // canvas layer
    var _layer, 
        _context,
        _width = width,
        _height = height,
        _bgLayer,
        _bgX,
        _bgY;

    
    var _putInContext = function() {
        _update();
        _context.drawImage(_layer.canvas,0,0); // a futuro la posicion debera poder moverse. (o hacer scroll loop)
        
    }

    
    var _update = function() {
        _layer.drawImage(_bgLayer, _bgX, _bgY);
        _.each(_sprites, function(s) {
            s.update();
        });
    }
    
    
    
    
    return {
        getCanvas : function() {
            return _layer;
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
            sprite._fnSetLayer(_layer);
            _sprites.push(sprite);
        },
/*        
        AGREGAR PROPERTY z-index, que me permita luego (mediante un setter y getter) ordenar en Orange el array _layers
        para que, al momento de dibujar, haya una estructura multicapa.
*/        
        _fnInit : function(context) {
            _context = context;
            var _tmpCanvas = document.createElement("canvas");
            _tmpCanvas.width = _width || _context.canvas.width;
            _tmpCanvas.height = _height || _context.canvas.height;
            _layer = _tmpCanvas.getContext("2d");
            
        }
    }
  };
 
  return rootApp;
 
}( Orange || {} ));