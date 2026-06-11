const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();
router.post("/volunteers",authMiddleware,adminMiddleware,(req, res) => {
        const {
            name,
            phone,
            skills
        } = req.body;
        if (!name || !phone) {
            return res.status(400).json({
                message: "Name and Phone are required"
            });
        }
        const sql = `
            INSERT INTO volunteers
            (name, phone, skills)
            VALUES (?, ?, ?)
        `;
        db.query(
            sql,
            [name, phone, skills],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.status(201).json({
                    message: "Volunteer Added Successfully"
                });
            });
    });
    router.get("/volunteers",authMiddleware,(req, res) => {
        const sql = `
            SELECT *
            FROM volunteers
            ORDER BY created_at DESC
        `;
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(result);
        });
    });
    router.get("/volunteers/:id",authMiddleware,(req, res) => {
        const volunteerId = req.params.id;
        const sql = `
            SELECT *
            FROM volunteers
            WHERE id = ?
        `;
        db.query(
            sql,
            [volunteerId],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result.length === 0) {
                    return res.status(404).json({
                        message: "Volunteer Not Found"
                    });
                }
                res.json(result[0]);
            });
    });
    router.put("/volunteers/:id",authMiddleware,adminMiddleware,(req, res) => {
        const volunteerId = req.params.id;
        const {
            name,
            phone,
            skills,
            availability
        } = req.body;
        const sql = `
            UPDATE volunteers
            SET
                name = ?,
                phone = ?,
                skills = ?,
                availability = ?
            WHERE id = ?
        `;
        db.query(
            sql,
            [
                name,
                phone,
                skills,
                availability,
                volunteerId
            ],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Volunteer Not Found"
                    });
                }
                res.json({
                    message:
                    "Volunteer Updated Successfully"
                });
            });
    });
    router.delete("/volunteers/:id",authMiddleware,adminMiddleware,(req, res) => {
        const volunteerId = req.params.id;
        const sql = `
            DELETE FROM volunteers
            WHERE id = ?
        `;
        db.query(
            sql,
            [volunteerId],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Volunteer Not Found"
                    });
                }
                res.json({
                    message:
                    "Volunteer Deleted Successfully"
                });
            });
    });
module.exports = router;