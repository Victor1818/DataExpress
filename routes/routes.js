var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var personSchema = mongoose.Schema({
    username: String,
    age: String,
    password: String,
    email: String
  });

  var Person = mongoose.model('People_Collection', personSchema);

  exports.index = function (req, res) {
    Person.find(function (err, person) {
      if (err) return console.error(err);
      res.render('index', {
        title: 'People List',
        people: person
      });
    });
  };