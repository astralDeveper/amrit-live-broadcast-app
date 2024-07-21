const express = require("express");
const router = express.Router();

const DashboardController = require("./dashboard.controller");

var checkAccessWithKey = require("../../checkAccess");

// get dashboard
router.get("/", checkAccessWithKey(), DashboardController.dashboard);
// agency Dashboard
router.get("/agency/:id",checkAccessWithKey(),DashboardController.agencyDashboard);
// analytic
router.get("/analytic", checkAccessWithKey(), DashboardController.analytic);

module.exports = router;
