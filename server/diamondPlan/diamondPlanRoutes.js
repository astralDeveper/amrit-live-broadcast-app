const express = require("express");
const router = express.Router();

const diamondPlanController = require("./diamondPlanController");

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get coin plans
router.get("/", checkAccessWithKey(), diamondPlanController.index);

// get purchase plan history
router.get("/history", checkAccessWithKey(), diamondPlanController.purchaseHistory);

//create coin plan
router.post("/", checkAccessWithKey(), diamondPlanController.store);

//create coin plan
router.get("/isTopToggle", checkAccessWithKey(), diamondPlanController.isTopToggle);

//pay stripe api for android For coinPlan and vipPlan
router.post("/stripe/createCustomer", diamondPlanController.createCustomer);

// purchase plan through stripe
router.post("/purchase/stripe", diamondPlanController.payStripe);

// purchase plan through google play
router.post("/purchase/googlePlay", diamondPlanController.payGooglePlay);

//update coin plan
router.patch("/:planId", checkAccessWithKey(), diamondPlanController.update);

//delete coin plan
router.delete("/:planId", checkAccessWithKey(), diamondPlanController.destroy);

module.exports = router;
