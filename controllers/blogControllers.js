const Blog   = require("../models/blog.js");
const Comment= require("../models/comment.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'NEWTONSCHOOL';

/*

you can get query of type tags and name (Both or none of them can be also given)

/api/v1/blog/ --> 
Return all blogs.

/api/v1/blog/?tags=searCh -->
if you are given tags = searCh than return all the blogs that contain SEARCH as a substring in their tags. (Case Insensetive)

/api/v1/blog/?name=SwA --> 
if you are given name = SwA than return all the blogs that contain SwA as a substring in the name of the creator. (name varible is user schema refer by creator_id), (Case Insensetive)

/api/v1/blog/?name=SwA&tags=searCh --> 
if you are given tags = searCh and name = SwA than return all the blogs that contain SEARCH as a substring in their tags and SwA as a substring in the name of the creator. (Case Insensetive)

*/


const getAllBlog =async (req, res) => {

    const name = req.query.name;
    const tags = req.query.tags;
    
    //Write your code here.

    /* ... */
    const allBlog = /* ... */

    res.status(200).json({
        status: "success",
        data: allBlog
    })
   
}

const createBlog = async (req, res) => {

    const {heading, body, tags, token } = req.body;
    try{
        if(!token){
            res.status(401).json({
                status: 'fail',
                message: 'Missing token'
            });
        }
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, JWT_SECRET);
        }catch(err){
            res.status(401).json({
                status: 'fail',
                message: 'Invalid token'
            });
        }
        const newBlog = {
            heading,
            body,
            tags,
            creator_id : decodedToken.userId
        };
        const blog = await Blog.create(newBlog);
        res.status(200).json({
            message: 'Blog added successfully',
            blog_id: blog._id,
            status: 'success'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

/*

Modify deleteBlog Controller


1. delete the blog with given id in req.params.
2. Also delete all the comment that belong to given blog.
3. To delete comment understand the comment model and how it is link to blog by looking the project.

Response --> 

1. Success

200 Status code
json = {
  status: 'success',
  message: 'Blog deleted successfully'
}

2. Blog Doesnot exist

404 Status Code
json = {
    status: 'fail',
    message: 'Given Blog doesn't exist'
}

3. Something went wrong

500 Status Code
json = {
    status: 'fail',
    message: error message
}

*/


const deleteBlog = async (req, res) => {

    const id = req.params.id;

    const blog = await Blog.findById(id);
    if(!blog)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Blog doesn't exist"
        })
    }

    try{
        await Blog.findByIdAndDelete(id);
        const comments = await Comment.find({blogId : id});
        for(let i=0;i<comments.length;i++){
            await Comment.findByIdAndDelete(comments[i]._id);
        }
        res.status(200).json({
            status: 'success',
            message: 'Blog deleted successfully'
        });
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

const updateBlog = async (req, res) => {

    const id = req.params.id;

    const blog = await Blog.findById(id);
    if(!blog)
    {
        res.status(404).json({
            status: 'fail',
            message: "Given Blog doesn't exist"
        })
    }

    try{
        await Blog.findByIdAndUpdate(id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Blog updated successfully'
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    };

}

/*

getBlog Controller

Get the blog with given id in req.params.
The blog should contain an Array of comments object for that blog.
The comment object should contain _id, content, authorId, and blogId for every comment for that Blog.
Response --> 

1. Success

200 Status code
json = {
  status: 'success',
  data: {
    heading,
    body,
    creator_id,
    tags,
    comments:[
        {
            _id,
            content,
            authorId,
            blogId
        }
    ]
  }
}

2. Blog Doesnot exist

404 Status Code
json = {
    status: 'fail',
    message: "Given Blog doesn't exist"
}

3. Something went wrong

500 Status Code
json = {
    status: 'fail',
    message: 'Something went Wrong'
}

*/

const getBlog = async (req, res) => {

    const id = req.params.id;

    try{
        var blog = await Blog.findById(id);
        if(!blog)
        {
            res.status(404).json({
                status: 'fail',
                message: "Given Blog doesn't exist"
            })
        }
        const comments = await Comment.find({blogId : id});
        blog = blog.toObject();
        blog['comments'] = comments;
        res.status(200).json({
            status: 'success',
            data: blog
        })
    }catch(err){
        res.status(200).json({
            status: 'fail',
            message: "Something went Wrong"
        })
    }

}

module.exports = { getAllBlog, getBlog, createBlog, deleteBlog, updateBlog };
