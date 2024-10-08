const express = require("express");
const router = express.Router();

const CoinPlanController = require("./coinPlan.controller");

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get coin plans
router.get("/", checkAccessWithKey(), CoinPlanController.index);

// get purchase plan history
router.get("/history", checkAccessWithKey(), CoinPlanController.purchaseHistory);

// all history get api
router.get("/getAllHistory", CoinPlanController.allPurchaseHistory);

//create coin plan
router.post("/", checkAccessWithKey(), CoinPlanController.store);

//create coin plan
router.get("/isTopToggle", checkAccessWithKey(), CoinPlanController.isTopToggle);

//pay stripe api for android For coinPlan and vipPlan
router.post("/stripe/createCustomer", CoinPlanController.createCustomer);

// purchase plan through stripe
router.post("/purchase/stripe", CoinPlanController.payStripe);

// purchase plan through google play
router.post("/purchase/googlePlay", CoinPlanController.payGooglePlay);

//update coin plan
router.patch("/:planId", checkAccessWithKey(), CoinPlanController.update);

//delete coin plan
router.delete("/:planId", checkAccessWithKey(), CoinPlanController.destroy);

module.exports = router;
