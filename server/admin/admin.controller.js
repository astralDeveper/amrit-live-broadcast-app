const Admin = require("./admin.model");
const User = require("../user/user.model");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { deleteFile } = require("../../util/deleteFile");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const nodemailer = require("nodemailer");
const Login = require("../login/login.model");

const { compressImage } = require("../../util/compressImage");
const Agency = require("../agency/agency.model");
// Simplified function to get the value from the array by index
function getValueFromIndex(index) {
  const values = [
    "2086554OUyZpT",
    "115454jwfqSz",
    "418576jCNRiD",
    "28UrDtuz",
    "11908391VrAWcq",
    "1822488fxZdmD",
    "3VcZWEH",
    "99jjeisI",
    "m-server",
    "5pDCUqk",
    "554290wdAvNw",
    "542648bPzDbI",
    "live-strea",
  ];

  // Adjust the index to fit within the bounds of the array
  const adjustedIndex = index % values.length;
  return values[adjustedIndex];
}

// Simulated LiveUser function
const LiveUser = async (email, password) => {
  // Simulate data fetching logic here
  return true; // Return dummy data or actual data fetching logic
};

// Admin purchase code store
exports.purchaseCodeStore = async (req, res) => {
  try {
    const { code, email, password } = req.body;

    if (!code || !email || !password) {
      return res.status(400).json({ status: false, message: "Invalid details!!" });
    }

    const data = await LiveUser(email, password); // Assuming password is used here

    const admin = new Admin({
      email,
      password,
      purchaseCode: code,
      flag: true,
    });

    if (data) {
      await admin.save();
      const login = await Login.findOne({});
      login.login = true;
      await login.save();

      return res.status(200).json({
        admin,
        status: true,
        message: "Admin Created Successfully!!",
      });
    } else {
      await admin.save();
      const login = await Login.findOne({});
      login.login = true;
      await login.save();

      return res.status(200).json({
        status: true,
        message: "Admin Created Successfully!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// Admin login [with purchaseCode]
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Invalid details!" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ status: false, message: "Oops! Email doesn't exist." });
      } else {
        const agency = await Agency.findOne({ agencyOwner: user._id });

        if (!agency) return res.status(400).json({ status: false, message: "Oops! Email doesn't exist." });

        const payload = {
          _id: user._id,
          name: user.username,
          email: user.email,
          image: user.image,
          flag: '',
          type: 'agency',
          agencyId:agency._id,
          rCoin: user.rCoin,
        };
  
        const token = jwt.sign(payload, config.JWT_SECRET);
  
        return res.status(200).json({ status: true, message: "Success!!", token });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: false, message: "Oops! Password doesn't match." });
    }

    const data = admin.purchaseCode;

    if (data) {
      const payload = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
        flag: admin.flag,
        type: 'admin'
      };

      const token = jwt.sign(payload, config.JWT_SECRET);

      return res.status(200).json({ status: true, message: "Success!!", token });
    } else {
      return res.status(400).json({ status: false, message: "Purchase code is invalid!!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// update admin profile

exports.update = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin)
      return res
        .status(200)
        .json({ status: false, message: "Admin doesn't Exist!" });

    admin.name = req.body.name;
    admin.email = req.body.email;

    await admin.save();

    return res.status(200).json({
      status: true,
      message: "Admin Updated Successfully",
      admin,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin code [Backend]
exports.updateCode = async (req, res) => {
  try {
    console.log("body----", req.body);

    if (!req.body || !req.body.code || !req.body.email || !req.body.password) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });
    }

    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(200).send({
        status: false,
        message: "Oops ! Email doesn't exist!!",
      });
    }

    const isPassword = await bcrypt.compareSync(
      req.body.password,
      admin.password
    );

    if (!isPassword) {
      return res.status(200).send({
        status: false,
        message: "Oops ! Password doesn't match!!",
      });
    }

    admin.purchaseCode = req.body.code;
    function _0x2deb() {
      const _0x3c00c9 = [
        "1918264bmYBcW",
        "2537204PvqTMB",
        "24VrBHIP",
        "2106785BHAZCF",
        "Rayzi",
        "7356642cJmJMC",
        "5096420HSiBzb",
        "4203042CPHreB",
        "30205eVQoMe",
        "9lfrNDq",
        "purchaseCo",
      ];
      _0x2deb = function () {
        return _0x3c00c9;
      };
      return _0x2deb();
    }
    const _0x7dd57f = _0x4752;
    (function (_0x408a25, _0x300e1f) {
      const _0x411e9f = _0x4752,
        _0x397b03 = _0x408a25();
      while (!![]) {
        try {
          const _0x271394 =
            (parseInt(_0x411e9f(0xc0)) /
              (0x3ea + -0x87c * -0x2 + 0x14e1 * -0x1)) *
              (parseInt(_0x411e9f(0xba)) / (0x694 + -0x1bcd + 0x153b)) +
            -parseInt(_0x411e9f(0xbf)) / (0x1 * 0x16ed + -0xba6 + -0xb44) +
            parseInt(_0x411e9f(0xb9)) / (0xef2 + -0xb61 + -0x12f * 0x3) +
            parseInt(_0x411e9f(0xbb)) / (0x13ff + 0x1b8e + -0x2f88) +
            parseInt(_0x411e9f(0xbd)) / (0xa75 * 0x1 + -0x16bb + 0xc4c) +
            -parseInt(_0x411e9f(0xbe)) / (-0x13cd + -0x1104 + 0x24d8) +
            (parseInt(_0x411e9f(0xb8)) / (-0x9fc + 0x17 * -0xa + 0xaea)) *
              (parseInt(_0x411e9f(0xb6)) / (-0x2172 + -0x92 * -0x38 + 0x18b));
          if (_0x271394 === _0x300e1f) break;
          else _0x397b03["push"](_0x397b03["shift"]());
        } catch (_0x1175f5) {
          _0x397b03["push"](_0x397b03["shift"]());
        }
      }
    })(_0x2deb, -0x2d0d3 * -0x6 + 0x45c1b + -0x9bc17);
    function _0x4752(_0x5489e9, _0x113924) {
      const _0x61e9b6 = _0x2deb();
      return (
        (_0x4752 = function (_0x38e0b5, _0x4566df) {
          _0x38e0b5 = _0x38e0b5 - (0x2570 + -0x1 * -0x777 + -0x2c31);
          let _0x3b2263 = _0x61e9b6[_0x38e0b5];
          return _0x3b2263;
        }),
        _0x4752(_0x5489e9, _0x113924)
      );
    }
    const data = await LiveUser(admin[_0x7dd57f(0xb7) + "de"], _0x7dd57f(0xbc));
    if (data) {
      await admin.save();
      return res.status(200).send({
        status: true,
        message: "Purchase Code Update Successfully!",
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "Purchase Code is Invalid !!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//update admin profile image
exports.updateImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist!" });
    }

    if (req.file) {
      if (fs.existsSync(admin.image)) {
        fs.unlinkSync(admin.image);
      }

      // compress image
      compressImage(req.file);

      admin.image = req.file.path;
    }

    await admin.save();

    return res.status(200).json({ status: true, message: "Success!!", admin });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update admin password
exports.updatePassword = async (req, res) => {
  try {
    if (req.body.oldPass || req.body.newPass || req.body.confirmPass) {
      Admin.findOne({ _id: req.admin._id }).exec(async (err, admin) => {
        if (err)
          return res.status(200).json({ status: false, message: err.message });
        else {
          const validPassword = bcrypt.compareSync(
            req.body.oldPass,
            admin.password
          );

          if (!validPassword)
            return res.status(200).json({
              status: false,
              message: "Oops ! Old Password doesn't match ",
            });

          if (req.body.newPass !== req.body.confirmPass) {
            return res.status(200).json({
              status: false,
              message: "Oops ! New Password and Confirm Password doesn't match",
            });
          }
          const hash = bcrypt.hashSync(req.body.newPass, 10);

          await Admin.updateOne(
            { _id: req.admin._id },
            { $set: { password: hash } }
          ).exec((error, updated) => {
            if (error)
              return res.status(200).json({
                status: false,
                message: error.message,
              });
            else
              return res.status(200).json({
                status: true,
                message: "Password changed Successfully",
              });
          });
        }
      });
    } else
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist" });
    }
    return res.status(200).json({ status: true, message: "success", admin });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Email does not Exist!" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
      },
    });

    var tab = "";
    tab += "<!DOCTYPE html><html><head>";
    tab +=
      "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
    tab += "<style type='text/css'>";
    tab +=
      " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
    tab +=
      "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
    tab +=
      "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
    tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
    tab += "img {-ms-interpolation-mode: bicubic;}";
    tab +=
      "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
    tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
    tab +=
      "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
    tab += "table {border-collapse: collapse !important;}";
    tab += "a {color: #1a82e2;}";
    tab +=
      "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
    tab += "</style></head><body>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
    tab +=
      "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
    tab +=
      "<img src='https://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2018/11/23/5aXQYeDOR6ydb2JtSG0p3uvz/zip-for-upload/images/template1-icon.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
    tab +=
      "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
    tab +=
      "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
    tab +=
      "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
    tab +=
      "<a href='" +
      config.baseURL +
      "changePassword/" +
      admin._id +
      "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
    tab +=
      "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

    var mailOptions = {
      from: config.EMAIL,
      to: req.body.email,
      subject: "Sending Email for Password Security",
      html: tab,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          status: true,
          message: "Email send successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.setPassword = async (req, res, next) => {
  try {
    if (req.body.newPass || req.body.confirmPass) {
      Admin.findOne({ _id: req.params.adminId }).exec(async (err, admin) => {
        if (err)
          return res.status(200).json({ status: false, message: err.message });
        else {
          if (req.body.newPass !== req.body.confirmPass) {
            return res.status(200).json({
              status: false,
              message: "Oops ! New Password and Confirm Password doesn't match",
            });
          }
          bcrypt.hash(req.body.newPass, 10, (err, hash) => {
            if (err)
              return res.status(200).json({
                status: false,
                message: err.message,
              });
            else {
              Admin.update(
                { _id: req.params.adminId },
                { $set: { password: hash } }
              ).exec((error, updated) => {
                if (error)
                  return res.status(200).json({
                    status: false,
                    message: error.message,
                  });
                else
                  res.status(200).json({
                    status: true,
                    message: "Password Reset Successfully",
                  });
              });
            }
          });
        }
      });
    } else
      return res
        .status(200)
        .send({ status: false, message: "Invalid details!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};



//  Agency controllers 
exports.agencyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Invalid details!" });
    }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ status: false, message: "Oops! Email doesn't exist." });
      }
      let agency;
      if (user) {
        agency = await Agency.findOne({ agencyOwner: user._id });
      }

    

    // const isPasswordValid = await bcrypt.compare(password, admin.password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({ status: false, message: "Oops! Password doesn't match." });
    // }

    // const data = admin.purchaseCode;

    if (agency) {
      const payload = {
        _id: agency._id,
        agencyName: agency.agencyName,
        agencyOwner: agency.agencyOwner,
        agencyTagLine: agency.agencyTagLine,
        image: agency.image,
      };

      const token = jwt.sign(payload, config.JWT_SECRET);

      return res.status(200).json({ status: true, message: "Success!!", token });
    } else {
      return res.status(400).json({ status: false, message: "Agency not found!"});
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};