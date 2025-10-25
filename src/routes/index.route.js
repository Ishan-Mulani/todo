import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import todoRoutes from "./todo.route.js";
import { body } from "express-validator";

const router = express.Router();

const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

router.use("/todo", todoRoutes);
router.post("/login", loginValidation, login);
router.post("/register", registerValidation, register);

export default router;
