/*
 * Declares {@link TileMap} class etc.
 * @file class.node_list.js
 * @version 0.1
  */

/**
 * @class NodeList 
 * 
 * @constructor NodeList
 */
Orange = ( function( rootApp ){
    
    rootApp.NodeList = function(){
        
        var _nodeList = [];
        
        var _getNodeIndex = function(node) {
            //return _.findWhere(_nodeList, {x : node.x, y : node.y});
            var index;
            _.each(_nodeList, function(n, i){  
                if((n.x==node.x) && (n.y==node.y)) index = i;
            });
            return index;
        }
        
        
        var _hasNode = function(node){
            return (_.isUndefined(_getNodeIndex(node)))? false : true;
        };

        
        var _add = function(node) {
            _nodeList.push(node);
            _nodeList.sort(function(a,b) { return a.cost - b.cost; });

        }
        
        
        return {
            add : function(node, overwrite) {
                if(_.isUndefined(overwrite) || !overwrite) {
                    if(!_hasNode(node)) {
                        _add(node);
                    }
                } else {
                    var i = _getNodeIndex(node);
                    if(_.isUndefined(i)){
                        _add(node);
                    } else {
                        if(node.cost < _nodeList[i].cost) {
                            _nodeList[i] = node;
                            _nodeList.sort(function(a,b) { return a.cost - b.cost; });
                        }
                    }
                }
            },
           
            getMinCost : function() {
                return (_nodeList.length != 0)? _nodeList[0] : null;
            },
           
            remove : function(node) {
                var i = _getNodeIndex(node);
                if(!_.isUndefined(i)) _nodeList.splice(i, 1);
            },
           
            hasNode : function(node) {
                return _hasNode(node);
            },
           
            isEmpty : function() {
                return (_nodeList.length == 0)? true : false;
            },
           
            getNodeList : function() {
                return _nodeList;
            },
            
            getType : function () {
                return "NodeList";
            }
        }
    };
 
  
  return rootApp;
 
}( Orange || {} ));