const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();
router.post("/assignments",authMiddleware,adminMiddleware,(req, res) => {
        const {
            volunteer_id,
            camp_id
        } = req.body;
        const sql = `
            INSERT INTO
            volunteer_assignments
            (
                volunteer_id,
                camp_id
            )
            VALUES (?, ?)
        `;
        db.query(
            sql,
            [volunteer_id, camp_id],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.status(201).json({
                    message:
                    "Volunteer Assigned Successfully"
                });
            });
    });
    router.get("/assignments",authMiddleware,(req, res) => {
        const sql = `
            SELECT *
            FROM volunteer_assignments
            ORDER BY assigned_at DESC
        `;
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(result);
        });
    });
    router.get("/assignments/:id",authMiddleware,(req, res) => {
        const assignmentId =
            req.params.id;
        const sql = `
            SELECT *
            FROM volunteer_assignments
            WHERE id = ?
        `;
        db.query(
            sql,
            [assignmentId],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result.length === 0) {
                    return res.status(404).json({
                        message:
                        "Assignment Not Found"
                    });
                }
                res.json(result[0]);
            });
    });
    router.delete("/assignments/:id",authMiddleware,adminMiddleware,(req, res) => {
        const assignmentId =
            req.params.id;
        const sql = `
            DELETE FROM volunteer_assignments
            WHERE id = ?
        `;
        db.query(
            sql,
            [assignmentId],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message:
                        "Assignment Not Found"
                    });
                }
                res.json({
                    message:
                    "Assignment Deleted Successfully"
                });
            });
    });
module.exports = router;