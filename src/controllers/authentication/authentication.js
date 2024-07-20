const { QueryTypes, Transaction } = require("sequelize");
const {
  findUserByEmail,
  emailAvailabilityCheck,
  findUserCustomField,
  userNameAvailabilityCheck,
  sendEmail,
  phoneNumberAvailabilityCheck,
} = require("../../helpers/utils");

const bcrypt = require("bcrypt");
const User = require("../../models/users/User");
const fs = require("fs");
const path = require("path");
const { accessToken } = require("../../middleware/jwt_token");
const { sendResponse } = require("../../helpers/response");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
exports.registerUser = async (req, res, next) => {
  try {
    let {
      user_name,
      name,
      email,
      password,
      device_id,
      role,
      phone_number,
      latitude,
      longitude,
      drone_model,
      region,
      distance,
      tools,
      license,
      country_code,
      currency,
      compilence_details,
    } = req.body;
    console.log(req.body, "nasn");
    let emailCheck = await emailAvailabilityCheck(email);
    console.log(emailCheck);
    if (emailCheck == false) {
      await sendResponse(res, 200, false, null, "Email taken!", {});
    } else {
      let userNameCheck = await userNameAvailabilityCheck(user_name);
      if (userNameCheck == false || userNameCheck == 2) {
        await sendResponse(res, 200, false, null, "User Name taken!", {});
      } else {
        let phoneNumberCheck = await phoneNumberAvailabilityCheck(phone_number);
        if (phoneNumberCheck == false) {
          await sendResponse(res, 200, false, null, "Phone Number taken!", {});
        } else {
          let location_array = [
            {
              lat: latitude,
              long: longitude,
            },
          ];
          let user_role = role.toLowerCase();
            let hashedPass = await bcrypt.hash(password, 10);
            password = hashedPass;
            let new_user = await User.create({
              user_name: user_name,
              email: email,
              phone_number: phone_number,
              name: name,
              country_code: country_code,
              location: location_array,
              device_id: device_id,
              currency: currency,
              password: password,
              role: user_role,
            });
            console.log("new suser", new_user);
            if (new_user) {
              let token = await accessToken(new_user);
              await sendResponse(
                res,
                200,
                true,
                null,
                "User registered successfully",
                { new_user, token }
              );
            } else {
              await sendResponse(
                res,
                400,
                false,
                null,
                "Something went wrong please try again later",
                {}
              );
            }
          
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    await sendResponse(
      res,
      500,
      false,
      err.message,
      "Something went wrong please try again later",
      {}
    );
  }
};
exports.loginUser = async (req, res, next) => {
  try {
    let { email, password, device_id } = req.body;
    console.log(req.body);
    let user = await findUserByEmail(email);
    console.log(user);
    if (user == false || user == 2) {
      await sendResponse(res, 200, false, null, "Invalid credentials", {});
    } else {
      if (await bcrypt.compare(password, user.password)) {
        user.device_id = device_id;
        await user.save();
        let token = await accessToken(user);
        user.password = null;
        if (user.profile_key) {
          let url = await getSignedURL(user.profile_key);
          console.log((url[0], "mm"));
          user.profile_image = url[0];
        } else {
          user.profile_image =
            "https://storage.googleapis.com/download/storage/v1/b/pilot-hunt/o/1677824886964-image_2023_01_04T10_25_39_286Z.png?generation=1677825037684178&alt=media";
        }
        await sendResponse(res, 200, true, null, "User login successfully", {
          user,
          token,
        });
      } else {
        await sendResponse(res, 200, false, null, "Invalid credentials", {});
      }
    }
  } catch (err) {
    console.log(err.message);
    await sendResponse(
      res,
      500,
      false,
      err.message,
      "Something went wrong please try again later",
      {}
    );
  }
};
exports.updatePassword = async (req, res, next) => {
  try {
    let user_id = req.user_id;
    let { current_password, new_password } = req.body;
    console.log(req.body);
    if (current_password == undefined || new_password == undefined) {
      await sendResponse(
        res,
        422,
        false,
        null,
        "All Inputs are Required..!",
        {}
      );
    } else {
      let user = await User.findById(user_id);
      if (user) {
        let isMatch = await bcrypt.compare(current_password, user.password);
        if (isMatch) {
          if (new_password.length >= 8) {
            bcrypt.hash(new_password, 10, async (err, hash) => {
              if (err) {
                return await sendResponse(
                  res,
                  400,
                  false,
                  err.message,
                  "Something went wrong please try again later",
                  {}
                );
              } else {
                user.password = hash;
                await user.save();
                await sendResponse(
                  res,
                  200,
                  true,
                  null,
                  "Password Updated Successfully",
                  {}
                );
              }
            });
          } else {
            await sendResponse(
              res,
              400,
              false,
              null,
              "Password length is too short",
              {}
            );
          }
        } else {
          await sendResponse(
            res,
            400,
            false,
            null,
            "Current password does not match",
            {}
          );
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    await sendResponse(
      res,
      500,
      false,
      err.message,
      "Something went wrong please try again later",
      {}
    );
  }
};
exports.forgetPassword = async (req, res, next) => {
  try {
    const { user_email } = req.body;
    if (user_email != undefined) {
      const user = await User.findOne({ email: user_email });
      if (user) {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRE,
          }
        );
        const link = `https://pilot.thecbt.cyou/api/v1/authentication/reset/${token}`;
        await sendEmail(user.email, link);
        await sendResponse(
          res,
          200,
          true,
          null,
          "Reset Password Link Sent to your Email Please Check Your Email..!",
          {}
        );
      } else {
        await sendResponse(res, 400, false, null, "Email not found", {});
      }
    } else {
      await sendResponse(res, 422, false, null, "Provide Valid Email....", {});
    }
  } catch (err) {
    console.log(err.message);
    await sendResponse(
      res,
      500,
      false,
      err.message,
      "Something went wrong please try again later",
      {}
    );
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    const { new_password } = req.body;

    const token = req.headers.authorization.split(" ")[1];

    const decode_token = jwt.decode(token);

    const user_id = decode_token.id;
    let user = await User.findById({ _id: user_id });
    if (user) {
      if (new_password.length >= 8) {
        const encryptedPassword = await bcrypt.hash(new_password, 10);
        const change_password = await User.updateOne(
          { _id: user_id },
          {
            password: encryptedPassword,
          }
        );
        await sendResponse(
          res,
          200,
          true,
          null,
          "Password Changed Successfully..!",
          {}
        );
      } else {
        await sendResponse(
          res,
          422,
          false,
          null,
          "Password Lenth is Too Short",
          {}
        );
      }
    } else {
      await sendResponse(res, 400, false, null, "User Does not Exist..", {});
    }
  } catch (err) {
    console.log(err);
    await sendResponse(
      res,
      500,
      false,
      err.message,
      "Something went wrong please try again later",
      {}
    );
  }
};


