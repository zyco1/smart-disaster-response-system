const express = require("express");

const db = require("../config/db");

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const router = express.Router();
router.post("/allocations",authMiddleware,adminMiddleware,(req, res) => {
       const {
            resource_id,
            allocated_quantity,
            allocated_to
        } = req.body;
    if (
    resource_id === undefined ||
    allocated_quantity === undefined ||
    !allocated_to
) {
    return res.status(400).json({
        message: "All fields are required"
    });
}
    
        const allocated_by = req.user.id;
        const checkSql = `
            SELECT *
            FROM resources
            WHERE id = ?
        `;
        db.query(
            checkSql,
            [resource_id],
            (err, resourceResult) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (resourceResult.length === 0) {
                    return res.status(404).json({
                        message: "Resource Not Found"
                    });
                }
                const availableQuantity =
                    resourceResult[0].quantity;
                if (
                    allocated_quantity >
                    availableQuantity
                ) {
                    return res.status(400).json({
                        message:
                        "Not Enough Resources Available"
                    });
                }
                const insertSql = `
                    INSERT INTO
                    resource_allocations(
                        resource_id,
                        allocated_quantity,
                        allocated_to,
                        allocated_by
                    )
                    VALUES(?,?,?,?)
                `;
                db.query(
                    insertSql,[
                        resource_id,
                        allocated_quantity,
                        allocated_to,
                        allocated_by ],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json(err);
                        }
                        const updateSql = `
                            UPDATE resources
                            SET quantity =
                                quantity - ?
                            WHERE id = ?
                        `;
                        db.query(
                            updateSql,[
                                allocated_quantity,
                                resource_id]
                        );
                        res.status(201).json({
                            message:
                            "Resource Allocated Successfully"
                        });
                    });
                 });
    });
    module.exports = router;