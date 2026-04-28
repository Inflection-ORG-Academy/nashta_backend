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
      otp: strOTP,
      otpGeneratedAt: new Date(Date.now())
    }
  })

  // 4. send email
  await sendOTP(user.email, strOTP)

  // // 5. send success in response
  res.json({ message: "check your email" })
})

app.patch("/reset_password", async (req, res) => {
  // 1. find user from email
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    },
  })
  if (!user) {
    res.status(404).json({ error: "user not found" })
    return
  }
  // 2. match otp
  if (req.body.otp !== user.otp) {
    res.status(401).json({ error: "invalid otp" })
    return
  }
  // 3. check for otp expiry
  const otpValidityMin = 50 // minute
  if (Date.now() - user.otpGeneratedAt.getTime() > otpValidityMin * 60 * 1000) {
    res.status(401).json({ error: "otp expired" })
    return
  }

  // 4. hash new password

  const hashedPass = await bcrypt.hash(req.body.new_password, 10)
  // 5. update hashed password in DB
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      otp: null,
      password: hashedPass
    }
  })

  // send response to user
  res.json({ message: "password reset successful" })
})

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
})