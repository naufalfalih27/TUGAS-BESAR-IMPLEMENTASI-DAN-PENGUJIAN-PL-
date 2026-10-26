const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
    try{
        const{username, email, password, role} = req.body;
        
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const [existingUser] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, role]);

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try{
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
    const [users] = await db.query("SELECT userID, username, password, role from users where username = ?", [username]);

    if (users.length === 0) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const user  = users[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userID: user.userID, username: user.username, role: user.role },
        process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, user: { userID: user.userID, username: user.username, role: user.role }});
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
}
});

module.exports = router;