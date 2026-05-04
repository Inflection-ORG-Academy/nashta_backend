import { Router } from 'express'
const menuRouter = Router()
import { createMenu, getMenus, updateMenu, deleteMenu } from './controller.mjs'

menuRouter.post("/", createMenu)
  .get("/", getMenus)
  .patch("/", updateMenu)
  .delete("/", deleteMenu)

export { menuRouter }