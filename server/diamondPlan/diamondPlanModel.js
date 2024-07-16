const mongoose = require("mongoose");

const DiamondPlanSchema = new mongoose.Schema(
  {
    diamonds: Number,
    coins: Number,
    tag: String,
    // productKey: String,
    isDelete: { type: Boolean, default: false },
    isTop: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
DiamondPlanSchema.index({ isDelete: 1 });

module.exports = mongoose.model("DiamondPlan", DiamondPlanSchema);
