var path = require('path')
var fs = require('fs')
var _ = require('underscore')

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
      logger.error("Unable to load file from " + filename + "due to error.")
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
  mb_dir = path.join(__dirname, "/resources/maroon_bells_trails/")

  fs.readdir(mb_dir, function(error, files){

    json_files = _.filter(files, function(fname){
      return endsWith(fname, ".geojson")
    })
    logger.debug("Found " + json_files.length + " trail files")

    file = path.join(mb_dir, json_files[0])
    load_file(file, function(response){
      callback(response)
    })
  });

}