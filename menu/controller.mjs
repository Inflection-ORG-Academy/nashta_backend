import { prisma } from "../prisma/prisma_client.mjs"

const createMenu = async (req, res) => {
  console.log(req.body)
  console.log(req.test)
  const menu = await prisma.menu.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      price_half: req.body.price_half,
      price_full: req.body.price_full,
      created_by: req.user.id
    }
  })
  res.json(menu)
}

const getMenus = async (req, res) => {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  if (isNaN(page) || isNaN(limit)) {
    res.status(400).json({
      error: "pagination not ok"
    })
  }
  const menus = await prisma.menu.findMany({
    skip: (page - 1) * limit,
    take: limit,
  })
  res.json(menus)
}

const updateMenu = async (req, res) => {
  res.json({ key: "update menu" })
}

const deleteMenu = async (req, res) => {
  res.json({ key: "delete menu" })
}

export { createMenu, getMenus, updateMenu, deleteMenu }