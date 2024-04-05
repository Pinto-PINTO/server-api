// File Name: app.ts
// Student Name: Chesta Patel
// Student ID: 200542446
// Date: 17th August 2023

// modules for express server
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

// modules for authentication
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local";

// authentication objects
let localStrategy = passportLocal.Strategy; // alias
import User from "../Models/user";

// modules for jwt support
import cors from "cors";
import passportJWT from "passport-jwt";

// define JWT aliases
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// Database modules
import mongoose from "mongoose";
import db from "./db";

mongoose.connect(db.remoteURI);

// DB Connection Events
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB`);
});

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

import indexRouter from "../Routes/index";

let app = express();

// middleware modules
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup express session
app.use(
    session({
        secret: db.secret,
        saveUninitialized: false,
        resave: false,
    })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// implement an Auth Strategy
passport.use(User.createStrategy());
// serialize and deserialize user data
passport.serializeUser(User.serializeUser() as any);
passport.deserializeUser(User.deserializeUser());

// setup JWT Options
let jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: db.secret,
};

// setup JWT Strategy
let strategy = new JWTStrategy(jwtOptions, function (jwt_payload, done) {
    try {
        const user = User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

passport.use(strategy);

app.use("/api/", indexRouter);

export default app;
