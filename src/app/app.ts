import express from "express";
import authRouter from "./module/auth/routes.js"
const createApplication = () => {
    const app = express();
    app.use(express.json());

    app.get("/", (_, res) => {
        res.send("Server is running")
    })
    app.use("/api/auth", authRouter);
    return app;
}

export default createApplication;