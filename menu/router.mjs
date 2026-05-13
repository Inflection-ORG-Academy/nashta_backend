import { Router } from 'express'
import jwt from 'jsonwebtoken'
const menuRouter = Router()
import { createMenu, getMenus, updateMenu, deleteMenu } from './controller.mjs'
import { authentication } from '../middleware/authentication.mjs'

// menuRouter.post("/", authentication, createMenu)
//   .get("/", getMenus)
//   .patch("/", authentication, updateMenu)
//   .delete("/", authentication, deleteMenu)

menuRouter.get("/", getMenus)

menuRouter.use(authentication)
menuRouter.post("/", createMenu)
  .patch("/", updateMenu)
  .delete("/", deleteMenu)

export { menuRouter }