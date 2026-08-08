// routes/callOutcome.routes.js

const express = require("express");
const router = express.Router();
const callOutcomeController = require("./callOutcome.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");
// ==================== CALL OUTCOME MASTER ROUTES ====================
// Create Call Outcome

router.post(
    "/create",
    verifyAccessToken,
    callOutcomeController.createCallOutcome
);


// Get all Call Outcomes

router.get(
    "/getall",
    verifyAccessToken,
    callOutcomeController.getAllCallOutcomes
);


// Get Call Outcome by ID

router.get(
    "/getbyid/:outcomeId",
    verifyAccessToken,
    callOutcomeController.getCallOutcomeById
);


// Update Call Outcome

router.patch(
    "/update/:outcomeId",
    verifyAccessToken,
    callOutcomeController.updateCallOutcome
);


module.exports = router;