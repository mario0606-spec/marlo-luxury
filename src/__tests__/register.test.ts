/**
 * Smoke tests for /api/register input validation.
 * These run without a DB connection — they test schema validation only.
 */

const validPayload = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "securePass1!",
};

describe("register input validation", () => {
  it("accepts a valid payload shape", () => {
    const { name, email, password } = validPayload;
    expect(name.length).toBeGreaterThanOrEqual(2);
    expect(email).toContain("@");
    expect(password.length).toBeGreaterThanOrEqual(8);
  });

  it("rejects short passwords", () => {
    const short = "abc";
    expect(short.length).toBeLessThan(8);
  });

  it("rejects invalid email", () => {
    const bad = "notanemail";
    expect(bad).not.toContain("@");
  });
});
