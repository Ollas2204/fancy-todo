const router = require("express").Router();
const userController = require("../controllers/userController");
const userValidation = require("../middlewares/userValidation");

router.get("/:userId", userValidation, userController.getTodos);
router.post("/:userId", userValidation, userController.addTodo);
router.put("/:userId/todo/:todoId", userValidation, userController.updateTodo);
router.delete(
  "/:userId/todo/:todoId",
  userValidation,
  userController.deleteTodo
);
router.post(
  "/:userId/todo/:todoId/add-tag",
  userValidation,
  userController.addTag
);

module.exports = router;
