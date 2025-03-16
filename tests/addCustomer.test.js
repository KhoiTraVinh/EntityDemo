var { addCustomer } = require("../src/services/user.service");
var { validatePhone, validateEmail } = require("../src/validate");
var { checkExistence } = require("../src/helpers/dynamodb.helper");
const { CREATED } = require("../src/core/success.response");
const AuthController = require("../src/controllers/auth.controller");
const db = require("../src/helpers/dynamodb.helper");
const { mockNext, mockRequest, mockResponse } = require("../src/utils/interceptor.utils");
const CryptoJS = require("crypto-js");
const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/helpers/dynamodb.helper");
jest.mock("../src/validate");
jest.mock("../src/controllers/auth.controller");
jest.mock("../src/core/success.response");

// describe("Add Customer", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // test("✅ Successfully adds customer with valid email, phone, and password", async () => {
//   //   // DynamoDBSingleton.getInstance = jest.fn().mockResolvedValue(true);
//   //   db.insertData = jest.fn().mockResolvedValue(true);
//   //   validateEmail = jest.fn().mockReturnValue(100);
//   //   checkExistence = jest.fn().mockReturnValue(false);
//   //   validatePhone = jest.fn().mockReturnValue(200);
//   //   const email = "test@example.com";
//   //   const phone = "01234567890";
//   //   const password = "password123";
//   //   const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
//   //   const now = new Date().toISOString();

//   //   const customer = await addCustomer({ email, phone, password });
//   //   console.log(customer);

//   //   expect(customer).not.toBeNull();
//   // });
// });

describe("Test Controller", () => {
  it("Should add customer", async () => {
    const email = "Khoi@gmail.com";
    const phone = "01234567890";
    const password = "password123";

    const response = await request(app).post("/v1/api/register").send({ email, phone, password });
    console.log("Response Body:", response.body); // Debugging log
    console.log("Response Status:", response.status); // Debugging log

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("metadata");
  });
});