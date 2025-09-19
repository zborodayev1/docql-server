import express from "express";
import * as controller from "../controllers/document.controller.js";

const router = express.Router();

router.post("/html", controller.getDocumentHtml);

router.post("/pdf", controller.getDocumentPdf);

router.get("/restore/:id", controller.restoreDocument);

router.post("/", controller.test);

export default router;
