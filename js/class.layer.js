/*
 * Declares {@link Layer} class etc.
 * @file class.layer.js
 * @version 0.1
  */

/**
 * @class Layer 
 * Un Layer es un contenedor de Sprites. Un Layer puede tener un ancho/alto superior al del canvas que lo contiene, y puede desplazarse 
 * con un scroll.
 * Tambien se le puede asignar una imagen que actue como limite para los sprites (boundary), y se le puede asignar una imagen de background.
 * 
 * @constructor Layer
 * @param {optional int} width El ancho del Layer, si no se especifica toma el del canvas.
 * @param {optional int} height El alto del Layer, idem.
 */
Orange = ( function( rootApp ){
    
  rootApp.Layer = function(width, height){

/** @property {private Sprites} _sprites Array que contiene los Sprites del layer. */
    var _sprites = [];
    
/** @property {private Canvas} _layer El "canvas context" (interno) del layer, donde seran dibujados los sprites. */
    var _layer,
    
/** @property {private Canvas} _boundary El "canvas context" (interno) del limite del _layer, es utilizado para proporcionar limites (ej crear laberintos, plataformas, etc) dentro del Layer. */
        _boundary,
        
/** @property {private Canvas} _context Referencia al canvas inicializado en Orange.init(), donde se dibuja todo. */
        _context,
        
/** @property {private int} _width Ancho del canvas, si no se proporciona toma el ancho del _context del juego. */
        _width = width,
/** @property {private int} _height Alto del canvas, idem anterior. */
        _height = height,
        
/** @property {private image} __bgLayer Imagen background del Layer. */
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
        // solo pinta la imagen de fondo si esta asignada.
        if(!_.isUndefined(_bgLayer)) { 
            _layer.drawImage(_bgLayer, _bgX, _bgY);
        } else {
            _layer.fillRect(0,0,_context.canvas.width,_context.canvas.height);
        }
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
        
        
        removeSprite : function(sprite) {
            var i = _sprites.indexOf(sprite);
            if(i != -1) {
                _sprites.splice(i,1);
                return true;
            } else {
                return false;
            }
            
            // aca ver de retornar algo q indique si pudo hacerlo o no.
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
            if(_.isUndefined(_boundary)) {
                return {
                    r : 255,
                    g : 255,
                    b : 255,
                    a : 255
                }
            } else {
                var data  = _boundary.getImageData(x, y,  1, 1).data;
                return {
                    r : data[0],
                    g : data[1],
                    b : data[2],
                    a : data[3]
                }
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