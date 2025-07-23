export const createProjectBody = {
  type: "object",
  required: ["name", "startDate", "endDate"],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    status: { type: "string", enum: ["ACTIVE", "COMPLETED"] },
  },
};

export const updateProjectBody = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    status: { type: "string", enum: ["ACTIVE", "COMPLETED"] },
  },
  additionalProperties: false,
};

export const projectIdParams = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

export const listProjectsQuery = {
  type: "object",
  properties: {
    search: { type: "string" },
  },
  additionalProperties: false,
};

// Response schemas
export const projectListItem = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    description: { type: ["string", "null"] },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    status: { type: "string", enum: ["ACTIVE", "COMPLETED"] },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

export const projectResponse = {
  200: projectListItem,
};

export const projectListResponse = {
  200: {
    type: "array",
    items: projectListItem,
  },
};
