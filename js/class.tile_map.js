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

        var _layerImageMap = config.layerImageMap || null,
            _boundaryImageMap = config.boundaryImageMap || null,
            _layerCanvas, _boundaryCanvas,_layerContext, _boundaryContext,
            _map = config.map || null;
        
        // aca detectar que es lo que tengo, y generar _layerCanvas, _boundaryCanvas
        if(!_.isNull(_layerImageMap)) {
            _layerCanvas = document.createElement("canvas");
            _layerCanvas.width = config.width;
            _layerCanvas.height = config.height;
            _layerContext = _layerCanvas.getContext('2d');
            
            _layerContext.clearRect(0,0,config.width,config.height);
            
            _.each(config.map, function(row, rowIndex){
                _.each(row, function(col, colIndex){
                    //_layer._fnGetCanvas().drawImage(imgData.image, imgData.px, imgData.py, _w, _h, _x,_y,_w * _expandX, _h * _expandY);
                    var imgData = _layerImageMap.getChar(col.l);
                    
                    _layerContext.drawImage(imgData.image, 
                                            imgData.px, 
                                            imgData.py,
                                            _layerImageMap.getSpriteWidth(), 
                                            _layerImageMap.getSpriteHeight(), 
                                            colIndex * _layerImageMap.getSpriteWidth(),
                                            rowIndex * _layerImageMap.getSpriteHeight(),
                                            _layerImageMap.getSpriteWidth(), 
                                            _layerImageMap.getSpriteHeight());
                });
            });
        }
           
        if(!_.isNull(_boundaryImageMap)) {
            _boundaryCanvas = document.createElement("canvas");
            _boundaryCanvas.width = config.width;
            _boundaryCanvas.height = config.height;
            _boundaryContext = _boundaryCanvas.getContext('2d');
            
            _boundaryContext.clearRect(0,0,config.width,config.height);
        }
        
        

        


        return {
            setLayerMap : function(map) {
                
            },
                
            setBoundaryMap : function(map) {
                
            },
           
            getLayer : function() {
                return _layerCanvas;
            },
           
            getBoundary : function() {
                return _boundaryCanvas;
            },
           
            getType : function () {
                return "TileMap";
            },
           
            aStar : function(o) {

            }

        }
    };
 
  
  return rootApp;
 
}( Orange || {} ));