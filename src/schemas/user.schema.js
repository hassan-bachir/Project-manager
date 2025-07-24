//  Params for any `/users/:id` route
export const userIdParams = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

// Response schema for a single user
export const userResponse = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    email: { type: "string", format: "email" },
    role: { type: "string", enum: ["ADMIN", "USER"] },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "name", "email", "role", "createdAt", "updatedAt"],
  additionalProperties: false,
};

// Response schema for listing users
export const userListResponse = {
  200: {
    type: "array",
    items: userResponse,
  },
};

// Body schema for updating user role
export const updateUserRoleBody = {
  type: "object",
  required: ["role"],
  properties: {
    role: { type: "string", enum: ["ADMIN", "USER"] },
  },
  additionalProperties: false,
};

// Response schema for updating user role
export const updateUserRoleResponse = {
  200: userResponse,
};

// Params for deleting a user
export const deleteUserResponse = {
  204: { type: "null" },
};
