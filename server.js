var express = require("express");
var app = express();
var path = require("path");


app.use(express.static(path.join(__dirname, 'static')));


app.listen(4000, () => console.log('Listening on port 4000!'));


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'static', 'map.html'));
});


app.get('*', function(req, res) {
  res.status(404).send('404 Not Found');
});
