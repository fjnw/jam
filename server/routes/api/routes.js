const router = require("express").Router();
const prodRoutes = require("../../controllers/productAPI");
const userRoutes = require("../../controllers/userAPI");
const questionRoutes = require("../../controllers/questionAPI");
const answerRoutes = require("../../controllers/answerAPI");
const bidRoutes = require("../../controllers/bidAPI");

//Jam Bids routes
router.use("/prod", prodRoutes);
router.use("/user", userRoutes);
router.use("/questions", questionRoutes);
router.use("/answers", answerRoutes);
router.use("/bids", bidRoutes);

module.exports = router;