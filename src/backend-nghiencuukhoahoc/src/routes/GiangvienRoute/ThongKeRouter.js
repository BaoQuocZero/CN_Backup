const express = require("express");
const {
    getBieuDo_GioGiangControler,
    getBieuDo_GioGiangChonKhungController,
    getPhanCongGV_MAGV_Controller,
    getHinhThucDanhGiaController,
    createBaoCaoKetThucController,
    getNamHoc_HocKiNienKhoaController,
} = require("../../controllers/GiangvienController/ThongKeController");
const { checkUserJWT } = require("../../middlewares/JWTAction");
const ThongKeGV = (app) => {
    const router = require("express").Router();
    router.post("/getBieuDo_GioGiang", checkUserJWT, getBieuDo_GioGiangControler);
    router.post("/getBieuDo_GioGiangChonKhung", checkUserJWT, getBieuDo_GioGiangChonKhungController);
    router.post("/getPhanCongGV_MAGV", checkUserJWT, getPhanCongGV_MAGV_Controller);
    router.post("/createBaoCaoKetThuc", checkUserJWT, createBaoCaoKetThucController);

    router.get("/getHinhThucDanhGia", getHinhThucDanhGiaController);
    router.get("/getNamHoc_HocKiNienKhoa", getNamHoc_HocKiNienKhoaController);

    return app.use("/api/v1/quyengiangvien/thongke", router);
};

module.exports = ThongKeGV;
