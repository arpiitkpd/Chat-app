import express from  "express";
import protectRoute from "../middlerwares/protectRoute.js";

const router = new express.Router();

router.get('/',protectRoute, getUsersForSidebar)

export default router;