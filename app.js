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

// middlewares
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());

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
const routeTrackerMiddleware = require("./Middleware/routeTracker.middleware");
const socketMiddleware = require("./Middleware/socke.middlewar");
const validateToken = require('./Validate/validateToken')
const verifyAccessToken = require('./middleware/verifyAccessToken');
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




// health check
app.get("/health", (_, res) => res.send("OK"));

app.get("/api/validate-token",
    routeTrackerMiddleware("VALIDAE_ROUTE"),
    verifyAccessToken, validateToken);


server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
