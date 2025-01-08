const express = require("express");
const app = express();
const router = express.Router();
const { checkUserJWT } = require("../../middlewares/JWTAction");
const {
  getBieuDoTron,
  getBieuDoTron_PhanCong,
  getGV_BoMon,
  getNamHoc_HocKiNienKhoaController,
} = require("../../controllers/TruongbomonController/ThongKeController");
const TruongBoMonThongKe = (app) => {
  router.get("/getNamHoc_HocKiNienKhoa", getNamHoc_HocKiNienKhoaController);

  router.post("/bieudotron", checkUserJWT, getBieuDoTron);
  router.post("/bieudotron_phancong", checkUserJWT, getBieuDoTron_PhanCong);
  router.post("/giangvien", checkUserJWT, getGV_BoMon);

  return app.use("/api/v1/truongbomon/thongke", router);
};

module.exports = TruongBoMonThongKe;
