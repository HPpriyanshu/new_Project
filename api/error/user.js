import { HttpStatus } from "../config/httpStatus.js";

export const UserError = {
        Fields_Required : {
        message : "All_Fields_Are_Required",
        status : HttpStatus.NOT_FOUND
    },

    Password_Length : {
        message : "Password_Length_Must_Be_Atleast_8_Digit",
        status : HttpStatus.BAD_REQUEST
    },

    Email_Format : {
        message : "Invalid_Email_Format",
        status : HttpStatus.BAD_REQUEST
    },

    Email_Required : {
        message : "Email_is_mandatory",
        status : HttpStatus.BAD_REQUEST
    },

    User_Already_Exist : {
        message : "User_Already_Exist",
        status : HttpStatus.BAD_REQUEST
    },

    User_Not_Found : {
        message : "User_Not_Found",
        status : HttpStatus.NOT_FOUND
    },

    Email_Not_Registered : {
        message : "Email_Not_registered",
        status : HttpStatus.NOT_FOUND
    },

    Invalid_Password : {
        message : "Invalid_password",
        status : HttpStatus.BAD_REQUEST
    },

    InActive_Account : {
        message : "Your account is inactive",
        status : HttpStatus.FORBIDDEN
    },

    Tenant_Already_Exist : {
        message : "Tenant_Already_Exist",
        status : HttpStatus.BAD_REQUEST
    }

}