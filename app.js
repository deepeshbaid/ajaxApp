var express = require("express"),
app     = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require('method-override');

mongoose.connect("mongodb://localhost/todo_app");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

var todoSchema = new mongoose.Schema({
  item: String,
});

var Todo = mongoose.model("Todo", todoSchema);

app.get("/", function(req, res){
  res.redirect("/todos");
});

app.get("/todos", function(req, res){
  Todo.find({}, function(err, todos){
    if(err){
      console.log(err);
    } else {
      res.render("index", {todos: todos}); 
    }
  })
});

app.get("/todos/new", function(req, res){
 res.render("new"); 
});

app.post("/todos", function(req, res){
 req.body.todo.item = req.sanitize(req.body.todo.item);
 var formData = req.body.todo;
 Todo.create(formData, function(err, newTodo){
    if(err){
      res.render("new");
    } else {
        res.redirect("/todos");
    }
  });
});

app.get("/todos/:id/edit", function(req, res){
 Todo.findById(req.params.id, function(err, todo){
   if(err){
     console.log(err);
     res.redirect("/")
   } else {
      res.render("edit", {todo: todo});
   }
 });
});

app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.redirect('/');
   }
 });
});

app.delete("/todos/:id", function(req, res){
 Todo.findById(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
      todo.remove();
      res.redirect("/todos");
   }
 }); 
});


app.listen(3000 || process.env.PORT, process.env.IP, function() {
  console.log('Server Running');
});