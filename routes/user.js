import express from "express";
import { getAllUsers, getSingleUser, loginUser, logoutUser, refreshToken, registerUser, updateUser } from "../controller/user.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

//User routes//
router.post("/createUser", registerUser);
router.post("/loginuser", loginUser);
router.put("/updateUserById/:id",protect, updateUser);
router.post('/logout', logoutUser);
router.get('/getuserById/:id', protect, getSingleUser); 
router.get('/getallUsers', protect, getAllUsers);
router.post('/refresh-token', refreshToken);

 


export default router;
