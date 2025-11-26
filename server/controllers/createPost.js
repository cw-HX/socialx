import Post from '../models/Post.js';

export const createPost = async (req, res) =>{
    try{

        const newPost = new Post(req.body);

        const post = await newPost.save();
        // return the created post so the client can react immediately
        return res.status(201).json(post);
        
    }catch(e){
        res.status(500).json({error:e});
    }
}