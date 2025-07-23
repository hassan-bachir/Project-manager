// src/schemas/task.schema.js

/**
 * Body for POST /projects/:projectId/tasks
 */
export const createTaskBody = {
  type: "object",
  required: ["title", "dueDate", "priority"],
  properties: {
    title: { type: "string" },
    description: { type: ["string", "null"] },
    dueDate: { type: "string", format: "date-time" },
    priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
    // list of user‑UUIDs to assign
    assignees: {
      type: "array",
      items: { type: "string", format: "uuid" },
      // minItems: 1,
    },
  },
  additionalProperties: false,
};

/**
 * Body for PUT /tasks/:id
 */
export const updateTaskBody = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: ["string", "null"] },
    dueDate: { type: "string", format: "date-time" },
    priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
    status: { type: "string", enum: ["TODO", "IN_PROGRESS", "COMPLETED"] },
    assignees: {
      type: "array",
      items: { type: "string", format: "uuid" },
    },
  },
  additionalProperties: false,
};

/**
 * Params for routes under /projects/:projectId/*
 */
export const projectIdParams = {
  type: "object",
  required: ["projectId"],
  properties: {
    projectId: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

/**
 * Params for routes under /tasks/:id/*
 */
export const taskIdParams = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

/**
 * Querystring for GET /projects/:projectId/tasks
 */
export const listTasksQuery = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["TODO", "IN_PROGRESS", "COMPLETED"] },
    priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
    dueAfter: { type: "string", format: "date-time" },
    dueBefore: { type: "string", format: "date-time" },
    search: { type: "string" },
  },
  additionalProperties: false,
};

/**
 * Single task item without relations
 */
const taskListItem = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    title: { type: "string" },
    description: { type: ["string", "null"] },
    dueDate: { type: "string", format: "date-time" },
    priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
    status: { type: "string", enum: ["TODO", "IN_PROGRESS", "COMPLETED"] },
    projectId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: [
    "id",
    "title",
    "dueDate",
    "priority",
    "status",
    "projectId",
    "createdAt",
    "updatedAt",
  ],
};

/**
 * Response schema for GET list of tasks
 */
export const taskListResponse = {
  200: {
    type: "array",
    items: taskListItem,
  },
};

/**
 * Response schema for single task (with assignees)
 */
export const taskResponse = {
  200: {
    type: "object",
    properties: {
      ...taskListItem.properties,
      assignees: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },

            email: { type: "string", format: "email" },
          },
          required: ["id"],
        },
      },
    },
    required: [...taskListItem.required, "assignees"],
  },
};
