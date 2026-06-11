require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const campRoutes = require("./routes/campRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const app = express();
app.use(express.json());
app.use(authRoutes);
app.use(reportRoutes);
app.use(resourceRoutes);
app.use(assignmentRoutes);
app.use(allocationRoutes);
app.use(campRoutes);
app.use(volunteerRoutes);
app.get("/", (req, res) => {
    res.send("Smart Disaster Response System Backend Running");
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
