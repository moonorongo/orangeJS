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
        
/** @property {private image} _bgLayer Imagen background del Layer. */
        _bgLayer,
        _tileMap,
/** @property {private boolean} _showBoundary Muestra el boundary del Layer, para debuguear. */
        _showBoundary = false,
        _bgX,
        _bgY;

    var _tmpCanvas;
    var _tmpCanvasBoundary;
    var orangeRoot;

/**
 * @function {private void} _putInContext ejecuta _fnUpdate (que dibuja los sprites), y se encarga de pintar el layer en el canvas principal.
 * A FUTURO: Seguramente habra algo que me permita hacer scrolles... que no se como voy a implementar, si con algo asi como una camara, o lo que sea.
 */    
    var _putInContext = function() {
        _fnUpdate();
        _context.drawImage(_layer.canvas,0,0); // a futuro la posicion debera poder moverse. (o hacer scroll loop)
        //_context.drawImage(_boundary.canvas,0,0); // a futuro la posicion debera poder moverse. (o hacer scroll loop)
    }

/**
 * @function {private void} _fnUpdate Actualiza el Layer, pintando el fondo, y los Sprites asignados.
 */    
    var _fnUpdate = function() {
        
        if(!_.isUndefined(_bgLayer)) { 
            _layer.fillRect(0,0,_context.canvas.width,_context.canvas.height);            
            _layer.drawImage(_bgLayer, _bgX, _bgY);
        } else {
            // o pinta un cuadrado negro.
            _layer.fillRect(0,0,_context.canvas.width,_context.canvas.height);
        }

        if((!_.isUndefined(_tmpCanvasBoundary)) && (_showBoundary)) { 
            _layer.save();
            _layer.globalAlpha = 0.1;
            _layer.drawImage(_tmpCanvasBoundary, _bgX, _bgY);
            _layer.restore();
        }

        // pinta cada sprite.
        _.each(_sprites, function(s) {
            s._fnUpdate();
        });
    }
    

    
    
    var _setBackground = function(img,x,y) {
        _bgX = x || 0;
        _bgY = y || 0;
        _bgLayer = img;
    }

    var _setBoundary = function(img,x,y) {
        _tmpCanvasBoundary = document.createElement("canvas");
        _tmpCanvasBoundary.width = _tmpCanvas.width;
        _tmpCanvasBoundary.height = _tmpCanvas.height;
        _boundary = _tmpCanvasBoundary.getContext("2d");
        
        var boundX = x || 0, 
            boundY = y || 0;
        _boundary.drawImage(img, boundX, boundY);        
    }
    
    
    
    return {
/**
 * @function {public void} showBoundary Especifica si quiero mostrar el boundary del Layer, para testear.
 * @param {boolean} status true/false activa o desactiva.
 */    
        showBoundary : function(status) {
            _showBoundary = status; 
        },
        
        
/**
 * @function {public canvas} _fnGetCanvas Devuelve el contexto del canvas
 */    
        _fnGetCanvas : function() {
            return _layer;
        },
/**
 * @function {public Sprites} _fnGetSprites Retorna el Array de Sprites. Realmente no se si se utiliza en algun lado...
 */    
        _fnGetSprites : function() {
            return _sprites;
        },

/**
 * @function {public void} setBackround Especifica una imagen de fondo para el Layer. Tambien se puede asignar (optativamente) una posicion inicial x e y, que es la posicion donde dibujara la imagen (por defecto: 0,0).
 * @param {Imagen} img La imagen de fondo a especificar
 * @param {optional} x Posicion x a dibujar.
 * @param {optional} y Posicion y a dibujar.
 */    
        setBackground : function(img, x,y) {
            _setBackground(img,x,y);
        },


        getTileMap : function() {
            return _tileMap;
        },
        
        
        setTileMap : function(tMap){
            _tileMap = tMap;
            _setBackground(_tileMap.getLayer());
            _setBoundary(_tileMap.getBoundary());
        },
        
/**
 * @function {public void} _update Actualiza el Layer, y lo dibuja en el context principal.
 */    
        update : function() {
            _putInContext();
        },

/**
 * @function {public void} addSprite Agrega un Sprite al array interno de Sprites, del Layer.
 * @param {Sprite} sprite El Sprite que quiero agregar.
 */    
        addSprite : function(sprite) {
            sprite._fnSetLayer(this);
            sprite._fnSetRootContext(orangeRoot);
            _sprites.push(sprite);
        },
        
        
/**
 * @function {public boolean} removeSprite Quita la referencia del sprite del array interno de Sprites. Retorna true si la operacion se concreta exitosamente.
 * @param {Sprite} sprite El Sprite que quiero quitar.
 */    
        removeSprite : function(sprite) {
            var i = _sprites.indexOf(sprite);
            if(i != -1) {
                _sprites.splice(i,1);
                return true;
            } else {
                return false;
            }
        },


        
/**
 * @function {public Sprite} getSpriteById Obtiene un Sprite del Layer, por su Id.
 * @param {String} id El identificador por el que lo quiero buscar.
 */    
        getSpriteById : function(id) {
            return _.findWhere(_sprites, { id : id });
        },
        
        
        
/**
 * @function {public void} setBoundary Asigna una imagen y genera un canvas, que es utilizado para proporcionar limites de movimiento dentro del Layer (util para laberintos, plataformas y casi todo lo que se te ocurra).
 * Por donde este en blanco la imagen se podra posicionar un Sprite, donde este en negro no sera posible.
 * @param {Image} img La imagen a asignar.
 * @param {optional} x Posicion x a dibujar.
 * @param {optional} y Posicion y a dibujar.
 */    
        setBoundary : function(img,x,y) {
            _setBoundary(img,x,y);
        },

        
/**
 * @function {public canvas} getBoundary Obtiene el limite asignado al Layer... No se si lo utilizo en algun lado.
 */    
        getBoundary : function() {
            return _boundary;
        },
        
/**
 * @function {public Object} _fnGetBoundaryStatus Obtiene un valor de un pixel determinado, del _boundary. Devuelve un objeto {r, g, b, a}. Se utiliza para determinar si puedo posicionar un Sprite en ese lugar.
 * @param {int} x Posicion x.
 * @param {int} y Posicion y.
 */    
        _fnGetBoundaryStatus : function(x,y) {
            if(_.isNaN(x) || _.isNaN(y)) {
                return {
                    r : 255,
                    g : 255,
                    b : 255,
                    a : 255
                }
            } else {
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
            } // isNaN

        },
        
/*        
        AGREGAR PROPERTY z-index, que me permita luego (mediante un setter y getter) ordenar en Orange el array _layers
        para que, al momento de dibujar, haya una estructura multicapa.
*/        
/**
 * @function {public void} _fnInit Utilizado por Orange.addLayer, crea una referencia _context al contexto general, e instancia el _layer interno, donde se dibujaran los Sprites.
 * @param {canvas} context El canvas principal del juego.
 */    
        _fnInit : function(context) {
            _context = context;
            _tmpCanvas = document.createElement("canvas");
            _tmpCanvas.width = _width || _context.canvas.width;
            _tmpCanvas.height = _height || _context.canvas.height;
            _layer = _tmpCanvas.getContext("2d");
        },
        

        
        
/**
 * @function {public void} _fnSetRootContext Crea una referencia interna de Orange para uso general.
 * @param {Orange} root
 */    
        _fnSetRootContext : function(root) {
            orangeRoot = root;
        }
    }
  };
 
  return rootApp;
 
}( Orange || {} ));