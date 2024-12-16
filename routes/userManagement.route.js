import express from "express"

const router = express.Router()
import { updateUser, viewUsers, deleteUser, inviteMembers, signupLink, users } from "../controllers/userManagement.controller.js"

/**
 * @param {Get - User}
*/

router.get("/members/:id", viewUsers)

/**
 * @param {Update - User}
 */
/**
 * @param {Get - Users}
 */

router.get("/all-user", users)
router.put("/update/:id", updateUser)

/**
 * @param {Delete - User}
 */
router.delete("/delete/:id", deleteUser)

/**
 * @param {Invite Members}
 */

router.post("/invite-members/:id",inviteMembers )
 /** ----- tobe done ------------ */

 /**
  * @param {Signup - invites}
  */
 router.post("/signup-invites/:id", signupLink)
 export default router
