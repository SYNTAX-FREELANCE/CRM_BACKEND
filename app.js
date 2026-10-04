require("dotenv").config({ quiet: true });

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const corsConfig = require("./config/cors");
const { initSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);

// Serve the C:\uploads folder at /uploads URL
// app.use("/uploads", express.static("C:/uploads"));
// app.use("/policy-documents", express.static("C:/CRM/PolicyDocuments"));
// app.use("/lead-documents", express.static("C:/CRM/LeadDocuments"));


const uploadsPath =
  process.env.UPLOADS_PATH || path.join(__dirname, "uploads");

const policyDocumentsPath =
  process.env.POLICY_DOCUMENTS_PATH ||
  path.join(__dirname, "PolicyDocuments");

const leadDocumentsPath =
  process.env.LEAD_DOCUMENTS_PATH ||
  path.join(__dirname, "LeadDocuments");

app.use("/uploads", express.static(uploadsPath));

app.use(
  "/policy-documents",
  express.static(policyDocumentsPath)
);

app.use(
  "/lead-documents",
  express.static(leadDocumentsPath)
);

// middlewares
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(
  express.json({
    limit: "100mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
  }),
);
// init socket
initSocket(server);

// routes
const userRoutes = require("./api/UserContorller/usercontroller.router");
const employeemaster = require("./api/EmployeeMaster/employeemaster.router");
const rolemaster = require("./api/RoleMaster/roleMaster.router");
const statusmaster = require("./api/StatusCreation/statusMaster.routes");
const leadmaster = require("./api/LeadMaster/leadMaster.router");
const vehicletypemaster = require("./api/VehicleTypeMaster/vehicleTypeMaster.router");
const insurancecompanymaster = require("./api/InsuranceCompany/insuranceCompany.router");
const companymaster = require("./api/CompanyMaster/companyMaster.routes");
const qualificationmaster = require("./api/QualificationMaster/qualification.router");
const modulemaster = require("./api/ModuleMaster/moduleMaster.router");
const submodulemaster = require("./api/SubmoduleMaster/submoduleMaster.router");
const menumaster = require("./api/MenuMaster/menuMaster.router");
const userRights = require("./api/UserRights/userRights.router");
const userInfo = require("./api/UserInfo/userInfo.router");
const customermaster = require("./api/CustomerMaster/customermaster.router");
const leaddetails = require("./api/LeadDetail/leads.router");
const usermoduelright = require("./api/UserModuleRights/roleModuleRights.router");
const reportsRouter = require("./api/reports/reports.router");
const targetmaster = require("./api/TargetMaster/employeeTarget.router");
const callOutcomeRoutes = require("./api/CallOutCome/callOutcome.routes");
const routeTrackerMiddleware = require("./middleware/routeTracker.middleware");
const outcomeStatusMappingRoutes = require("./api/CallOutComeMapMaster/outcomeStatusMapping.routes");
const leadCallRoutes = require("./api/LeadCallDetail/leadCall.router");
const notificationRoutes = require("./api/Notification/notification.router");
const socketMiddleware = require("./middleware/socke.middlewar");
const policySourceRoutes = require("./api/PolicySource/policySource.routes");
const employeelevlerouter = require("./api/EmployeeLevelMaster/employeeLevel.router");
const incentiveschemamaster = require("./api/IncentiveMaster/incentiveScheme.routes");
const incentiveslab = require("./api/IncentiveSlabMaster/incentiveSlab.routes");
const customerpaytype = require("./api/CustomerPayType/customerPayType.router");
const paymentMethodRouter = require("./api/PaymentMethod/paymentMethod.router");
const policyclaim = require("./api/policyClaim/policyClaim.routes");

// Motor calculator

const motorVehicleCategoryRoutes = require("./api/MotorCalculator/MotorVehicleCategoryMaster/motorvehiclecategory.router");
const motorVehicleClassRoutes = require("./api/MotorCalculator/MotorVehicleClass/motorVehicleClass.routes");
const motorFuelTypeRoutes = require("./api/MotorCalculator/MotorFuelType/motorFuelType.routes");

const motorVehicleUsageRoutes = require("./api/MotorCalculator/MotorVehicleUsage/motorVehicleUsage.routes");
const motorEngineCCSlabRoutes = require("./api/MotorCalculator/MotorEngineCcSlab/motorEngineCcSlab.routes");
const motorGVWSlabRoutes = require("./api/MotorCalculator/MotorGvwSlab/motorGvwSlab.routes");

const motorProductRoutes = require("./api/MotorCalculator/MotorProductMaster/motorProduct.routes");
const motorPolicyTypeRoutes = require("./api/MotorCalculator/MotorPlicyType/motorPolicyType.routes");
const motorBusinessTypeRoutes = require("./api/MotorCalculator/MotorBusinessType/motorBusinessType.routes");
const motorPolicyTermRoutes = require("./api/MotorCalculator/MotorPolicyTerm/motorPolicyTerm.routes");

const motorODRateRoutes = require("./api/MotorCalculator/MotorOdRate/motorOdRate.routes");
const motorODAgeSlabRoutes = require("./api/MotorCalculator/MotorOdAgeSlab/motorOdAgeSlab.routes");
const motorODDepreciationRoutes = require("./api/MotorCalculator/MotorOdDepreciation/motorOdDepreciation.routes");

const motorTPRateRoutes = require("./api/MotorCalculator/MotorTpRateMaster/motorTpRate.routes");
const motorTPRateSlabRoutes = require("./api/MotorCalculator/MotorTpRateSlab/motorTpRateSlab.routes");

const motorNCBRuleRoutes = require("./api/MotorCalculator/MotorNcbRuleMaster/motorNcbRule.routes");
const motorNCBClaimRuleRoutes = require("./api/MotorCalculator/MotorNcbClaimRules/motorNcbClaimRule.routes");

const motorDiscountRuleRoutes = require("./api/MotorCalculator/MotorDiscountRule/motorDiscountRule.routes");
const motorDiscountConditionRoutes = require("./api/MotorCalculator/MotorDiscountCondition/motorDiscountCondition.routes");

const motorZDRateRoutes = require("./api/MotorCalculator/MotorZdRate/motorZdRate.routes");

const motorAddonRoutes = require("./api/MotorCalculator/MotorAddOnMaster/motorAddon.routes");
const motorAddonRuleRoutes = require("./api/MotorCalculator/MotorAddOnRules/motorAddonRule.routes");
const motorAddonConditionRoutes = require("./api/MotorCalculator/MotorAddOnCondition/motorAddonCondition.routes");

const motorCoverRoutes = require("./api/MotorCalculator/MotorCoverMaster/motorCover.routes");
const motorCoverRateRoutes = require("./api/MotorCalculator/MotorCoverRate/motorCoverRate.routes");
const motorCoverUnitRateRoutes = require("./api/MotorCalculator/MotorCoverUnitRate/motorCoverUnitRate.routes");

const motorCommissionRuleRoutes = require("./api/MotorCalculator/MotorCommissionRule/motorCommissionRule.routes");
const motorCashbackRuleRoutes = require("./api/MotorCalculator/MotorCashBackRule/motorCashbackRule.routes");
const motorTaxRoutes = require("./api/MotorCalculator/MotorTax/motorTax.routes");

const motorQuotationRoutes = require("./api/MotorCalculator/MotorQuotation/motorQuotation.routes");
const motorQuotationInputRoutes = require("./api/MotorCalculator/MotorQuotationInput/motorQuotationInput.routes");
const motorQuotationOptionRoutes = require("./api/MotorCalculator/MotorQuotatinOption/motorQuotationOption.routes");
const motorQuotationOptionAddonRoutes = require("./api/MotorCalculator/MotorQuotationOptionAddon/motor_quotation_option_addon.routes");
const motorQuotationOptionCoverRoutes = require("./api/MotorCalculator/MotorQuotationOptionCover/motor_quotation_option_cover.routes");


const validateToken = require("./Validate/validateToken");
const verifyAccessToken = require("./middleware/verifyAccessToken");

// socket allowed only here
app.use(
  "/api/user",
  routeTrackerMiddleware("USER_LOGIN_ROUTER"),
  socketMiddleware,
  userRoutes,
);

app.use(
  "/api/employee",
  routeTrackerMiddleware("EMPLOYEE_REGISTER_ROUTER"),
  socketMiddleware,
  employeemaster,
);

app.use(
  "/api/rolemast",
  routeTrackerMiddleware("ROLE_MASTER_ROUTER"),
  socketMiddleware,
  rolemaster,
);

app.use(
  "/api/statusmast",
  routeTrackerMiddleware("STATUS_MASTER_ROUTER"),
  socketMiddleware,
  statusmaster,
);

app.use(
  "/api/leadmast",
  routeTrackerMiddleware("LEAD_MASTER_ROUTER"),
  socketMiddleware,
  leadmaster,
);

app.use(
  "/api/vehicletype",
  routeTrackerMiddleware("VEHICLE_TYPE_MASTER_ROUTER"),
  socketMiddleware,
  vehicletypemaster,
);

app.use(
  "/api/insurancecompany",
  routeTrackerMiddleware("INSURANCE_COMPANY_MASTER_ROUTER"),
  socketMiddleware,
  insurancecompanymaster,
);

app.use(
  "/api/companimast",
  routeTrackerMiddleware("COMPANY_MASTER_ROUTER"),
  socketMiddleware,
  companymaster,
);

app.use(
  "/api/qualimast",
  routeTrackerMiddleware("QUALIFICATION_MASTER_ROUTER"),
  socketMiddleware,
  qualificationmaster,
);

app.use(
  "/api/modulemast",
  routeTrackerMiddleware("MODULE_MASTER_ROUTER"),
  socketMiddleware,
  modulemaster,
);

app.use(
  "/api/submodulemast",
  routeTrackerMiddleware("SUBMODULE_MASTER_ROUTER"),
  socketMiddleware,
  submodulemaster,
);

app.use(
  "/api/menumaster",
  routeTrackerMiddleware("MENU_MASTER_ROUTER"),
  socketMiddleware,
  menumaster,
);

app.use(
  "/api/userrights",
  routeTrackerMiddleware("USER_RIGHT_MASTER_ROUTER"),
  socketMiddleware,
  userRights,
);

app.use(
  "/api/userinfo",
  routeTrackerMiddleware("USER_INFO_ROUTER"),
  socketMiddleware,
  userInfo,
);
app.use(
  "/api/customer",
  routeTrackerMiddleware("CUSTOMER_MASTER_ROUTER"),
  socketMiddleware,
  customermaster,
);

app.use(
  "/api/lead",
  routeTrackerMiddleware("LEAD_DETAIL_ROUTER"),
  socketMiddleware,
  leaddetails,
);

app.use(
  "/api/moduleright",
  routeTrackerMiddleware("MODULE_RIGHT_DETAIL_ROUTER"),
  socketMiddleware,
  usermoduelright,
);

app.use(
  "/api/reports",
  routeTrackerMiddleware("REPORTS_ROUTER"),
  socketMiddleware,
  reportsRouter,
);

app.use(
  "/api/target",
  routeTrackerMiddleware("EMPLOYEE_TARGET_ROUTER"),
  socketMiddleware,
  targetmaster,
);

app.use(
  "/api/calloutcome",
  routeTrackerMiddleware("CALL_OUTCOME_ROUTER"),
  socketMiddleware,
  callOutcomeRoutes,
);

app.use(
  "/api/outcomestatusmapping",
  routeTrackerMiddleware("CALL_OUTCOME_MASTER_ROUTER"),
  socketMiddleware,
  outcomeStatusMappingRoutes,
);

app.use(
  "/api/lead-call-logs",
  routeTrackerMiddleware("CALL_MOBILE_DETAILS_ROUTER"),
  socketMiddleware,
  leadCallRoutes,
);

app.use(
  "/api/notifications",
  routeTrackerMiddleware("CRM_NOTIFICATION_ROUTER"),
  socketMiddleware,
  notificationRoutes,
);

app.use(
  "/api/policysource",
  routeTrackerMiddleware("POLICY_SOURCE_ROUTER"),
  socketMiddleware,
  policySourceRoutes,
);

app.use(
  "/api/employeelevel",
  routeTrackerMiddleware("EMPLOYEE_LEVEL_ROUTER"),
  socketMiddleware,
  employeelevlerouter,
);

app.use(
  "/api/incentivescheme",
  routeTrackerMiddleware("INCENTIVE_MASTER_ROUTER"),
  socketMiddleware,
  incentiveschemamaster,
);

app.use(
  "/api/incentiveslab",
  routeTrackerMiddleware("INCENTIVESLAB_MASTER_ROUTER"),
  socketMiddleware,
  incentiveslab,
);

app.use(
  "/api/customerpaytype",
  routeTrackerMiddleware("CUSTOMER_PAYTYPE_MASTER_ROUTER"),
  socketMiddleware,
  customerpaytype,
);

app.use(
  "/api/paymentmethod",
  routeTrackerMiddleware("PAYMENT_METHOD_MASTER_ROUTER"),
  socketMiddleware,
  paymentMethodRouter,
);

app.use(
  "/api/policyclaim",
  routeTrackerMiddleware("POLICY_CLAIM_DETAIL_ROUTER"),
  socketMiddleware,
  policyclaim,
);



// MOTOR CALCULATOR

app.use(
  "/api/motor/vehicle-category",
  routeTrackerMiddleware("MOTOR_VEHICLE_CATEGORY_ROUTER"),
  socketMiddleware,
  motorVehicleCategoryRoutes,
);

app.use(
  "/api/motor/vehicle-class",
  routeTrackerMiddleware("MOTOR_VEHICLE_CLASS_ROUTER"),
  socketMiddleware,
  motorVehicleClassRoutes,
);

app.use(
  "/api/motor/fuel-type",
  routeTrackerMiddleware("MOTOR_FUEL_TYPE_ROUTER"),
  socketMiddleware,
  motorFuelTypeRoutes,
);

app.use(
  "/api/motor/vehicle-usage",
  routeTrackerMiddleware("MOTOR_VEHICLE_USAGE_ROUTER"),
  socketMiddleware,
  motorVehicleUsageRoutes,
);

app.use(
  "/api/motor/engine-cc-slab",
  routeTrackerMiddleware("MOTOR_ENGINE_CC_SLAB_ROUTER"),
  socketMiddleware,
  motorEngineCCSlabRoutes,
);

app.use(
  "/api/motor/gvw-slab",
  routeTrackerMiddleware("MOTOR_GVW_SLAB_ROUTER"),
  socketMiddleware,
  motorGVWSlabRoutes,
);

app.use(
  "/api/motor/product",
  routeTrackerMiddleware("MOTOR_PRODUCT_ROUTER"),
  socketMiddleware,
  motorProductRoutes,
);

app.use(
  "/api/motor/policy-type",
  routeTrackerMiddleware("MOTOR_POLICY_TYPE_ROUTER"),
  socketMiddleware,
  motorPolicyTypeRoutes,
);

app.use(
  "/api/motor/business-type",
  routeTrackerMiddleware("MOTOR_BUSINESS_TYPE_ROUTER"),
  socketMiddleware,
  motorBusinessTypeRoutes,
);

app.use(
  "/api/motor/policy-term",
  routeTrackerMiddleware("MOTOR_POLICY_TERM_ROUTER"),
  socketMiddleware,
  motorPolicyTermRoutes,
);

app.use(
  "/api/motor/od-rate",
  routeTrackerMiddleware("MOTOR_OD_RATE_ROUTER"),
  socketMiddleware,
  motorODRateRoutes,
);

app.use(
  "/api/motor/od-age-slab",
  routeTrackerMiddleware("MOTOR_OD_AGE_SLAB_ROUTER"),
  socketMiddleware,
  motorODAgeSlabRoutes,
);

app.use(
  "/api/motor/od-depreciation",
  routeTrackerMiddleware("MOTOR_OD_DEPRECIATION_ROUTER"),
  socketMiddleware,
  motorODDepreciationRoutes,
);

app.use(
  "/api/motor/tp-rate",
  routeTrackerMiddleware("MOTOR_TP_RATE_ROUTER"),
  socketMiddleware,
  motorTPRateRoutes,
);

app.use(
  "/api/motor/tp-rate-slab",
  routeTrackerMiddleware("MOTOR_TP_RATE_SLAB_ROUTER"),
  socketMiddleware,
  motorTPRateSlabRoutes,
);

app.use(
  "/api/motor/ncb-rule",
  routeTrackerMiddleware("MOTOR_NCB_RULE_ROUTER"),
  socketMiddleware,
  motorNCBRuleRoutes,
);

app.use(
  "/api/motor/ncb-claim-rule",
  routeTrackerMiddleware("MOTOR_NCB_CLAIM_RULE_ROUTER"),
  socketMiddleware,
  motorNCBClaimRuleRoutes,
);

app.use(
  "/api/motor/discount-rule",
  routeTrackerMiddleware("MOTOR_DISCOUNT_RULE_ROUTER"),
  socketMiddleware,
  motorDiscountRuleRoutes,
);

app.use(
  "/api/motor/discount-condition",
  routeTrackerMiddleware("MOTOR_DISCOUNT_CONDITION_ROUTER"),
  socketMiddleware,
  motorDiscountConditionRoutes,
);

app.use(
  "/api/motor/zd-rate",
  routeTrackerMiddleware("MOTOR_ZD_RATE_ROUTER"),
  socketMiddleware,
  motorZDRateRoutes,
);

app.use(
  "/api/motor/addon",
  routeTrackerMiddleware("MOTOR_ADDON_ROUTER"),
  socketMiddleware,
  motorAddonRoutes,
);

app.use(
  "/api/motor/addon-rule",
  routeTrackerMiddleware("MOTOR_ADDON_RULE_ROUTER"),
  socketMiddleware,
  motorAddonRuleRoutes,
);

app.use(
  "/api/motor/addon-condition",
  routeTrackerMiddleware("MOTOR_ADDON_CONDITION_ROUTER"),
  socketMiddleware,
  motorAddonConditionRoutes,
);

app.use(
  "/api/motor/cover",
  routeTrackerMiddleware("MOTOR_COVER_ROUTER"),
  socketMiddleware,
  motorCoverRoutes,
);

app.use(
  "/api/motor/cover-rate",
  routeTrackerMiddleware("MOTOR_COVER_RATE_ROUTER"),
  socketMiddleware,
  motorCoverRateRoutes,
);

app.use(
  "/api/motor/cover-unit-rate",
  routeTrackerMiddleware("MOTOR_COVER_UNIT_RATE_ROUTER"),
  socketMiddleware,
  motorCoverUnitRateRoutes,
);

app.use(
  "/api/motor/commission-rule",
  routeTrackerMiddleware("MOTOR_COMMISSION_RULE_ROUTER"),
  socketMiddleware,
  motorCommissionRuleRoutes,
);

app.use(
  "/api/motor/cashback-rule",
  routeTrackerMiddleware("MOTOR_CASHBACK_RULE_ROUTER"),
  socketMiddleware,
  motorCashbackRuleRoutes,
);

app.use(
  "/api/motor/tax",
  routeTrackerMiddleware("MOTOR_TAX_ROUTER"),
  socketMiddleware,
  motorTaxRoutes,
);

app.use(
  "/api/motor/quotation",
  routeTrackerMiddleware("MOTOR_QUOTATION_ROUTER"),
  socketMiddleware,
  motorQuotationRoutes,
);

app.use(
  "/api/motor/quotation-input",
  routeTrackerMiddleware("MOTOR_QUOTATION_INPUT_ROUTER"),
  socketMiddleware,
  motorQuotationInputRoutes,
);

app.use(
  "/api/motor/quotation-option",
  routeTrackerMiddleware("MOTOR_QUOTATION_OPTION_ROUTER"),
  socketMiddleware,
  motorQuotationOptionRoutes,
);

app.use(
  "/api/motor/quotation-option-addon",
  routeTrackerMiddleware("MOTOR_QUOTATION_OPTION_ADDON_ROUTER"),
  socketMiddleware,
  motorQuotationOptionAddonRoutes,
);

app.use(
  "/api/motor/quotation-option-cover",
  routeTrackerMiddleware("MOTOR_QUOTATION_OPTION_COVER_ROUTER"),
  socketMiddleware,
  motorQuotationOptionCoverRoutes,
);


const fileuploadRouter = express.Router();

const employeemasterController = require("./api/EmployeeMaster/employeemaster.controller");

fileuploadRouter.get(
  "/getMedicalDocFile",
  verifyAccessToken,
  employeemasterController.getMedicalDocFile,
);

app.use("/api/fileupload", fileuploadRouter);

// health check
app.get("/health", (_, res) => res.send("OK"));

app.get(
  "/api/validate-token",
  routeTrackerMiddleware("VALIDAE_ROUTE"),
  verifyAccessToken,
  validateToken,
);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
