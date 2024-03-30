import {Router} from "express"

const router = new Router();

router.get("/login", (req, res)=>{
    res.send("Login route")

})

export default router;