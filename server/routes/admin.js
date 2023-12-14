const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


/** 
 * 
 *  Check login
*/
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}



/** 
 * GET /
 * Admin   - Login Page
*/

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: 'This is a blog website made with Node.js and Express.js and MongoDb',
        };
        res.render('admin/index', {
            locals,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
})

/** 
 * POST /
 * Admin   - Check Login 
*/

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true })
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
})

/** 
 * GET /
 * Admin   - Login Page
*/

router.get('/dashboard', authMiddleware, async (req, res) => {
    res.render('admin/dashboard');
})



/** 
 * POST /
 * Admin   - Register 
*/
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword
        })
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: "Username already exists" })
        }
        res.status(500).json({ message: "Something went wrong" })
    }
})



module.exports = router;