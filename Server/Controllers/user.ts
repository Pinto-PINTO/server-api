// File Name: user.ts
// Student Name: Chesta Patel
// Student ID: 200542446
// Date: 17th August 2023

import { Request, Response, NextFunction } from "express";
import passport from "passport";

import User from "../Models/user";

import { GenerateToken } from "../Util/index";

/**
 * Function to handle registration
 */
export function ProcessRegisterPage(req: Request, res: Response, next: NextFunction): void {
    // instantiate a new user object
    let newUser = new User({
        username: req.body.username,
        emailAddress: req.body.EmailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName,
    });

    // Using Passport local mongoose to register the user
    User.register(newUser, req.body.password, (err) => {
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

        // automatically login the user
        return passport.authenticate("local")(req, res, () => {
            return res.json({
                success: true,
                msg: "User Logged in Successfully!",
                user: newUser,
            });
        });
    });
}

/**
 * Function to handle login
 */
export function ProcessLogin(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate("local", (err: any, user: any, info: any) => {
        // are there server errors?
        if (err) {
            console.error(err);
            return next(err);
        }
        // are the login errors?
        if (!user) {
            return res.json({
                success: false,
                msg: "User Not Logged in Successfully!",
                user: user,
            });
        }
        req.logIn(user, (err) => {
            // are there DB errors?
            if (err) {
                console.error(err);
                return next(err);
            }
            const authToken = GenerateToken(user);

            // return response
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

/**
 * Function to handle logout
 */
export function ProcessLogout(req: Request, res: Response, next: NextFunction): void {
    // Using logout function provided by passport js to logout
    req.logout(() => {
        // When logout is successful
        console.log("User Logged Out");
        // return response
        res.json({ success: true, msg: "User Logged out Successfully!" });
    });
}
