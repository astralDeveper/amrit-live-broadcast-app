const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    image: String,
    agencyName: String,
    agencyTagLine: String,
    agencyOwner: String,
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Agency", agencySchema);
