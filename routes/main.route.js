import express from "express"
import {Login, googleLogin, Signup, authGoogleOTP, verifyOTP} from "../controllers/main.controller.js"

// import {} from "../controllers"

const router = express.Router()


/**
 * @Login page
 */

router.post("/login", Login)


router.post("/verify-otp", verifyOTP);
/**
 * @Singup
 */

router.post("/signup", Signup)

/**
 * @googleLogin
 */

router.post("/google-login", googleLogin)

/**
 * @param {authGoogleOTP}
 */

router.post("/google-auth",authGoogleOTP)

export default router