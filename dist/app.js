"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const passportMiddleware_1 = __importDefault(require("./middleware/passportMiddleware"));
const express_flash_1 = __importDefault(require("express-flash"));
const port = process.env.port || 8000;
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set('views', path_1.default.join(__dirname, 'views'));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use((0, express_flash_1.default)());
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
// Middleware for express
app.use(express_1.default.json());
app.use(express_ejs_layouts_1.default);
app.use(express_1.default.urlencoded({ extended: true }));
(0, passportMiddleware_1.default)(app);
app.use((req, res, next) => {
    console.log(`User details are: `);
    console.log(req.user);
    console.log("Entire session object:");
    console.log(req.session);
    console.log(`Session details are: `);
    console.log(req.session.passport);
    next();
});
app.use("/", indexRoute_1.default);
app.use("/auth", authRoute_1.default);
app.use("/admin", adminRoute_1.default);
app.listen(port, () => {
    console.log(`🚀 Server has started on http://localhost:${port}`);
});
