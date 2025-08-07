import { HttpStatus } from "../config/httpStatus.js";
import { prisma } from "../database/db.js";
import { errorHandler } from "../utils/common/errorHandler.js";
import jwt from "jsonwebtoken"

export const authentication = async (req, res, next)=>{
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if(!token) return next(errorHandler({
        message : "Invalid_Request",
        status : HttpStatus.UNAUTHORIZED
    }))

    try {
        const verify = jwt.verify(token , process.env.JWT_SECRET)
        const user = await prisma.user.findFirst({
            where : {
                id : verify.id
            }
        })

        req.user = user
        return next()

    } catch (error) {
        console.log("authentication m h error", error)
        next(error)
    }
}