// __tests__/userController.test.js
const { registerUser } = require("../../src/controllers/UserControllers");
const User = require("../models/UserModels"); // Mocking User model

jest.mock("../models/UserModels");

const httpMocks = require("node-mocks-http"); // for mocking req/res

describe("registerUser", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  it("should return 400 if user already exists", async () => {
    req.body = { name: "John", email: "john@example.com", password: "123456", role: "user" };
    User.findOne.mockResolvedValue({ email: "john@example.com" });

    await registerUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ msg: "User already exists" });
  });

  it("should save user and return 201", async () => {
    req.body = { name: "John", email: "john@example.com", password: "123456", role: "user" };
    User.findOne.mockResolvedValue(null);
    const saveMock = jest.fn().mockResolvedValue();
    User.mockImplementation(() => ({
      save: saveMock
    }));

    await registerUser(req, res);

    expect(res.statusCode).toBe(201);
    const responseData = res._getJSONData();
    expect(responseData.msg).toBe("User registered successfully");
    expect(responseData.user).toBeDefined();
  });

  it("should return 500 on server error", async () => {
    req.body = { name: "John", email: "john@example.com", password: "123456", role: "user" };
    User.findOne.mockRejectedValue(new Error("Database down"));

    await registerUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ msg: "Database down" });
  });
});
