import express from "express";
import * as CdController from "../controllers/CdController";

const router = express.Router();

router.get("/", CdController.getAllCds);

router.post("/add", CdController.addCd);

router.get("/details/:id", CdController.getCdById);

export default router;
