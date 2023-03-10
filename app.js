require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT;


const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.otvpdjb.mongodb.net/${process.env.DB_DATABASE}`
mongoose.set({strictQuery: true});
mongoose.connect(url);

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Post = mongoose.model("Post",postSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  Post.find({},(err,posts)=>{
    if(!err){
      res.render('pages/home', {
        listOfPosts : posts
      })
    }
  })
})

app.get('/about', (req, res) => {
  res.render('pages/about', {})
})

app.get('/contact', (req, res) => {
  res.render('pages/contact', {})
})

app.get('/compose',(req,res)=>{
  res.render('pages/compose',{})
})

app.post('/compose',(req,res)=>{
  const post = Post({
    title : req.body.titleOfPost,
    content : req.body.textOfPost
  });
  post.save();
  res.redirect('/');
})

app.get("/posts/:post",(req,res)=>{
  var requestedPostID = req.params.post;
  Post.findOne({_id: requestedPostID},(err,currentPost)=>{
      res.render('pages/selectedPost',{
        selectedTitle : currentPost.title,
        selectedContent : currentPost.content,
      });
  });
})

app.listen(port, (req, res) => {
  console.log(`App is listening at ${port}`);
})
