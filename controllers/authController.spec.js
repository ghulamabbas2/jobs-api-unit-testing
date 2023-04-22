import bcrypt from "bcryptjs";
import User from "../models/users.js";

import { registerUser, loginUser } from './authController'


jest.mock('../utils/helpers', () => ({
    getJwtToken: jest.fn(() => 'jwt_token')
}))

const mockRequest = () => {
    return {
        body: {
            name: "Sanja",
            email: "sanja@gmail.com",
            password: "5432"
        }
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    }
}

const mockUser = {
    _id: "1",
    name: "Sanja",
    email: "sanja@gmail.com",
    password: "hush"
}

const userLogin = {
    password: "Sanja",
    email: "sanja@gmail.com",
}

afterEach(() => {
    jest.clearAllMocks()
})

describe('Register User', () => {
    it("should register user", async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(mockUser.password)
        jest.spyOn(User, 'create').mockResolvedValueOnce(mockUser)

        const mockReq = {
            body: {
                name: "Sanja",
                email: "sanja@gmail.com",
                password: "5432"
            }
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(bcrypt.hash).toHaveBeenCalledWith('5432', 10)
        expect(User.create).toHaveBeenCalledWith({
            name: "Sanja",
            email: "sanja@gmail.com",
            password: "hush"
        })
    })
    it("should throw validation error",  async () => {
        const mockReq = {
            body: {
                name: "Sanja",
                email: "sanja@gmail.com"
            }
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter all values",
          })
    })

    it("should throw duplict em ent err", async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(mockUser.password)
        jest.spyOn(User, 'create').mockRejectedValueOnce({code: 11000})

        const mockReq = {
            body: {
                name: "Sanja",
                email: "sanja@gmail.com",
                password: "5432"
            }
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        }

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Duplicate email"
          })

    })
})

describe("Login User", () => {
    it("should throw missing email or pwd err", async () => { 
        const mockReq = mockRequest().body = { body: {} }
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter email & Password"
          })
    })

    it("should throw Invalid email or pwd", async () => { 
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(null)
        }))
        const mockReq = { body: userLogin }
        console.log("ooooo", mockReq)
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Invalid Email or Password"
          })

    })


    it("should throw Invalid email or pwd", async () => { 
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(mockUser)
        }))

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

        const mockReq = { body: userLogin }
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Invalid Email or Password"
          })

    })

    it("should throw pwd no match", async () => { 
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(mockUser)
        }))

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

        const mockReq = { body: userLogin }
        const mockRes = mockResponse()

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
            token: "jwt_token"
          })

    })
})