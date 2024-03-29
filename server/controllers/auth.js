import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* REGISTER USER */
const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });

        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/* LOGGING IN */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: 'User does not exist.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(300).json({ message: 'Invalid credentials.' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;

        return res.status(200).json({ token, user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { register, login };