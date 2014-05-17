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
            var index;
            _.each(_nodeList, function(n, i){  
                if((n.x==node.x) && (n.y==node.y)) index = i;
            });
            return index;
        }
        
        var _getNode = function(node) {
            var i = _getNodeIndex(node);
            return _nodeList[i];
        }
        
        
        var _hasNode = function(node){
            return (_.isUndefined(_getNodeIndex(node)))? false : true;
        };

        
        var _add = function(node, sort) {
            _nodeList.push(node);
/*            
            if(_.isUndefined(sort) || sort) {
                _nodeList.sort(function(a,b) { return a.cost - b.cost; });
            }
*/            
        }
        

        var _nodeEqual = function(n1,n2) {
            return (n1.x == n2.x) && (n1.y == n2.y);
        }        
        
        
        var _getMinCost = function() {
            return _.min(_nodeList, function(e) {
                return e.c;
            });
        }
        
        
        var _optimize = function(aNodes) {
            var i,
                nlength = aNodes.length
                out = [];
                
            if(aNodes.length > 2)  {
                out.push(aNodes[0]);
                for(i=1; i<nlength-1; i++) {
                    if((aNodes[i-1].x == aNodes[i+1].x) || 
                       (aNodes[i-1].y == aNodes[i+1].y)) {
                        //aNodes.splice(i,1);
                    } else {
                        out.push(aNodes[i]);
                    }
                }
                out.push(aNodes[nlength-1]);
            }
            
            return out.reverse();
        } // end  optimize
        
        
        
        
        var _buildPath = function(nFin, nIni) {
            var out = [];
            out.push(nFin);
            var parentNode = _getNode(nFin.parent); 
            
            while(!_nodeEqual(parentNode, nIni)) {
                out.push(parentNode);
                parentNode = _getNode(parentNode.parent);
            }
            
            out.push(nIni);
            out = _optimize(out);
            
            return out;
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
                //return (_nodeList.length != 0)? _nodeList[0] : null;
                return _getMinCost();
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
           
            buildPath : function(nFin, nIni) {
                return _buildPath(nFin, nIni);
            },
            
            getType : function () {
                return "NodeList";
            }
        }
    };
 
  
  return rootApp;
 
}( Orange || {} ));