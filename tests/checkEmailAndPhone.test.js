const { validateEmail, validatePhone } = require("../src/validate/index");

describe("Validate Email", () => {
  test("✅ Trả về true nếu email đúng định dạng", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  test("❌ Ném lỗi nếu email sai định dạng", () => {
    expect(() => validateEmail("invalid-email")).toThrow("❌ Invalid email");
  });
});

describe("Validate Phone", () => {
  test("✅ Trả về true nếu phone có độ dài 11 số", () => {
    expect(validatePhone("01234567890")).toBe(true);
  });

  test("❌ Ném lỗi nếu phone không đủ 11 số", () => {
    expect(() => validatePhone("0123456789")).toThrow("❌ Invalid phone");
  });

  test("❌ Ném lỗi nếu phone nhiều hơn 11 số", () => {
    expect(() => validatePhone("012345678901")).toThrow("❌ Invalid phone");
  });
});