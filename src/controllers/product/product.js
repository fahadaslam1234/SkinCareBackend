let Product = require("../../models/products/Products");
const { sendResponse } = require("../../helpers/response");

exports.createProduct = async (req, res, next) => {
  try {
      let {
        product_name,
      product_description,
      product_image
      } = req.body;
           
          let createBooking = await Product.create({
            product_name: product_name,
            product_description: product_description,
            product_image: product_image
          });
          if (createBooking) {
              await sendResponse(
                res,
                200,
                true,
                null,
                "Project Created Successfully",
                createBooking
              );           
          } else {
            await sendResponse(
              res,
              400,
              false,
              null,
              "Something went wrong while creating project",
              {}
            );
          } 
    
  } catch (err) {
    console.log(err.message);
    await sendResponse(
      res,
      500,
      false,
      err.message,
      "something went wrong please try again later",
      {}
    );
  }
};



