import { loginUser, registerUser } from "./authController";
import bcrypt from "bcryptjs";
import User from "../models/users";

jest.mock("../utils/helpers", () => ({
  getJwtToken: jest.fn(() => "jwt_token"),
}));

const mockRequest = () => {
  return {
    body: {
      name: "Test User",
      email: "test@gmail.com",
      password: "12345678",
    },
  };
};

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
};

const mockUser = {
  _id: "6368dadd983d6c4b181e37c1",
  name: "Test User",
  email: "test@gmail.com",
  password: "hashedPassword",
};

const userLogin = {
  email: "test@gmail.com",
  password: "12345678",
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Register User", () => {
  it("should register user", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
    jest.spyOn(User, "create").mockResolvedValueOnce(mockUser);

    const mockReq = mockRequest();
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(bcrypt.hash).toHaveBeenCalledWith("12345678", 10);
    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@gmail.com",
      password: "hashedPassword",
    });
  });

  it("should throw validation error", async () => {
    const mockReq = (mockRequest().body = { body: {} });
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Please enter all values",
    });
  });

  it("should throw duplicate email entered error", async () => {
    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
    jest.spyOn(User, "create").mockRejectedValueOnce({ code: 11000 });

    const mockReq = mockRequest();
    const mockRes = mockResponse();

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Duplicate email",
    });
  });
});

describe("Login User", () => {
  it("should throw missing email or password error", async () => {
    const mockReq = (mockRequest().body = { body: {} });
    const mockRes = mockResponse();

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Please enter email & Password",
    });
  });

  it("should throw Invalid email error", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(null),
    }));

    const mockReq = (mockRequest().body = { body: userLogin });
    const mockRes = mockResponse();

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid Email or Password",
    });
  });

  it("should throw Invalid password error", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(mockUser),
    }));

    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

    const mockReq = (mockRequest().body = { body: userLogin });
    const mockRes = mockResponse();

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid Email or Password",
    });
  });

  it("should throw Invalid password error", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValueOnce(mockUser),
    }));

    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

    const mockReq = (mockRequest().body = { body: userLogin });
    const mockRes = mockResponse();

    await loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      token: "jwt_token",
    });
  });
});
