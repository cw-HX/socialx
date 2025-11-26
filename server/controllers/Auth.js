import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';




const generateToken =(id) =>{

    const jwtSecret = process.env.JWT_SECRET || 'thisIsTheSceretCodeForTheJWTToken';

    return jwt.sign({id}, jwtSecret, {
        expiresIn: '30d',
    })
}

export const register = async (req, res) =>{
    try{

        const {username, email, password, profilePic} = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new Users({
            username, 
            email,
            password: passwordHash,
            profilePic
        });

        const user = await newUser.save();

        // generate jwt token using function we defined at top of the page
        const token = generateToken(user._id);

        const userData = {_id: user._id, username: user.username, email:user.email, profilePic:user.profilePic, about: user.about, posts: user.posts, followers: user.followers, following:user.following };
        res.status(200).json({token, user:userData});

    }catch(err){
        res.status(500).json({error: err.message});
    }
};

export const login = async (req, res) =>{
    console.log("Login request received:", req.body);
    try{
        const {email, password} = req.body;
        if (!email || !password) {
            console.log("Login failed: Email or password missing");
            return res.status(400).json({ msg: "Please provide email and password" });
        }
        const user = await Users.findOne({email:email});
        if(!user) {
            console.log("Login failed: User not found for email:", email);
            return res.status(400).json({msg: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            console.log("Login failed: Invalid credentials for email:", email);
            return res.status(400).json({msg: "Invalid credentials"});
        }

        // generate jwt token using function we defined at top of the page
        const token = generateToken(user._id);
        const userObject = user.toObject();
        delete userObject.password;
        console.log("Login successful for user:", userObject);
        res.status(200).json({token, user:userObject});
    }catch(err){
        console.error("Login error:", err);
        res.status(500).json({error: err.message});
    }
};
