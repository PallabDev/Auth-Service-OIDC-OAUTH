import express from "express";
const createApplication = () => {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Server is running")

    })
    return app;
}

export default createApplication;