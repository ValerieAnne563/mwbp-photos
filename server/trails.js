var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var async = require('async')

const logger = require('log4js').getLogger();

format_linestring = function(ls_coordinates){
  logger.debug("Adding line with " + ls_coordinates.length + " points.")
  return _.map(ls_coordinates, function(point){
    {return {lat: point[1], lng: point[0]}}
  })
}

extract_feature = function(feature){
  linestrings = feature["geometry"]["coordinates"] //TODO Don't assume it's a MultiLineString
  return _.map(linestrings, format_linestring)
}

load_file = function(filename, callback){
  fs.readFile(filename, function when_read(error, data){
    if (error != null){
      logger.error("Unable to load file from " + filename + " due to error:")
      logger.error(error)
      callback("[]")
    }
    else{
      features = JSON.parse(data)["features"]
      paths = _.chain(features).map(extract_feature).flatten(true).value()
      logger.debug("Extracted " + paths.length + " paths")

      callback(paths)

    }
  })
}

//String utils
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

exports.load_all = function(callback){
  console.log("loading")
  mb_dir = path.join(__dirname, "/resources/maroon_bells_trails/")

  fs.readdir(mb_dir, function(error, files){

    json_files = _.chain(files)
                  .filter(function(fname){
                    return endsWith(fname, ".geojson")
                  })
                  .map(function(x){return path.join(mb_dir, x)})
                  .value()
    logger.debug("Found " + json_files.length + " trail files")


    aggregate_files = function(error, lists){
      console.log("Supplying map with " + lists.length + " trails")
      callback(_.flatten(lists, true))
    }

    //second argument to async.map must send two values to its callback (err, value)
    //since load_file only sends one, this adapter wraps the call and sends it back
    // with the compatible
    adapter = function(filename, callback){
      load_file(filename, function(response){
        callback(error, response)
      })
    }
    async.map(json_files, adapter, aggregate_files)


  });

}