import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import cdRoutes from "./routes/CdRoute";

const app = express();
const port = 1236;

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/cds", cdRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Not found"));
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
