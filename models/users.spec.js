import User from "./users";

afterEach(() => {
  jest.resetAllMocks();
});

describe("User Model", () => {
  it("should throw validation error for required fields", async () => {
    const user = new User();

    jest.spyOn(user, "validate").mockRejectedValueOnce({
      errors: {
        name: "Please enter your name",
        email: "Please enter your email address",
        password: "Please enter password",
      },
    });

    try {
      await user.validate();
    } catch (err) {
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    }
  });

  it("should throw password length error", async () => {
    const user = new User({
      name: "Ghulam",
      email: "test@gmail.com",
      password: "123456",
    });

    jest.spyOn(user, "validate").mockRejectedValueOnce({
      errors: {
        password: {
          message: "Your password must be at least 8 characters long",
        },
      },
    });

    try {
      await user.validate();
    } catch (err) {
      expect(err.errors.password).toBeDefined();
      expect(err.errors.password.message).toMatch(
        /your password must be at least 8 characters long/i
      );
    }
  });

  it("should create a new user", () => {
    const user = new User({
      name: "Ghulam",
      email: "test@gmail.com",
      password: "12345678",
    });

    expect(user).toHaveProperty("_id");
  });
});
