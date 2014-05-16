/*
 * Declares {@link TileMap} class etc.
 * @file class.tile_map.js
 * @version 0.1
  */

/**
 * @class TileMap 
 * 
 * @constructor TileMap
 * @param {optional Object} lalala .
 */
Orange = ( function( rootApp ){
    
    rootApp.TileMap = function(config){

        // si no se proporciona width y height tratar de obtenerlos del canvas principal (como los Layers)
        
        var _layerImageMap = config.layerImageMap || null,
            _boundaryImageMap = config.boundaryImageMap || null,
            _layerCanvas, _boundaryCanvas,_layerContext, _boundaryContext,
           _showTransitableMap = true, _showGrid = true,
            //_boundaryMap = config.boundaryMap || null,
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
           
           
        
        var _manhattan = function(nIni, nFin) {
            var h = (Math.abs(nIni.x - nFin.x) + Math.abs(nIni.y - nFin.y)) * 10;
            nIni.c += h;
        };
        
        
        var _nodeEqual = function(n1,n2) {
            return (n1.x == n2.x) && (n1.y == n2.y);
        }
        

        var _nearNodes = function(n) {
            
            
            var out = [];
            // si no hay nada... alamerda!
            if(!_map[n.y][n.x].t) return out;
  
          
            if(n.y > 0) {
                if(_map[n.y-1][n.x].t) out.push({x:n.x, y:n.y-1, c:10}); // el de arriba
            }
            
            if(n.y < _map.length - 1) {
                if(_map[n.y+1][n.x].t) out.push({x:n.x, y:n.y+1, c:10}); // el de abajo
            }
            
            if(n.x > 0) {
                if(_map[n.y][n.x-1].t) out.push({x:n.x-1, y:n.y, c:10}); // el de izquierda
            }
            
            if(n.x < _map[0].length - 1) {
                if(_map[n.y][n.x+1].t) out.push({x:n.x+1, y:n.y, c:10}); // el de derecha
            }

/*            
            if(_map[n.y-1][n.x-1].t) { // diagonal arriba-izquierda
                if((_map[n.y-1][n.x].t) && (_map[n.y][n.x-1].t)) out.push({x:n.x-1, y:n.y-1, c:15});
            }

            if(_map[n.y-1][n.x+1].t) { // diagonal arriba-derecha
                if((_map[n.y-1][n.x].t) && (_map[n.y][n.x+1].t)) out.push({x:n.x+1, y:n.y-1, c:15});
            }
            
            if(_map[n.y+1][n.x+1].t) { // diagonal abajo-derecha
                if((_map[n.y+1][n.x].t) && (_map[n.y][n.x+1].t)) out.push({x:n.x+1, y:n.y+1, c:15});
            }
            
            if(_map[n.y+1][n.x-1].t) { // diagonal abajo-izquierda
                if((_map[n.y+1][n.x].t) && (_map[n.y][n.x-1].t)) out.push({x:n.x-1, y:n.y+1, c:15});
            }
*/            
            return out;
        };

        
        
        
        
        
        
        


        return {
            setLayerMap : function(map) {
                
            },
                
            setBoundaryMap : function(map) {
                
            },
           
            getLayer : function() {
                return _layerCanvas;
            },
           
            getContext : function() {
                return _layerContext;
            },
           
            getImage : function() {
                var imgTemp = document.createElement("img");
                imgTemp.src = _layerCanvas.toDataURL();
                return imgTemp;
            },
           
           
            getBoundary : function() {
                return _boundaryCanvas;
            },
           
            getType : function () {
                return "TileMap";
            },
           
            getMap : function() {
                return _map;
            },
        
            getNearNodes : function(node) {
                return _nearNodes(node);
            },
           
            aStar : function() {
                // aca obtener unos nodes de prueba (por ej: 4,4)
                // obtener la posicion del pacman, como nfin, y armar algo que calcule los costos..
                var nIni = {y:4, x:4};
                var nFin = {y:9 ,x:9};
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