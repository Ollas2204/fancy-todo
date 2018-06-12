const router = require("express").Router();
const userController = require("../controllers/userController");
const userValidation = require("../middlewares/userValidation");

router.get("/", userValidation, userController.getTodos);
router.post("/", userValidation, userController.addTodo);
router.put("/todo/:todoId", userValidation, userController.updateTodo);
router.delete(
  "/todo/:todoId",
  userValidation,
  userController.deleteTodo
);
router.post(
  "/todo/:todoId/add-tag",
  userValidation,
  userController.addTag
);

module.exports = router;
