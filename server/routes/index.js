const router = require("express").Router();
const loginController = require("../controllers/loginController");
const authentication = require("../middlewares/authentication");

router.get("/", function(req, res) {
  res.status(200).send("Homepage");
});

router.post("/signup", loginController.signup);
router.post("/signin", authentication, loginController.signin);
router.post("/login-fb", loginController.fbLogin);

module.exports = router;
