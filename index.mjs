import "dotenv/config";
import express from 'express'
import { userRouter } from "./user/router.mjs";
import { menuRouter } from "./menu/router.mjs";
const PORT = 5000
const app = express()

app.use(express.json())

app.use("/users", userRouter)
app.use("/menus", menuRouter)

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
})