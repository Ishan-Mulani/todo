import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

export async function getAllTodos(req, res) {
  try {
    const { role, id } = req.user;
    let todos;

    if (role === "admin") {
      todos = await Todo.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      todos = await Todo.findAll({
        where: { userId: id },
        order: [["createdAt", "DESC"]],
      });
    }

    res.json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch todos",
    });
  }
}

export async function getTodo(req, res) {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    let todo;
    if (role === "admin") {
      todo = await Todo.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });
    } else {
      todo = await Todo.findOne({
        where: { id, userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });
    }

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    res.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch todo",
    });
  }
}

export async function createTodo(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { title, description, dueDate } = req.body;
    const { id: userId } = req.user;

    const todo = await Todo.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId,
    });

    const createdTodo = await Todo.findByPk(todo.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: createdTodo,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create todo",
    });
  }
}

export async function updateTodo(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { id } = req.params;
    const { role, id: userId } = req.user;
    const { title, description, completed, dueDate } = req.body;

    let todo;
    if (role === "admin") {
      todo = await Todo.findByPk(id);
    } else {
      todo = await Todo.findOne({ where: { id, userId } });
    }

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (dueDate !== undefined)
      todo.dueDate = dueDate ? new Date(dueDate) : null;

    await todo.save();

    const updatedTodo = await Todo.findByPk(todo.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update todo",
    });
  }
}

export async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    let todo;
    if (role === "admin") {
      todo = await Todo.findByPk(id);
    } else {
      todo = await Todo.findOne({ where: { id, userId } });
    }

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    await todo.destroy();

    res.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete todo",
    });
  }
}
