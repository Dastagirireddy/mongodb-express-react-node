var express = require('express'),
	mongoose = require('mongoose');

var app = express();
app.use(express.static(__dirname + '/public'));

/* ################# Mongoose connection && Schema && model ################# */
mongoose.connect('mongodb://localhost:27017/contactdb', function(err, data){

	if(err) return;
	console.log("Success");
});

var ContactSchema = new mongoose.Schema({
	name: String,
	email: String,
	phone: String
});

var ContactModel = mongoose.model('Contact', ContactSchema);

/* ################## Register Contact model with express-restify ###################*/
var REST = require('express-restify')(app);
REST.register({
	url: '/api/contacts',
	model: 'Contact'
});

app.listen(3000, function() {

    console.log("Http server running at http://localhost:3000");
});
