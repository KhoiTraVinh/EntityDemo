const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = require("@aws-sdk/client-dynamodb");
const { checkExitsEmailAndPhone } = require("../src/services/user.service");

// 🛠️ Mock AWS SDK để không gọi thật vào DynamoDB
jest.mock("@aws-sdk/client-dynamodb", () => ({
    GetItemCommand: jest.fn(),
}));
jest.mock("@aws-sdk/client-dynamodb", () => ({
    send: jest.fn(),
}));

describe("checkExitsEmailAndPhone function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("✅ Trả về true nếu email tồn tại", async () => {
        dynamoDBClient.send.mockResolvedValueOnce({ Item: { EmailAddress: { S: "test@example.com" } } });

        const exists = await checkExitsEmailAndPhone("CustomerMaster", { EmailAddress: "test@example.com" });
        expect(exists).toBe(true);
        expect(dynamoDBClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
    });

    test("✅ Trả về false nếu email không tồn tại", async () => {
        dynamoDBClient.send.mockResolvedValueOnce({});

        const exists = await checkExitsEmailAndPhone("CustomerMaster", { EmailAddress: "notfound@example.com" });
        expect(exists).toBe(false);
        expect(dynamoDBClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
    });

    test("✅ Trả về true nếu số điện thoại tồn tại", async () => {
        dynamoDBClient.send.mockResolvedValueOnce({ Item: { PhoneNumber: { S: "1234567890" } } });

        const exists = await checkExitsEmailAndPhone("CustomerMaster", { PhoneNumber: "1234567890" });
        expect(exists).toBe(true);
        expect(dynamoDBClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
    });

    test("✅ Trả về false nếu số điện thoại không tồn tại", async () => {
        dynamoDBClient.send.mockResolvedValueOnce({});

        const exists = await checkExitsEmailAndPhone("CustomerMaster", { PhoneNumber: "0000000000" });
        expect(exists).toBe(false);
        expect(dynamoDBClient.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
    });

    test("❌ Xử lý lỗi từ DynamoDB và trả về false", async () => {
        dynamoDBClient.send.mockRejectedValueOnce(new Error("DynamoDB error"));

        const exists = await checkExitsEmailAndPhone("CustomerMaster", { EmailAddress: "error@example.com" });
        expect(exists).toBe(false);
    });
});