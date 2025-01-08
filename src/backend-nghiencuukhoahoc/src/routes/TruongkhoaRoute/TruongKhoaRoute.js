const express = require("express");
const app = express();
const pool = require("../../config/database");
const router = express.Router();
const axios = require("axios");
const {
  GiangVien_thuoc_KhoaController,
  timkiem_email_taikhoanController,
  timkiem_email_taikhoan_ngoaitruongController,
} = require("../../controllers/TruongkhoaController/TruongKhoaController");

const {
  LoaiDanhMucExcelController,
  DanhMucExcelController,
  TyLeExcelController,
  CoTyLeExcelController,

  PhanCongControllerTest,

  Training_RandomForestControllerTest,
} = require("../../controllers/TruongkhoaController/testControler");

const { GOI_Y_SERVER, GOI_Y_SERVER_rf } = require("../../utils/controllerTEST");

const { checkUserJWT } = require("../../middlewares/JWTAction");
const TruongKhoaRoute = (app) => {
  router.get("/xem", checkUserJWT, GiangVien_thuoc_KhoaController);
  router.post("/timkiem/email", timkiem_email_taikhoanController);
  router.post(
    "/timkiem/ngoaitruong/email",
    checkUserJWT,
    timkiem_email_taikhoan_ngoaitruongController
  );
  router.post("/test/tao/excel", checkUserJWT, CoTyLeExcelController); // Chạy CSDL bằng excel
  // router.post("/test/phancong", checkUserJWT, PhanCongControllerTest);
  router.post(
    "/test/phancong",
    checkUserJWT,
    Training_RandomForestControllerTest
  );

  // router.post("/test/python", checkUserJWT, Training_RandomForestControllerTest);

  router.get("/test/dudoan", checkUserJWT, GOI_Y_SERVER);
  router.post("/test/dudoan/rf", checkUserJWT, GOI_Y_SERVER_rf);

  router.get("/allbomon", async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT * 
        FROM bomon,khoa 
        where khoa.MAKHOA = bomon.MAKHOA 
        and khoa.TENKHOA = N'Khoa Kỹ Thuật Công Nghệ'`
      );

      // Trả về dữ liệu dưới dạng JSON
      res.status(200).json({
        EM: "Lỗi services selectBomon",
        EC: 1,
        DT: rows,
      });
    } catch (error) {
      console.error("Lỗi truy vấn:", error);
      res.status(500).json({
        message: "Lỗi máy chủ",
        error: error.message,
      });
    }
  });

  router.get("/allbomon/chuachonkhung", async (req, res) => {
    try {
      const TENBOMON = req.body.TENBOMON;
      con;
      let [results_ctdt_bomon, fields1] = await pool.execute(
        `SELECT gv.*
        FROM giangvien,chon_khung,
        
        WHERE ck.MAGV IS NULL
        AND bomon.TENBOMON = ?;`
      );
      // Trả về dữ liệu dưới dạng JSON
      res.status(200).json({
        EM: "Lỗi services selectBomon",
        EC: 1,
        DT: rows,
      });
    } catch (error) {
      console.error("Lỗi truy vấn:", error);
      res.status(500).json({
        message: "Lỗi máy chủ",
        error: error.message,
      });
    }
  });

  router.post("/danhsachgiangvienchuadangkychonkhung", async (req, res) => {
    // try {
    const TENNAMHOC = req.body.TENNAMHOC;
    const TENBOMON = req.body.TENBOMON;
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT gv.*
FROM giangvien gv
JOIN bomon bm ON gv.MABOMON = bm.MABOMON
WHERE NOT EXISTS (
    SELECT 1
    FROM chon_khung ck
    JOIN namhoc nh ON ck.MANAMHOC = nh.MANAMHOC
    WHERE ck.MAGV = gv.MAGV
    AND nh.TENNAMHOC = ?
)
AND bm.TENBOMON = ?;

`,
      [TENNAMHOC, TENBOMON]
    );
    return res.status(200).json({
      EM: " mã lớp hoặc chương trình bị rỗng",
      EC: 1,
      DT: results_ctdt_bomon,
    });
    // } catch (err) {
    //   console.error("Error fetching hotels:", err.message);
    //   res.status(500).json({ message: err.message });
    // }
  });

  router.post("/danhsachgiangviendadangkychonkhung", async (req, res) => {
    // try {
    const TENNAMHOC = req.body.TENNAMHOC;
    const TENBOMON = req.body.TENBOMON;
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT gv.*, nh.TENNAMHOC, kgc.*
   FROM giangvien gv
   JOIN bomon bm ON gv.MABOMON = bm.MABOMON
   JOIN chon_khung ck ON gv.MAGV = ck.MAGV
   JOIN khunggiochuan kgc ON kgc.MAKHUNG = ck.MAKHUNG
   JOIN namhoc nh ON nh.MANAMHOC = ck.MANAMHOC
   JOIN taikhoan tk ON gv.MAGV = tk.MAGV
   WHERE tk.TENDANGNHAP IS NOT NULL
   AND nh.TENNAMHOC = ?
   AND bm.TENBOMON = ?
   AND bm.MABOMON = gv.MABOMON`,
      [TENNAMHOC, TENBOMON]
    );
    let danhSachGiangVienDaChonKhung = [];

    results_ctdt_bomon.forEach((dong) => {
      let MaGV = danhSachGiangVienDaChonKhung.find(
        (gv) => gv.MAGV === dong.MAGV
      );

      if (!MaGV) {
        MaGV = {
          MAGV: dong.MAGV,
          ThongtinGiangvien: [],
        };
        danhSachGiangVienDaChonKhung.push(MaGV);
      }

      let giangvien = MaGV.ThongtinGiangvien.find(
        (m) => m.TENGV === dong.TENGV
      );

      if (!giangvien) {
        giangvien = {
          MABOMON: dong.MABOMON,
          TENNAMHOC: dong.TENNAMHOC,
          TENGIANGVIEN: dong.TENGV,
          EMAIL: dong.EMAIL,
          GIOCHUAN: [],
        };
        MaGV.ThongtinGiangvien.push(giangvien);
      }
      if (!giangvien.GIOCHUAN.includes(dong.TENKHHUNGCHUAN)) {
        giangvien.GIOCHUAN.push({
          GIOGIANGDAY_HANHCHINH: dong.GIOGIANGDAY_HANHCHINH,
          GIOGIANGDAY_CHUAN: dong.GIOGIANGDAY_CHUAN,
          GIONGHIENCUUKHOAHOC_HANHCHINH: dong.GIONGHIENCUUKHOAHOC_HANHCHINH,
          GIONGHIENCUUKHOAHOC_CHUAN: dong.GIONGHIENCUUKHOAHOC_CHUAN,
          GIOPHUCVUCONGDONG_HANHCHINH: dong.GIOPHUCVUCONGDONG_HANHCHINH,
          GIOPHUCVUCONGDONG_CHUAN: dong.GIOPHUCVUCONGDONG_CHUAN,
        });
      }
    });

    return res.status(200).json({
      EM: " mã lớp hoặc chương trình bị rỗng",
      EC: 1,
      DT: danhSachGiangVienDaChonKhung,
    });
    // } catch (err) {
    //   console.error("Error fetching hotels:", err.message);
    //   res.status(500).json({ message: err.message });
    // }
  });

  router.post("/danhsachgiangviendangkynkhktheobomon", async (req, res) => {
    // try {
    const TENNAMHOC = req.body.TENNAMHOC;
    const TENBOMON = req.body.TENBOMON;
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT 
    giangvien.*, 
    namhoc.TENNAMHOC, 
    COUNT(dang_ky_thuc_hien_quy_doi.TEN_DE_TAI) AS SoLuongDeTai,
    GROUP_CONCAT(dang_ky_thuc_hien_quy_doi.TEN_DE_TAI SEPARATOR ', ') AS DanhSachDeTai
FROM 
    giangvien
JOIN 
    bomon ON bomon.MABOMON = giangvien.MABOMON
JOIN 
    dang_ky_thuc_hien_quy_doi 
    ON giangvien.MAGV = dang_ky_thuc_hien_quy_doi.MAGV
JOIN 
    namhoc 
    ON namhoc.MANAMHOC = dang_ky_thuc_hien_quy_doi.MANAMHOC
WHERE 
    namhoc.TENNAMHOC = ? 
    AND bomon.TENBOMON = ? 
GROUP BY 
    giangvien.MAGV, giangvien.TENGV, namhoc.TENNAMHOC;

`,
      [TENNAMHOC, TENBOMON]
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

  router.post("/danhsachgiangvienchuadangkynkhktheobomon", async (req, res) => {
    try {
      const TENNAMHOC = req.body.TENNAMHOC;
      const TENBOMON = req.body.TENBOMON;
      let [results_ctdt_bomon, fields1] = await pool.execute(
        `SELECT 
    giangvien.*
FROM 
    giangvien
LEFT JOIN 
    bomon ON bomon.MABOMON = giangvien.MABOMON
LEFT JOIN 
    dang_ky_thuc_hien_quy_doi 
    ON giangvien.MAGV = dang_ky_thuc_hien_quy_doi.MAGV
    AND dang_ky_thuc_hien_quy_doi.MANAMHOC = (SELECT MANAMHOC FROM namhoc WHERE TENNAMHOC = ?)
WHERE 
    dang_ky_thuc_hien_quy_doi.MAGV IS NULL
    AND bomon.TENBOMON = ?;

`,
        [TENNAMHOC, TENBOMON]
      );
      return res.status(200).json({
        EM: " mã lớp hoặc chương trình bị rỗng",
        EC: 200,
        DT: results_ctdt_bomon,
      });
    } catch (err) {
      console.error("Error fetching hotels:", err.message);
      res.status(500).json({ message: err.message });
    }
  });

  return app.use("/api/v1/truongkhoa", router);
};

module.exports = TruongKhoaRoute;
