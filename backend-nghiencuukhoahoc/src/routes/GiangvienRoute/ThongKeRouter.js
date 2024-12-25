const express = require("express");
const {
    getBieuDo_GioGiangControler,
    getBieuDo_GioGiangChonKhungController,
} = require("../../controllers/GiangvienController/ThongKeController");
const { checkUserJWT } = require("../../middlewares/JWTAction");
const ThongKeGV = (app) => {
    const router = require("express").Router();
    router.post("/getBieuDo_GioGiang", checkUserJWT, getBieuDo_GioGiangControler);
    router.post("/getBieuDo_GioGiangChonKhung", checkUserJWT, getBieuDo_GioGiangChonKhungController);

    return app.use("/api/v1/quyengiangvien/thongke", router);
};

module.exports = ThongKeGV;
