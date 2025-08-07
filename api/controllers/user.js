import { HttpStatus } from "../config/httpStatus.js"
import { prisma } from "../database/db.js"
import { UserError } from "../error/user.js"
import {errorHandler} from "../utils/common/errorHandler.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendMail from "../utils/common/mailSender.js"

//! sign-up 
export const signUp = async (req, res, next)=>{

    const {name, email} = req.body
    try {
    if(!name || !email) return next(errorHandler(UserError.Fields_Required))
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return next(errorHandler(UserError.Email_Format))

        const existingUser = await prisma.user.findFirst({
            where : {email}
        })            
        if(existingUser) return next(errorHandler(UserError.User_Already_Exist))

        const user = await prisma.user.create({
            data : {
                name,
                email
            }
        })

        const token = jwt.sign(
            {id : user.id},
            process.env.JWT_SECRET,
            {expiresIn : '30m'}
        )
        
        const setupLink = `http://localhost:3000/auth/set-password?token=${token}`;

        await sendMail(
            user.email,
            "Set Your Password",
            `Click this link to set your password : ${setupLink}`
        )

        res.status(HttpStatus.CREATED).json("Link is sent to your email address, go through that link to set your password!!")
    } catch (error) {
        console.log("sign up m h error", error)        
        next(error)
    }

}

//! create-tenant schema
export const createTenantSchema = async (req, res, next) =>{
    const {email} = req.body
    try {
        if(!email) return next(errorHandler(UserError.Email_Required))

         const user = await prisma.user.findUnique({
            where : {email}
         })   

         if(!user) return next(errorHandler(UserError.Email_Not_Registered))

         const existingTenant = await prisma.tenant.findUnique({
            where : {user_id : user.id}
         })   

         if(existingTenant) return next(errorHandler(UserError.Tenant_Already_Exist))


         //! creating the tenant record
         const tenantSchema = `tenant_${user.id}`

        await prisma.tenant.create({
            data : {
                schema_name : tenantSchema,
                user_id : user.id
            }
        })


        //! creating seperate tenant schema

        await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${tenantSchema}";`)

        const baseTable = ["users", "modules", "leads", "contacts", "accounts", "deals"]

        //! create these 6 basic tables
        for(const table of baseTable){
            await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "${tenantSchema}"."${table}"(
                id SERIAL PRIMARY KEY
                )`
            )
        }   

        res.status(HttpStatus.CREATED).json({message : `Tenant schema created for user with email ${email}`})

    } catch (error) {
        console.log("create tenant schema m h error", error)
        next(error)
    }
}

//! set Password
export const setPassword = async (req, res, next)=>{
    const {password} = req.body
    try {
        if(!password) return next(errorHandler(UserError.Fields_Required))
            if(password.length < 8) return next(errorHandler(UserError.Password_Length))

            const hashedPassword = await bcrypt.hash(password, 10)

            await prisma.user.update({
                where : {id : req.user.id},
                data : {
                    password : hashedPassword
                }
            })

            res.status(HttpStatus.CREATED).json("Password set successfully!!")

    } catch (error) {
        console.log("set Password m h error", error)
        next(error)
    }
}

//! login 
export const login = async (req, res, next)=>{
    const {email, password} = req.body
    try {
        if(!email || !password) return next(errorHandler(UserError.Fields_Required))
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return next(errorHandler(UserError.Email_Format))

        const existingUser = await prisma.user.findUnique({
            where : {email}
        })        

        if(!existingUser) return next(errorHandler(UserError.Email_Not_Registered))

           if(!existingUser.isActive) return next(errorHandler(UserError.InActive_Account)) 

         const checkPassword = await bcrypt.compare(password, existingUser.password)   
         if(!checkPassword) return next(errorHandler(UserError.Invalid_Password))

            const token = jwt.sign(
                {id : existingUser.id},
                process.env.JWT_SECRET
            )

            res.cookie("token" , token , {httpOnly : true})

            const {password : pass, ...rest} = existingUser

            res.status(HttpStatus.OK).json({user : rest,  token:token})


    } catch (error) {
        console.log("login m h error", error)        
        next(error)
    }
}

//! forgot password
export const forgotPassword = async (req, res, next)=>{
    const {email} = req.body
    try {
        if(!email) return next(errorHandler(UserError.Email_Required))
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return next(errorHandler(UserError.Email_Format))

          const user = await prisma.user.findUnique({
            where : {email}
          })  

          if(!user) return next(UserError.Email_Not_Registered)

            const token = jwt.sign(
                {id : user.id},
                process.env.JWT_SECRET,
                {expiresIn : '10m'}
            )

            const forgotLink = `https://frontend/reset-password?token:${token}`;

            await sendMail(
                email,
                "Reset your Password",
                `Click this link to reset your password : ${forgotLink}`
            )

            res.status(HttpStatus.OK).json("Link is sent to your email address, go through that link to reset your password!!")

    } catch (error) {
        console.log("forgot password m h error", error)
        next(error)
    }
}
