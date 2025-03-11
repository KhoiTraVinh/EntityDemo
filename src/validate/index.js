const Joi = require("joi");

// ✅ Schema validate cho CustomerMaster
const customerMasterSchema = Joi.object({
  EmailAddress: Joi.string().email().max(50).required(),
  PhoneNumber: Joi.string().max(20).required(),
  Password: Joi.string().max(50).required(),
  CreationDate: Joi.string().isoDate().required(),
  UpdateDate: Joi.string().isoDate().required(),
});

// ✅ Schema validate cho PasswordHistory
const passwordHistorySchema = Joi.object({
  SequenceNumber: Joi.number().integer().min(1).required(),
  EmailAddress: Joi.string().email().max(50).required(),
  Password: Joi.string().max(50).required(),
  UpdateDate: Joi.string().isoDate().required(),
});

// 🛠️ Hàm validate dữ liệu
const validateData = (tableName, data) => {
  let schema;
  if (tableName === "CustomerMaster") schema = customerMasterSchema;
  else if (tableName === "PasswordHistory") schema = passwordHistorySchema;
  else throw new Error(`❌ No validation schema for table: ${tableName}`);

  const { error, value } = schema.validate(data);
  if (error) throw new Error(`❌ Validation failed: ${error.message}`);
  return value;
};

// 🛠️ Hàm validate email
const validateEmail = (email) => {
  const schema = Joi.string().email().required();
  const { error } = schema.validate(email);
  if (error) throw new Error(`❌ Invalid email: ${error.message}`);
  return true;
};

// 🛠️ Hàm validate phone
const validatePhone = (phone) => {
  const schema = Joi.string().length(11).required();
  const { error } = schema.validate(phone);
  if (error) throw new Error(`❌ Invalid phone: ${error.message}`);
  return true;
};

module.exports = { validateData, validateEmail, validatePhone };