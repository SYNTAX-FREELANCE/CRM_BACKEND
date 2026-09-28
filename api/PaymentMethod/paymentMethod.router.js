const express = require("express");
const router = express.Router();

const PaymentMethodController = require("./paymentMethod.controller");
const verifyAccessToken = require("../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    PaymentMethodController.createPaymentMethod
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    PaymentMethodController.getAllPaymentMethods
);


// GET BY ID
router.get(
    "/getbyid/:paymentMethodId",
    verifyAccessToken,
    PaymentMethodController.getPaymentMethodById
);


// UPDATE
router.patch(
    "/update/:paymentMethodId",
    verifyAccessToken,
    PaymentMethodController.updatePaymentMethod
);


// DELETE
router.delete(
    "/delete/:paymentMethodId",
    verifyAccessToken,
    PaymentMethodController.deletePaymentMethod
);


// GET ACTIVE
router.get(
    "/get-active",
    verifyAccessToken,
    PaymentMethodController.getActivePaymentMethods
);


module.exports = router;