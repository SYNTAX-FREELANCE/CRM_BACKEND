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
app.use("/uploads", express.static("C:/uploads"));
app.use("/policy-documents", express.static("C:/CRM/PolicyDocuments"));
app.use("/lead-documents", express.static("C:/CRM/LeadDocuments"));

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
