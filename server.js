import express from "express";
import { port } from "./src/config/envConfig.js";
import routes from "./src/routes/index.route.js";
import { connectDB } from "./src/config/dbConfig.js";
import sequelize from "./src/config/dbConfig.js";
import User from "./src/models/user.model.js";
import Todo from "./src/models/todo.model.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

User.hasMany(Todo, { foreignKey: "userId", as: "todos" });
Todo.belongsTo(User, { foreignKey: "userId", as: "user" });

sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
});

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server Listening at Port ${port}`);
});
