const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const router = express.Router();
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    const checkUserSql =
        "SELECT * FROM users WHERE email = ?";
    db.query(
        checkUserSql,
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }
            const insertSql =
                "INSERT INTO users(name,email,password) VALUES(?,?,?)";
            db.query(
                insertSql,
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    res.status(201).json({
                        message: "User Registered Successfully"
                    });
                }
            );
        }
    );
});
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql =
        "SELECT * FROM users WHERE email = ?";
    db.query(
        sql,
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (result.length === 0) {
                return res.status(404).json({
                    message: "User Not Found"
                });
            }
            const isMatch = bcrypt.compareSync(
                password,
                result[0].password
            );
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }
            const token = jwt.sign(
                {id: result[0].id,
                 email: result[0].email,
                 role: result[0].role},
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                });
                res.json({
                    message: "Login Successful",
                    token
                });
            });
});
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message:"profile Access granted",
        user: req.user
    });
});
router.get("/admin",authMiddleware,adminMiddleware,(req, res)=>{
    res.json({
        message:"Admin Access granted",
        user: req.user  
    });
});
router.get("/users", (req, res) => {
    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
    `;
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});
module.exports = router;