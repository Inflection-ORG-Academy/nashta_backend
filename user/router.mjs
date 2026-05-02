import express from 'express'
const userRouter = express.Router()
import { signup, login, frogetPassword, resetPassword }
  from "./controller.mjs"

userRouter.post("/signup", signup)
  .post("/login", login)
  .patch("/forget_password", frogetPassword)
  .patch("/reset_password", resetPassword)

export { userRouter }