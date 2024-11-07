"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middleware/checkAuth");
const setBaseUrl_1 = require("../middleware/setBaseUrl");
const router = express_1.default.Router();
router.use(setBaseUrl_1.setBaseUrl);
router.get('/', (req, res) => {
    res.render('index', {
        user: req.user,
        baseUrl: req.baseUrl,
    });
});
router.get('/dashboard', checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.user,
    });
});
router.get('/admin', checkAuth_1.ensureAdminAuthenticated, (req, res) => {
    const sessions = req.sessionStore.sessions;
    const userSessions = Object.entries(sessions).map(([sessionId, sessionData]) => {
        var _a;
        const session = JSON.parse(sessionData);
        return {
            sessionId,
            userId: ((_a = session.passport) === null || _a === void 0 ? void 0 : _a.user) || null, // Ensure that if no user id is found, we explicitly set it to null
        };
    }).filter(session => { var _a; return session.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); }); // Exclude the admin session from the list of сurrent active sessions
    res.render('admin', {
        user: req.user,
        baseUrl: req.baseUrl,
        sessions: userSessions,
    });
});
exports.default = router;
