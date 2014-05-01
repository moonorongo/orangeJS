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
            //_boundaryMap = config.boundaryMap || null,
            _map = config.map || null;

            
        if(!_.isNull(_layerImageMap)) {
            _layerCanvas = document.createElement("canvas");
            _layerCanvas.width = config.width;
            _layerCanvas.height = config.height;
            _layerContext = _layerCanvas.getContext('2d');
            
            _layerContext.clearRect(0,0,config.width,config.height);

            _.each(_map, function(row, rowIndex){
                _.each(row, function(col, colIndex){
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
            
            _.each(_map, function(row, rowIndex){
                _.each(row, function(col, colIndex){
                    var imgData = _boundaryImageMap.getChar(col.b);
                    
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
            
        }
        
        

        


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
           
            aStar : function(o) {

            }

        }
    };
 
  
  return rootApp;
 
}( Orange || {} ));