const { path } = require("express/lib/application");
const mongoose = require("mongoose");
const { BOOLEAN } = require("sequelize");
const usersSchema = mongoose.Schema(
  {
    user_name: { type: String, default: null },
    email: String,
    name: String,
    phone_number: String,
    device_id: String,
    currency: String,
    // facebook_id: { type: String, default: null },
    google_id: { type: String, default: null },
    apple_id: { type: String, default: null },
    password: String,
    comments: [
      {
        client_id: { type: mongoose.Types.ObjectId, default: null },
        project_id: { type: mongoose.Types.ObjectId, default: null },
        comment: { type: String, default: null },
      },
    ],
    ratings: [
      {
        client_id: { type: mongoose.Types.ObjectId, default: null },
        project_id: { type: mongoose.Types.ObjectId, default: null },
        rating: { type: Number, default: 0 },
      },
    ],
    profile_image: {
      type: String,
      default: null,
    },
    profile_key: {
      type: String,
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
    },
    country_code: {
      type: String,
      default: null,
    },
    location: [
      {
        lat: String,
        long: String,
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("Users", usersSchema);
module.exports = User;
