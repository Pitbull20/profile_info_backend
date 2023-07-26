import { config as dotenvConfig } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

dotenvConfig();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.post("/auth/login", UserController.login);

app.post("/auth/register", registerValidation, UserController.register);

app.post("/profile/add-photo", checkAuth, UserController.addPhoto);

app.get("/profile/get-profile-info", checkAuth, UserController.getProfileInfo);

mongoose
    .connect(process.env.MongoDbAuthUrl)
    .then(() => {
        console.log("DB connection ---------------> OK");
    })
    .catch((e) => {
        console.log(e);
    });

try {
    app.listen(PORT, () => {
        console.log(`Server was started on http://localhost:${PORT}`);
    });
} catch (e) {
    console.log(e);
}
