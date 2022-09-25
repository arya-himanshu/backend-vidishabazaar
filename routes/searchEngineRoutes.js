import express from "express";
const searchEngineRoutes = express.Router();
import { auth } from "../middleware/auth.js";
import * as searchEngineTag   from '../controllers/searchEngineTagController.js' 

searchEngineRoutes.route("/global").post(searchEngineTag.searchEngineTag);
searchEngineRoutes.route("/search").post(searchEngineTag.searchCategoryWithTags);

export { searchEngineRoutes };
