import express from "express";
import {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { authenticateUsers } from "../middlewares/authentication.middleware.js";
import { body } from "express-validator";

const router = express.Router();

const todoValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title must be between 1 and 255 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean value"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

router.use(authenticateUsers);
router.get("/", getAllTodos);
router.get("/:id", getTodo);
router.post("/", todoValidation, createTodo);
router.put("/:id", todoValidation, updateTodo);
router.delete("/:id", deleteTodo);

export default router;
