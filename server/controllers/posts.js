import Post from "../models/Posts.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        });

        await newPost.save();

        // Get All Posts
        const post = await Post.find();
        return res.status(201).json(post);
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();

        return res.status(200).json(post);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const post = await Post.find({ userId: req.params.userId });

        return res.status(200).json(post);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Get the Post
        const post = await Post.findById(id);
        // Check if the User has liked or not
        const isLiked = post.likes.get(userId);

        // Updating Likes on Post
        if(isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        // Save Updated Post
        const updatedPost = Post.findByIdAndUpdate(id, 
            { likes: post.likes },
            { new: true }       // this will return the updated document
            // By default it is false, which returns the non-updated document
        );

        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}