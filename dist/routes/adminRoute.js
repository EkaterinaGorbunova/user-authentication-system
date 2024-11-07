"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Route to destroy a session by session id
router.get('/sessions/:sessionId/destroy', (req, res) => {
    const sessionId = req.params.sessionId;
    req.sessionStore.destroy(sessionId, (err) => {
        if (err)
            console.log(err);
        res.redirect('/admin');
    });
});
exports.default = router;
