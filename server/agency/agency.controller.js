const fs = require("fs");
const { compressImage } = require("../../util/compressImage");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");
const User = require("../user/user.model");
const Agency = require("./agency.model");

//store agency
exports.store = async (req, res) => {
  console.log('000000000000000000000');
  console.dir(req.files);
  try {
    if (
      !req.body.agencyName ||
      !req.file ||
      !req.body.agencyOwner ||
      !req.body.agencyTagLine
    ) {
      if (req.file) {
        deleteFiles(req.files);
      }
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    const user = await User.findById(req.body.agencyOwner);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const agency = await Agency.create({
      agencyName: req.body.agencyName,
      agencyTagLine: req.body.agencyTagLine,
      agencyOwner: req.body.agencyOwner,
      image: req.file.path,
    });

    return res
      .status(200)
      .json({ status: true, message: "Success!", agency: agency });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// get all Agency
exports.index = async (req, res) => {
  try {
    const agency = await Agency.find();
    if (!agency)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", agency });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Delete Agency
exports.destroy = async (req, res) => {
  try {
    // const agency = await Agency.findByIdAndDelete(req.params.agencyId);

    // if (!agency) {
    //   return res
    //     .status(404)
    //     .json({ status: false, message: "Agency not found" });
    // }

    const agency = await Agency.findById(req.params.agencyId);

    if (!agency)
      return res
        .status(200)
        .json({ status: false, message: "Agency does not Exist!" });

    if (fs.existsSync(agency.image)) {
      fs.unlinkSync(agency.image);
   }

    await agency.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "Agency deleted successfully" });
  } catch (error) {
    console.error("Error deleting agency:", error);
    return res.status(500).json({ status: false, error: "Server Error" });
  }
};

// Update Agency
exports.update = async (req, res) => {
  try {
    const { agencyName, agencyTagLine, agencyOwner } = req.body;
    if (!agencyName || !agencyTagLine || !agencyOwner) {
      return res.status(400).json({ status: false, error: "Server Error" });
    }

    const agency = await Agency.findById(req.params.agencyId);

    if (!agency) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Agency does not Exist!" });
    }
    if (req.file) {
      if (fs.existsSync(agency.image)) {
        fs.unlinkSync(agency.image);
      }
      // compress image
      // compressImage(req.file);
      agency.image = req.file.path;
    }

    agency.agencyName = agencyName;
    agency.agencyTagLine = agencyTagLine;
    agency.agencyOwner = agencyOwner;

    await agency.save();

    return res.status(200).json({ status: true, message: "Success!", agency });
  } catch (error) {
    console.log(error);

    req.files?.image &&
      fs.existsSync(req.files?.image[0]?.path) &&
      fs.unlinkSync(req.files?.image[0]?.path);

    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
