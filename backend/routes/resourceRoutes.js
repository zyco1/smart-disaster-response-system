const express = require("express");

const db = require("../config/db");

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const router = express.Router();
router.post ("/resources",authMiddleware,adminMiddleware,(req, res) => {
    const {
        resource_name,
        quantity,
        location } = req.body;
        if (
    !resource_name?.trim() ||
    !location?.trim() ||
    quantity === undefined ||
    quantity === null
) {
    return res.status(400).json({
        message: "All fields are required"
    });
}
        const sql = `
        INSERT INTO resources(resource_name,quantity,location)
        VALUES(?,?,?)`;
        db.query(sql, [resource_name, quantity, location], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(201).json({
                message: "Resource Added Successfully"
            });
        });
});
router.get("/resources", authMiddleware, (req, res) => {
    const sql = `
        SELECT * FROM resources
        order by created_at desc
    `;
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }   
        res.json(result);
    });
});
router.put("/resources/:id", authMiddleware,adminMiddleware, (req, res) => {
    const resourceId = req.params.id;
    const{
        resource_name,
        quantity,
        location
    } = req.body;
    const sql = `
        UPDATE resources
        SET resource_name = ?, quantity = ?, location = ?
        WHERE id = ?
    `;
    db.query(sql, [resource_name, quantity, location, resourceId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Resource Not Found"
            });
        }
        res.json({
            message: "Resource Updated Successfully"
        });
    });
});
router.delete("/resources/:id", authMiddleware,adminMiddleware, (req, res) => {
    const resourceId = req.params.id;
    const sql = `
        DELETE FROM resources
        WHERE id = ?
    `;
    db.query(sql, [resourceId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Resource Not Found"
            });
        }
        res.json({
            message: "Resource Deleted Successfully"
        });
    });
});
module.exports = router;