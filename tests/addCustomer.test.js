const { addCustomer } = require("../src/validate/index");

describe("Add Customer", () => {
  test("✅ Successfully adds customer with valid email, phone, and password", () => {
    const email = "test@example.com";
    const phone = "01234567890";
    const password = "password123";
    const customer = addCustomer(email, phone, password);
    expect(customer.EmailAddress).toBe(email);
    expect(customer.PhoneNumber).toBe(phone);
    expect(customer.Password).toHaveLength(64); // Length of SHA-256 hash string is 64 characters
    expect(new Date(customer.CreationDate).toISOString()).toBe(customer.CreationDate);
    expect(new Date(customer.UpdateDate).toISOString()).toBe(customer.UpdateDate);
  });

  test("❌ Throws error if email is invalid", () => {
    const email = "invalid-email";
    const phone = "01234567890";
    const password = "password123";
    expect(() => addCustomer(email, phone, password)).toThrow("❌ Invalid email: \"value\" must be a valid email");
  });

  test("❌ Throws error if phone is invalid", () => {
    const email = "test@example.com";
    const phone = "0123456789";
    const password = "password123";
    expect(() => addCustomer(email, phone, password)).toThrow("❌ Invalid phone: \"value\" length must be 11 characters long");
  });
});