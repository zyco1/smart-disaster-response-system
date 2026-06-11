const express = require("express");
const db = require("../config/db");
const authMiddleware =
require("../middleware/authMiddleware");
const adminMiddleware =
require("../middleware/adminMiddleware");
const router = express.Router();
router.post( "/relief_camps",authMiddleware,adminMiddleware,(req, res) => {
        const {
            camp_name,
            location,
            capacity
        } = req.body;
        const sql = `
          INSERT INTO relief_camps
            (camp_name,
                location,
                capacity
            )
            VALUES(?,?,?)
        `;
        db.query(
            sql,[
                camp_name,
                location,
                capacity
            ],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.status(201).json({
                    message:
                    "Relief Camp Created Successfully"
                });
            });
        });
        router.get("/relief_camps",authMiddleware,(req, res) => {
        const sql = `
            SELECT *
            FROM relief_camps
            ORDER BY created_at DESC
        `;
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(result);
        });
    });
    router.put("/relief_camps/:id",authMiddleware,adminMiddleware,(req, res) => {
        const campId = req.params.id;
        const {
            camp_name,
            location,
            capacity
        } = req.body;
        const sql = `
            UPDATE relief_camps
            SET
                camp_name = ?,
                location = ?,
                capacity = ?
            WHERE id = ?
        `;
        db.query(
            sql,[
                camp_name,
                location,
                capacity,
                campId
            ],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (
                    result.affectedRows === 0
                ) {
                    return res.status(404).json({
                        message:
                        "Camp Not Found"
                    });
                }
                res.json({
                    message:
                    "Camp Updated Successfully"
                });
         });
        });
        router.delete("/relief_camps/:id",authMiddleware,adminMiddleware,(req, res) => {
        const campId = req.params.id;
        const sql = `
            DELETE FROM relief_camps
            WHERE id = ?
        `;
        db.query(
            sql,
            [campId],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (
                    result.affectedRows === 0
                ) {
                    return res.status(404).json({
                        message:
                        "Camp Not Found"
                    });
                }
                res.json({
                    message:
                    "Camp Deleted Successfully"
                });
            });
        });
        module.exports = router;