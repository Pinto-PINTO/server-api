// File Name: index.ts
// Student Name: Chesta Patel
// Student ID: 200542446
// Date: 17th August 2023

import express from "express";
let router = express.Router();
import passport from "passport";

/* Get the movie controller functions */
import { DisplayMovieList, DisplayMovieByID, AddMovie, UpdateMovie, DeleteMovie } from "../Controllers/movie";

/* Get the auth controller functions */
import { ProcessLogin, ProcessLogout, ProcessRegisterPage } from "../Controllers/user";

/* GET /api/list - display the movie list */
router.get("/list", passport.authenticate("jwt", { session: false }), (req, res, next) =>
    DisplayMovieList(req, res, next)
);

/* GET /api/find/:id - display a movie by id */
router.get("/find/:id", passport.authenticate("jwt", { session: false }), (req, res, next) =>
    DisplayMovieByID(req, res, next)
);

/* POST /api/add - add a new movie */
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res, next) => AddMovie(req, res, next));

/* PUT /api/update/:id - update a movie by id */
router.put("/update/:id", passport.authenticate("jwt", { session: false }), (req, res, next) =>
    UpdateMovie(req, res, next)
);

/* GET /api/delete/:id - delete a movie by id */
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res, next) =>
    DeleteMovie(req, res, next)
);

/* POST /api/register - add a new user */
router.post("/register", (req, res, next) => ProcessRegisterPage(req, res, next));

/* POST /api/login - login a user */
router.post("/login", (req, res, next) => ProcessLogin(req, res, next));

/* GET /api/logout - logout a user */
router.get("/logout", (req, res, next) => ProcessLogout(req, res, next));

export default router;
