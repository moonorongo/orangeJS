/*
 * Declares {@link TileMap} class etc.
 * @file class.tile_map.js
 * @version 0.1
 */

/**
 * @class TileMap 
 * Un TileMap es un mapa armado con caracteres, como se armaban en las viejas consolas y computadoras, en el que se pueden definir areas transitables
 * las cuales serán utilizadas por A* para el calculo del camino mas corto. El TileMap puede recibir un ImageMap para el dibujado del Layer, que contiene la definicion de caracteres
 * utilizados, y un boundaryImageMap, que será el que se utilize para definir por donde podra transitar el sprite.
 * 
 * @constructor TileMap
 * @param {ImageMap} layerImageMap El ImageMap que se utilizara para dibujar el Layer.
 * @param {ImageMap} boundaryImageMap El ImageMap que se utilizara para dibujar el BoundaryLayer.
 * @param {Object} map El array de array objetos que contiene la definicion del mapeado. El formato de cada elemento es el siguiente: {l:27, b:14}, donde l es el numero de caracter del layerImageMap,
 *y b es el numero de caracter del boundaryImageMap.
 * @param {int} width el ancho del TileMap.
 * @param {int} height el alto del TileMap.
 */
Orange = ( function( rootApp ){
    
    rootApp.TileMap = function(config){

        // si no se proporciona width y height tratar de obtenerlos del canvas principal (como los Layers)
        
 /** @property {private ImageMap} _layerImageMap ImageMap utilizado para dibujar el Layer. */
       var _layerImageMap = config.layerImageMap || null,
 /** @property {private ImageMap} _boundaryImageMap ImageMap utilizado para dibujar el Boundary Layer. */
            _boundaryImageMap = config.boundaryImageMap || null,
            _layerCanvas, _boundaryCanvas,_layerContext, _boundaryContext,
 /** @property {private boolean} _showTransitableMap Propiedad para debuguear, muestra las zonas transitables del mapa, en un rojizo. */
           _showTransitableMap = false,
 /** @property {private boolean} _showGrid Muestra una grilla para poder visualizar los caracteres. */
           _showGrid = false,
 /** @property {private Array[][]} _map Array bidimensional que contiene la definicion del mapa. */
            _map = config.map || null;

        if(!_.isNull(_boundaryImageMap)) {
            _boundaryCanvas = document.createElement("canvas");
            _boundaryCanvas.width = config.width;
            _boundaryCanvas.height = config.height;
            _boundaryContext = _boundaryCanvas.getContext('2d');
            
            _boundaryContext.clearRect(0,0,config.width,config.height);
            
            _.each(_map, function(row, rowIndex){
                _.each(row, function(col, colIndex){
                    var imgData = _boundaryImageMap.getChar(col.b);
                    col.t = imgData.transitable;
                    
                    _boundaryContext.drawImage(imgData.image, 
                                            imgData.px, 
                                            imgData.py,
                                            _boundaryImageMap.getSpriteWidth(), 
                                            _boundaryImageMap.getSpriteHeight(), 
                                            colIndex * _boundaryImageMap.getSpriteWidth(),
                                            rowIndex * _boundaryImageMap.getSpriteHeight(),
                                            _boundaryImageMap.getSpriteWidth(), 
                                            _boundaryImageMap.getSpriteHeight());
                });
            });
        } // if boundaryImageMap
            
            
            
        if(!_.isNull(_layerImageMap)) {
            _layerCanvas = document.createElement("canvas");
            _layerCanvas.width = config.width;
            _layerCanvas.height = config.height;
            _layerContext = _layerCanvas.getContext('2d');
            
            _layerContext.clearRect(0,0,config.width,config.height);

            _.each(_map, function(row, rowIndex){
                _.each(row, function(col, colIndex){
                    var imgData = _layerImageMap.getChar(col.l);

                    if(col.t && _showTransitableMap) {
                        _layerContext.save();
                        _layerContext.globalAlpha = 0.2;
                        _layerContext.fillStyle="#FF0000";
                        _layerContext.fillRect(colIndex * _layerImageMap.getSpriteWidth(),
                                            rowIndex * _layerImageMap.getSpriteHeight(),
                                            _layerImageMap.getSpriteWidth(), 
                                            _layerImageMap.getSpriteHeight());
                        _layerContext.restore();
                    }
                    
                    _layerContext.drawImage(imgData.image, 
                                            imgData.px, 
                                            imgData.py,
                                            _layerImageMap.getSpriteWidth(), 
                                            _layerImageMap.getSpriteHeight(), 
                                            colIndex * _layerImageMap.getSpriteWidth(),
                                            rowIndex * _layerImageMap.getSpriteHeight(),
                                            _layerImageMap.getSpriteWidth(), 
                                            _layerImageMap.getSpriteHeight());
                    
                    
                    if(_showGrid) {
                        _layerContext.lineWidth="1";
                        _layerContext.strokeStyle="lightGreen";
                        _layerContext.rect(colIndex * _layerImageMap.getSpriteWidth(),
                                            rowIndex * _layerImageMap.getSpriteHeight(),
                                            1, 
                                            1);
                        _layerContext.stroke();
                    }
                    
                
                });
            });
        }
           
           
/**
 * @function {private void} _manhattan calcula la distancia total entre el nodo nIni y nFin.
 * @param {Node} nIni Nodo inicial.
 * @param {Node} nFin Nodo final.
 */            
        var _manhattan = function(nIni, nFin) {
            var h = (Math.abs(nIni.x - nFin.x) + Math.abs(nIni.y - nFin.y)) * 10;
            nIni.c += h;
        };
        

/**
 * @function {private boolean} _nodeEqual Compara 2 nodos si son iguales.
 * @param {Node} n1 Nodo un nodo.
 * @param {Node} n2 Nodo otro nodo.
 */            
        var _nodeEqual = function(n1,n2) {
            return (n1.x == n2.x) && (n1.y == n2.y);
        }
        

/**
 * @function {private Array} _nearNodes Obtiene un Array de nodos vecinos del nodo proporcionado.
 * @param {Node} n nodo.
 */            
        var _nearNodes = function(n) {
            var out = [];
            // si no hay nada... alamerda!
            if(!_map[n.y][n.x].t) return out;
          
            var adyacente = [
                {x : 0 , y : -1},
                {x : -1, y : 0 },
                {x : 1 , y : 0 },
                {x : 0 , y : 1 }
            ];
            
            var adDiagonal = [
                {x : -1, y : -1},
                {x : 1 , y : -1},
                {x : -1, y : 1 },
                {x : 1 , y : 1 }
            ];
            
            
            var ax,ay,node, nodeV, nodeH; 
            for(var i=0; i<adyacente.length; i++) {
                ax = n.x + adyacente[i].x;
                ay = n.y + adyacente[i].y;
                
                node = _map[ay][ax];
                if(!_.isUndefined(node) && node.t) {
                    out.push({x: ax, y: ay, c:10});                
                }
            }

            
            for(var i=0; i<adDiagonal.length; i++) {
                ax = n.x + adyacente[i].x;
                ay = n.y + adyacente[i].y;
                
                var node = _map[ay][ax];
                var nodeH = _map[n.y][ax];
                var nodeV = _map[ay][n.x];
                if(!_.isUndefined(node) && node.t) {
                    if( (!_.isUndefined(nodeH) && nodeH.t) &&
                        (!_.isUndefined(nodeV) && nodeV.t) ) {
                        out.push({x: ax, y: ay, c:14});                
                    }
                }
            }
            
            return out;
        };

        
        
        
        
        
        
        


        return {
            setLayerMap : function(map) {
                
            },
                
            setBoundaryMap : function(map) {
                
            },
           
 /**
 * @function {public Canvas} getLayer Retorna el canvas generado.
 */    
           getLayer : function() {
                return _layerCanvas;
            },

 /**
 * @function {public LayerContext} getLayerContext Retorna el Context del Layer generado.
 */    
            getContext : function() {
                return _layerContext;
            },
           
 /**
 * @function {public ImageMap} getLayerImageMap retorna el ImageMap asignado a TileMap.
 */    
            getImageMap : function() {
                return _layerImageMap;
            },
           
 /*
            getImage : function() {
                var imgTemp = document.createElement("img");
                imgTemp.src = _layerCanvas.toDataURL();
                return imgTemp;
            },
*/           
           
 /**
 * @function {public Canvas} getBoundary Retorna el Canvas del BoundaryMap.
 */    
            getBoundary : function() {
                return _boundaryCanvas;
            },
           
 /**
 * @function {public String} getType Retorna el tipo de objeto.
 */    
            getType : function () {
                return "TileMap";
            },
           
 /**
 * @function {public Array} getMap Retorna el mapa del TileMap .
 */    
            getMap : function() {
                return _map;
            },
        
 /*
            getNearNodes : function(node) {
                return _nearNodes(node);
            },
*/
 
 /**
 * @function {public Array} aStar Calcula el camino mas corto desde nIni a nFin, y retorna un array de nodos.
 * @param {Nodo} nIni Nodo inicial.
 * @param {Nodo} nFin Nodo final.
 */    
            aStar : function(nIni, nFin) {
                nIni.c = 0;
                var _near;
                var actualNode;
                
                
                if(_nodeEqual(nIni, nFin)) {
                    return [nFin];
                } else {
                    var listaAbierta = new Orange.NodeList();
                    var listaCerrada = new Orange.NodeList();
                    listaAbierta.add(nIni);
  

                    while(!listaAbierta.isEmpty()) {
                        actualNode = listaAbierta.getMinCost();
                        if(_nodeEqual(actualNode, nFin)) {
                            return listaCerrada.buildPath(actualNode, nIni);
                            break;
                        }
                        listaAbierta.remove(actualNode);
                        
                        _near = _nearNodes(actualNode);
                        _.each(_near, function(n) {
                            _manhattan(n, nFin);
                            n.parent = {y : actualNode.y, x : actualNode.x};
                            if(!listaCerrada.hasNode(n)) listaAbierta.add(n, true);
                        });
                        
                        listaCerrada.add(actualNode);
                    }
                    
                    // fail - camino no encontrado
                    return null;

                } // end if
            } // end A*

        }
    };
 
  
  return rootApp;
 
}( Orange || {} ));