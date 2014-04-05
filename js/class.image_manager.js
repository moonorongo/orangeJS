/*
 * Declares {@link ImageManager} class etc.
 * @file class.imagemanager.js
 * @version 0.1
  */

/**
 * @class ImageManager 
 * El ImageManager es el encargado de la precarga de las imagenes a utilizar en el Juego. DE MOMENTO OFRECE UNAS FUNCIONALIDADES BASICAS, PERO ESPERO EN UN FUTURO AGREGAR ALGUNAS MAS
 * 
 * @constructor ImageManager
 * @param {optional Array} aImages Si bien la inicializacion permite setear el Array inicial de imagenes a cargar, en Orange el sistema se encarga de instanciar la clase, por lo que, por lo menos aca, esta feature no se utiliza.
 */
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
*/        
/**
 * @function {public void} addImage Permite agregar al array interno de imagenes los archivos que queremos cargar.
 * @param {Images} src Puede tomar una imagen individual (String) o un Array de Strings (para especificar varias).
 */    
        addImage : function(src) {
            _addImage(src);
        },
        
/**
 * @function {public void} preload Inicia la precarga de imagenes. Al finalizar ejecuta el callback pasado como parametro.
 * @param {callback} callback La funcion a ejecutar al finalizar la carga.
 */    
        preload : function(callback) {
            _startPreload(callback);
        },
        
/**
 * @function {public Array} getImages Devuelve el array interno completo con las imagenes cargadas.
  */    
        getImages : function() {
            return _images;
        },
        
/**
 * @function {public Image} get Obtiene una Imagen de las imagenes cargadas.
 * @param {String} src el nombre, o parte del nombre, del archivo. La funcion devuelve el primero que encuentre.
 */    
        get : function(src) {
            var rTest = new RegExp(src);
            return _.filter(_images, function(i) { return rTest.test(i.src) })[0];
        }
    }
  };
 
  
  return rootApp;
 
}( Orange || {} ));