const router = require("express").Router();

const { signup, activateUser, signin } = require("../../controllers/auth");

router.post("/signup", signup);
router.post("/activate", activateUser);
router.post("/signin", signin);

module.exports = router;
