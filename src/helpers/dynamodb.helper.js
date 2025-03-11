'use strict'

const {
    ListTablesCommand,
    CreateTableCommand,
    PutItemCommand,
    ScanCommand,
    UpdateItemCommand,
    GetItemCommand
} = require("@aws-sdk/client-dynamodb");
const DynamoDBSingleton = require("../dbs/init.dynamodb");

const createIfNotExist = async (tableName, keySchema, attributeDefinitions) => {
    try {
        // Kiểm tra bảng đã tồn tại chưa
        const existingTables = await DynamoDBSingleton.send(new ListTablesCommand({}));
        if (existingTables.TableNames.includes(tableName)) {
            console.log(`✅ Table "${tableName}" already exists.`);
            return;
        }

        // Nếu chưa có, tạo bảng mới
        const params = {
            TableName: tableName,
            KeySchema: keySchema,
            AttributeDefinitions: attributeDefinitions,
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }, // Miễn phí trên Local
        };

        const command = new CreateTableCommand(params);
        await DynamoDBSingleton.send(command);
        console.log(`🚀 Table "${tableName}" created successfully!`);
    } catch (err) {
        console.error(`❌ Error creating table "${tableName}":`, err);
    }
};

// 🛠️ Tạo bảng CustomerMaster
const createCustomerMasterTable = async () => {
    await createIfNotExist(
        "CustomerMaster",
        [{ AttributeName: "EmailAddress", KeyType: "HASH" }], // Primary Key
        [
            { AttributeName: "EmailAddress", AttributeType: "S" }, // varchar50 (PK)
        ]
    );
};

// 🛠️ Tạo bảng PasswordHistory
const createPasswordHistoryTable = async () => {
    await createIfNotExist(
        "PasswordHistory",
        [
            { AttributeName: "SequenceNumber", KeyType: "HASH" }, // PK
            { AttributeName: "EmailAddress", KeyType: "RANGE" }, // Sort Key
        ],
        [
            { AttributeName: "SequenceNumber", AttributeType: "N" }, // Tăng dần (Number)
            { AttributeName: "EmailAddress", AttributeType: "S" }, // varchar50 (Khóa ngoại CustomerMaster)
        ]
    );
};

// Chạy tạo bảng
const initTables = async () => {
    await createCustomerMasterTable();
    await createPasswordHistoryTable();
};

const insertData = async (tableName, data) => {
    try {
        // Chuyển object thành định dạng DynamoDB
        const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
            acc[key] = typeof value === "number" ? { N: value.toString() } : { S: value };
            return acc;
        }, {});

        const params = {
            TableName: tableName,
            Item: formattedData,
        };

        await DynamoDBSingleton.send(new PutItemCommand(params));
        console.log(`✅ Inserted into "${tableName}":`, data);
    } catch (err) {
        console.error(`❌ Error inserting into "${tableName}":`, err);
    }
};

// 🛠️ Hàm lấy toàn bộ dữ liệu trong bảng
const getAllByTableName = async (tableName) => {
    try {
        const command = new ScanCommand({ TableName: tableName });
        const response = await DynamoDBSingleton.send(command);
        console.log(`📌 Data from ${tableName}:`, JSON.stringify(response.Items, null, 2));
    } catch (err) {
        console.error(`❌ Error scanning table ${tableName}:`, err);
    }
};

// 🛠️ Hàm cập nhật dữ liệu động trong DynamoDB
const updateData = async (tableName, key, updates) => {
    try {
        // Validate dữ liệu trước khi cập nhật
        const validatedUpdates = validateData(tableName, { ...key, ...updates });
        // Chuyển key thành định dạng DynamoDB
        const keyFormatted = Object.entries(key).reduce((acc, [k, v]) => {
            acc[k] = typeof v === "number" ? { N: v.toString() } : { S: v };
            return acc;
        }, {});

        // Chuyển updates thành định dạng Expression Attribute Values
        const updateExpressions = [];
        const expressionAttributeValues = {};
        for (const [field, value] of Object.entries(validatedUpdates)) {
            updateExpressions.push(`${field} = :${field}`);
            expressionAttributeValues[`:${field}`] = typeof value === "number" ? { N: value.toString() } : { S: value };
        }

        const params = {
            TableName: tableName,
            Key: keyFormatted,
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        await DynamoDBSingleton.send(new UpdateItemCommand(params));
        console.log(`✅ Updated "${tableName}" where ${JSON.stringify(key)} with ${JSON.stringify(validatedUpdates)}`);
    } catch (err) {
        console.error(`❌ Error updating "${tableName}":`, err);
    }
};

// 🛠️ Hàm kiểm tra xem Email hoặc PhoneNumber có tồn tại hay không
const checkExistence = async (tableName, key) => {
    try {
        // Chuyển key thành định dạng DynamoDB
        const keyFormatted = Object.entries(key).reduce((acc, [k, v]) => {
            acc[k] = typeof v === "number" ? { N: v.toString() } : { S: v };
            return acc;
        }, {});

        const params = {
            TableName: tableName,
            Key: keyFormatted,
        };

        const result = await DynamoDBSingleton.send(new GetItemCommand(params));
        return result.Item ? true : false; // Nếu có Item thì tồn tại, ngược lại thì chưa
    } catch (err) {
        console.error(`❌ Error checking existence in "${tableName}":`, err.message);
        return false;
    }
};


module.exports = {
    initTables,
    insertData,
    getAllByTableName,
    updateData,
    checkExistence
}