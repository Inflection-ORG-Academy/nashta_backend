import "dotenv/config";
import express from 'express'
import { prisma } from "./prisma/prisma_client.mjs"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendOTP } from "./resend.mjs"
const PORT = 5000
const app = express()
app.use(express.json())

app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      address: req.body.address
    }
  })
  res.json(user)
})

app.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })
  if (!user) {
    res.status(404).json({
      "error": "user not found"
    })
    return
  }
  const isMatched = await bcrypt.compare(req.body.password, user.password)
  if (!isMatched) {
    res.status(401).json({
      "error": "password not matched"
    })
    return
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET
  );
  res.json({
    message: `login successful, welcome ${user.name}`,
    token: token
  })
})

app.patch("/forget_password", async (req, res) => {
  // 1. find user in DB via email
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    },
  })
  if (!user) {
    res.status(404).json({
      error: "user not found"
    })
    return
  }

  // 2. generate OTP 100-000 , 999-999
  const opt = Math.floor(Math.random() * 899999 + 100000)
  const strOTP = `${opt}`

  // // 3.0 Create OTP Column in DB (One time)
  // // 3.1 save OTP in DB
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      otp: strOTP
    }
  })


  // 4. send email
  await sendOTP(user.email, strOTP)

  // // 5. send success in response
  res.json({ message: "check your email" })
})

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
})