const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const AgencyController = require("./agency.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");

// router.use(checkAccessWithKey());

// get all gifts
// router.get('/all', checkAccessWithKey(), AgencyController.index);

// get category wise gift
// router.get(
//   '/:categoryId',
//   checkAccessWithKey(),
//   AgencyController.categoryWiseGift
// );

router.post("/", checkAccessWithKey(), upload.single('image'), AgencyController.store);
router.patch("/:agencyId", checkAccessWithKey(), upload.single('image'), AgencyController.update);
router.get("/all", checkAccessWithKey(), AgencyController.index);
router.delete("/:agencyId",checkAccessWithKey(),AgencyController.destroy);

// //svga Add
// router.post("/svgaAdd", checkAccessWithKey(),   upload.fields([{ name: 'image' }, { name: 'svgaImage' }]), AgencyController.svgaAdd);

// // update gift
// router.patch("/:giftId", checkAccessWithKey(), upload.fields([{ name: 'image' }, { name: 'svgaImage' }]), AgencyController.update);

// // delete image
// router.delete('/:giftId', checkAccessWithKey(), AgencyController.destroy);

module.exports = router;
