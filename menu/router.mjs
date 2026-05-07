import { Router } from 'express'
const menuRouter = Router()
import { createMenu, getMenus, updateMenu, deleteMenu } from './controller.mjs'

const authentication = (req, res, next) => {
  console.log("check auth here")
  next()
}

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