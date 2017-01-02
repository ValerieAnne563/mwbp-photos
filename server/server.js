var express = require('express')

app = express();

app.listen(8081);

app.get('/', function(req, res){
	res.write('Hello');
	res.end();
});