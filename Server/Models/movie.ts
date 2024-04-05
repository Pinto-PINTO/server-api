// File Name: movie.ts
// Student Name: Chesta Patel
// Student ID: 200542446
// Date: 17th August 2023

import { Collection, Schema, model } from "mongoose";

// Movie Interface - defines the structure of a movie
interface IMovie {
    movieID: string;
    title: string;
    studio: string;
    genres: string[];
    directors: string[];
    writers: string[];
    actors: string[];
    year: number;
    length: number;
    shortDescription: string;
    mpaRating: string;
    criticsRating: number;
    posterLink: string;
}

// Movie Schema - defines the structure of a movie using the Movie Interface
let movieSchema = new Schema<IMovie>({
    movieID: String,
    title: String,
    studio: String,
    genres: [String],
    directors: [String],
    writers: [String],
    actors: [String],
    year: Number,
    length: Number,
    shortDescription: String,
    mpaRating: String,
    criticsRating: Number,
    posterLink: String,
});

let Movie = model<IMovie>("Movie", movieSchema);

export default Movie;
