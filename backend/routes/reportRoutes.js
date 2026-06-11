const express = require("express");

const db = require("../config/db");

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const router = express.Router();
router.post("/disaster_reports",authMiddleware,(req, res) => {
    const{
        disaster_type,
        location,
        severity,
        description
    } = req.body;
    if(
    !disaster_type ||
    !location ||
    !severity
){
    return res.status(400).json({
        message:"All required fields are mandatory"
    });
}
    const user_id = req.user.id;
    const sql = `
        INSERT INTO disaster_reports(user_id,disaster_type,location,severity,description)
        VALUES(?,?,?,?,?)`;
    db.query(sql, [user_id, disaster_type, location, severity, description], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(201).json({
            message: "Report Submitted Successfully"
        });
    });
});
router.get("/disaster_reports", authMiddleware, (req, res) => {
    const sql = `
    select * from disaster_reports
    order by created_at desc
    `;
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});
router.get("/disaster_reports/:id", authMiddleware, (req, res) => {
    const reportId = req.params.id;
    const sql = `
        SELECT * FROM disaster_reports
        WHERE id = ?
    `;
    db.query(sql, [reportId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: "Report Not Found"
            });
        }
        res.json(result[0]);
    });
});
router.put("/disaster_reports/:id/status", authMiddleware,adminMiddleware, (req, res) => {
    const reportId = req.params.id;
    const { status } = req.body;
    if(
    status !== "pending" &&
    status !== "verified" &&
    status !== "rejected"
){
    return res.status(400).json({
        message:"Invalid Status"
    });
}
    const sql = `
        UPDATE disaster_reports
        SET status = ?
        WHERE id = ?
    `;
    db.query(sql, [status, reportId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Report Not Found"
            });
        }
        res.json({
            message: "Report Status Updated Successfully"
        });
    });
});
module.exports = router;