const express = require("express");
const app = express();
const pool = require("../../config/database");
const router = express.Router();

const {
  get_giangvien_CNTT,
  get_giangvien_CNTT_da_chon_khung,
  get_giangvien_CNTT_chua_chon_khung,
  get_giangvien_MonHoc_daChonKhung,
} = require("../../controllers/TruongbomonController/giangvienCONTROLLER");

const {
  getAllLop_BoMon_controller,
  get_giangvien_CNTT_chuachonkhung,
  get_giangvien_CNTT_dachonkhung,
  get_monhoc_lop_hocki,
  get_giangvien_CNTT_dachonkhung_chitietonly,

  get_listgiangvien_phancong,
  create_onlylistgiangvien_phancong,
  phancongtudong_giangvien_Controller,
  update_phancong_giangvienController,
} = require("../../controllers/TruongbomonController/phancongCONTROLLER");

const {
  createChitietphancongExcelController,
  Dangky_ChitietphancongExcelController,
  selectChitietphancongController_giangvien,
  selectChitietphancongController_lop,
  Xem_Chitietphancong_banthan_Controller,
  select_giophancong_giangvienkhac_CONTROLLER,
} = require("../../controllers/TruongbomonController/chitietphancongCONTROLLER");

const { checkUserJWT } = require("../../middlewares/JWTAction");
const CRUDgiangvien_CNTT = (app) => {
  //route cho khoa
  router.get("/xem", checkUserJWT, get_giangvien_CNTT);
  router.get(
    "/xem/dachonkhung",
    checkUserJWT,
    get_giangvien_CNTT_da_chon_khung
  );
  router.get(
    "/xem/chuachonkhung",
    checkUserJWT,
    get_giangvien_CNTT_chua_chon_khung
  );

  //route bên phân công
  router.post(
    "/xem/phancong/chuachonkhung",

    get_giangvien_CNTT_chuachonkhung
  );
  router.get(
    "/xem/phancong/dachonkhung",
    checkUserJWT,
    get_giangvien_CNTT_dachonkhung
  );
  router.post("/xem/phancong/lophoc/hocki", checkUserJWT, get_monhoc_lop_hocki);
  router.post("/xem/phancong/dachonkhung/chitiet", checkUserJWT, get_giangvien_CNTT_dachonkhung_chitietonly);
  router.post("/lop/bomon/xem", checkUserJWT, getAllLop_BoMon_controller);
  //bảng phân côngA
  router.get("/xem/phancong/listgiangvien", checkUserJWT, get_listgiangvien_phancong);
  router.post("/tao/phancong/giangvien", checkUserJWT, create_onlylistgiangvien_phancong);

  //chi tiết phân công route
  router.post(
    "/tao/chitietphancong/giangvien",
    checkUserJWT,
    createChitietphancongExcelController
  );

  router.post(
    "/dangky/chitietphancong/giangvien",
    checkUserJWT,
    Dangky_ChitietphancongExcelController
  );

  router.post(
    "/xem/danhsach/monhoc/giangvien",
    checkUserJWT,
    get_giangvien_MonHoc_daChonKhung
  );
  router.get(
    "/xem/danhsach/monhoc/giangvien/lop",
    checkUserJWT,
    selectChitietphancongController_lop
  );

  router.post(
    "/xem/danhsach/monhoc/danhsach/giangvien",
    checkUserJWT,
    selectChitietphancongController_giangvien
  );

  router.post(
    "/xem/danhsach/monhoc/giangvien/canhan",
    checkUserJWT,
    Xem_Chitietphancong_banthan_Controller
  );

  router.post("/phancong/tudong/giangvien", checkUserJWT, phancongtudong_giangvien_Controller);
  router.post("/phancong/update/giangvien", update_phancong_giangvienController);

  router.post("/xem/phancong/gio/giangvien", select_giophancong_giangvienkhac_CONTROLLER);

  router.post("/danhsachgiangviendangkynkhk", async (req, res) => {
    // try {
    const TENNAMHOC = req.body.TENNAMHOC;
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT 
    giangvien.*, 
    namhoc.TENNAMHOC, 
    COUNT(dang_ky_thuc_hien_quy_doi.TEN_DE_TAI) AS SoLuongDeTai,
    GROUP_CONCAT(dang_ky_thuc_hien_quy_doi.TEN_DE_TAI SEPARATOR ', ') AS DanhSachDeTai
FROM 
    giangvien
JOIN 
    dang_ky_thuc_hien_quy_doi 
    ON giangvien.MAGV = dang_ky_thuc_hien_quy_doi.MAGV
JOIN 
    namhoc 
    ON namhoc.MANAMHOC = dang_ky_thuc_hien_quy_doi.MANAMHOC
WHERE 
    namhoc.TENNAMHOC = ?
GROUP BY 
    giangvien.MAGV, giangvien.TENGV, namhoc.TENNAMHOC;
`,
      [TENNAMHOC]
    );
    return res.status(200).json({
      EM: " mã lớp hoặc chương trình bị rỗng",
      EC: 200,
      DT: results_ctdt_bomon,
    });
    // } catch (err) {
    //   console.error("Error fetching hotels:", err.message);
    //   res.status(500).json({ message: err.message });
    // }
  });

  router.post("/danhsachgiangvienchuadangkynkhk", async (req, res) => {
    // try {
    const TENNAMHOC = req.body.TENNAMHOC;
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT 
    giangvien.*

FROM 
    giangvien
LEFT JOIN 
    dang_ky_thuc_hien_quy_doi 
    ON giangvien.MAGV = dang_ky_thuc_hien_quy_doi.MAGV
    AND dang_ky_thuc_hien_quy_doi.MANAMHOC = (SELECT MANAMHOC FROM namhoc WHERE TENNAMHOC = ?)
WHERE 
    dang_ky_thuc_hien_quy_doi.MAGV IS NULL;
`,
      [TENNAMHOC]
    );
    return res.status(200).json({
      EM: " mã lớp hoặc chương trình bị rỗng",
      EC: 200,
      DT: results_ctdt_bomon,
    });
    // } catch (err) {
    //   console.error("Error fetching hotels:", err.message);
    //   res.status(500).json({ message: err.message });
    // }
  });

  return app.use("/api/v1/truongbomon/giangvien", router);
};

module.exports = CRUDgiangvien_CNTT;
