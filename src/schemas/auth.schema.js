// signup schema
export const registerBody = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
};

// login schema
export const loginBody = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
};

// login response schema
export const loginResponse = {
  200: {
    type: "object",
    properties: {
      token: { type: "string", description: "JWT for authenticated user" },
    },
  },
};
