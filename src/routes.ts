import {Router} from "express";
import {Login, Validate} from "./controllers/firebase-auth.controller";   

export const routes = (router: Router) => {
    router.post("/api/admin/login", Login);
    router.post("/validate/token", Validate);
}

