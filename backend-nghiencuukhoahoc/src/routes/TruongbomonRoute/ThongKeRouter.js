const express = require("express");
const app = express();
const router = express.Router();
const { checkUserJWT } = require("../../middlewares/JWTAction");
const {
  getBieuDoTron,
} = require("../../controllers/TruongbomonController/ThongKeController");
const TruongBoMonThongKe = (app) => {
  router.post("/bieudotron", checkUserJWT, getBieuDoTron);

  return app.use("/api/v1/truongbomon/thongke", router);
};

module.exports = TruongBoMonThongKe;
