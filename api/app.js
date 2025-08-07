import express from "express"
import cors from "cors"
import route from "./routes/index.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.use("/api/V1", route)


//! for errors
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        success : false,
        message,
        statusCode
    })
})

export default app
