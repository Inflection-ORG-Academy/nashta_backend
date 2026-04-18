import express from 'express'
const PORT = 5000
const app = express()
app.use(express.json())

app.post("/signup", (req, res) => {
  console.log(req.body)
  res.json({ greet: "hello" })
})

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
})