var express = require('express')

app = express();

// process.env.PORT as set by Heroku
var port = process.env.PORT || 8081;

app.listen(port);

app.get('/', function(req, res){
	res.write('Hello');
	res.end();
});