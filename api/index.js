import "dotenv/config"
import app from "./app.js"
import connectDB from "./database/db.js"

const port = process.env.PORT || 5000

connectDB()

app.listen(port ,()=>{
    console.log(`server is running at port ${port}`)
})
