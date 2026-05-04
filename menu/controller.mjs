import { prisma } from "../prisma/prisma_client.mjs"

const createMenu = async (req, res) => {
  res.json({ key: "create menu" })
}
const getMenus = async (req, res) => {
  res.json({ key: "get menus" })
}
const updateMenu = async (req, res) => {
  res.json({ key: "update menu" })
}
const deleteMenu = async (req, res) => {
  res.json({ key: "delete menu" })
}

export { createMenu, getMenus, updateMenu, deleteMenu }