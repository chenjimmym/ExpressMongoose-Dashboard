var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dog_db');
mongoose.Promise = global.Promise;

var DogSchema = new mongoose.Schema({
    name: String,
    color: String
}, {
    timestamps: true
});

var Dog = mongoose.model('Dog', DogSchema);

app.get('/', function(request, response){
    Dog.find({}, function(error, dogs){
        // console.log(dogs);
        response.render('index', {dogs: dogs})
    })
})

app.get('/dogs/new', function(request, response){
    response.render('add');
})

app.post('/dogs', function(request, response){
    console.log('@@@', request.body);
    var dog = new Dog({name: request.body.name, color: request.body.color});
    dog.save(function(error){
        if (error){
            console.log('there is error');
        } else {
            console.log('successfully added');
            response.redirect('/');
        }
    })
})

app.get('/dogs/edit/:id', function(request, response){
    response.render('edit', {id: request.params.id});
})

app.post('/dogs/delete/:id', function(request, response){
    Dog.remove({_id: request.params.id}, function (error){
        if (error) {
            console.log("Error");
        } else {
            response.redirect('/');
        }
    });
})

app.post('/dogs/:id', function(request, response){
    Dog.update({_id: request.params.id},{$set:{color: request.body.color}}, function(error, result){
        if (error) {
            console.log(error);
        } else {
            console.log('updatedddddddddd');
            response.redirect('/');
        }
    });
})

app.get('/dogs/:id', function (request, response){
    // console.log("The user id requested is:", req.params.id);
    Dog.find({_id:request.params.id}, function(error, dog){
        console.log(dog);
        response.render('dog', {dog:dog})
    })
    // res.send("You requested the user with id: " + req.params.id);
});

app.listen(8000,function(){
    console.log('listenning port 8000');
});