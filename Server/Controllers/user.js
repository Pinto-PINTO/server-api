"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessLogout = exports.ProcessLogin = exports.ProcessRegisterPage = void 0;
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../Models/user"));
const index_1 = require("../Util/index");
function ProcessRegisterPage(req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        emailAddress: req.body.EmailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName,
    });
    user_1.default.register(newUser, req.body.password, (err) => {
        if (err) {
            console.error("Error: Inserting New User");
            if (err.name == "UserExistsError") {
                console.error("Error: User Already Exists");
            }
            return res.json({
                success: false,
                msg: "User not Registered Successfully!",
            });
        }
        return passport_1.default.authenticate("local")(req, res, () => {
            return res.json({
                success: true,
                msg: "User Logged in Successfully!",
                user: newUser,
            });
        });
    });
}
exports.ProcessRegisterPage = ProcessRegisterPage;
function ProcessLogin(req, res, next) {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            return res.json({
                success: false,
                msg: "User Not Logged in Successfully!",
                user: user,
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            const authToken = (0, index_1.GenerateToken)(user);
            return res.json({
                success: true,
                msg: "User Logged In Successfully!",
                user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    emailAddress: user.emailAddress,
                },
                token: authToken,
            });
        });
    })(req, res, next);
}
exports.ProcessLogin = ProcessLogin;
function ProcessLogout(req, res, next) {
    req.logout(() => {
        console.log("User Logged Out");
        res.json({ success: true, msg: "User Logged out Successfully!" });
    });
}
exports.ProcessLogout = ProcessLogout;
//# sourceMappingURL=user.js.map