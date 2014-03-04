Orange = ( function( rootApp ){
    
    
  rootApp.ImageManager = function(aImages){
    var _imagesToPreload = aImages || [];
    var _images = [];
    
    var _completeTask = null;
    var _options = null;
    var _callback = null;

    
    var _addImage = function(src) {
        if(_.isString(src)) {
            _imagesToPreload.push(src);
        } else {
            _.each(src, function(e) {
                _imagesToPreload.push(e);
            });
        }
    }


    var _startPreload = function(callback) {
        _.each(_imagesToPreload, function(src){
            var tmpImg = document.createElement("img");
            tmpImg.src = src;
            _images.push(tmpImg);
        })
        
        _imagesToPreload = [];
        _callback = callback;
        _completeTask = setTimeout(function(){_checkCompleteTask();},100);    
    };
    
    
    var _checkCompleteTask = function() {
        var count = 0;
        
        _.each(_images, function(e){
            if(e.complete) count++;
        })
        
        if(count == _images.length) { 
            clearTimeout(_completeTask);
            _callback();
        } else {
            _completeTask = setTimeout(function(){_checkCompleteTask();},100);
        }
    };    
    
    
    return {
        addImage : function(src) {
            _addImage(src);
        },
        
        preload : function(callback) {
            _startPreload(callback);
        },
        
        getImages : function() {
            return _images;
        },
        
        // this return occurrences in _images array
        get : function(src) {
            var rTest = new RegExp(src);
            return _.filter(_images, function(i) { return rTest.test(i.src) })[0];
        }
    }
  };
 
  
  return rootApp;
 
}( Orange || {} ));