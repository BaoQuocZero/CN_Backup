const {
  updateThongTinGiangVien,
} = require("../../services/GiangvienServices/updateThongTinGiangVien");

const {
  getPhanCongGV_MAGV,
  doiMatKhau_GV,
  quenMatKhau_GV,
  resetPassword
} = require("../../services/GiangvienServices/giangVienServices");

const updateThongTinGiangVienController = async (req, res) => {
  try {
    const TENDANGNHAP = req.params.TENDANGNHAP;
    const TENCHUCDANH = req.body.TENCHUCDANH;
    if (!TENDANGNHAP || !TENCHUCDANH) {
      return res.status(400).json({
        EM: "!TENDANGNHAP || !TENCHUCDANH bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    // Khởi tạo dataGiangVien với các trường cần thiết, mặc định là ''
    let dataGiangVien = {
      TENGV: "",
      DIENTHOAI: "",
      DIACHI: "",
      TENCHUCVU: "",
      EMAIL: "",
    };

    // Cập nhật giá trị từ req.body vào dataGiangVien
    Object.keys(dataGiangVien).forEach((field) => {
      if (req.body[field]) {
        dataGiangVien[field] = req.body[field];
      }
    });

    let results = await updateThongTinGiangVien(
      TENDANGNHAP,
      dataGiangVien,
      TENCHUCDANH
    );

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const getPhanCongGV_MAGVControler = async (req, res) => {
  try {
    const MAGV = req.body.MAGV;
    let results = await getPhanCongGV_MAGV(MAGV);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const DoiMatKhauController = async (req, res) => {
  try {
    const TENDANGNHAP = req.body.TENDANGNHAP;
    const MATKHAU_CU = req.body.MATKHAU_CU;
    const MATKHAU_MOI = req.body.MATKHAU_MOI;
    let results = await doiMatKhau_GV(TENDANGNHAP, MATKHAU_CU, MATKHAU_MOI);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const QuenMatKhauController = async (req, res) => {
  try {
    const TENDANGNHAP = req.body.TENDANGNHAP;
    let results = await quenMatKhau_GV(TENDANGNHAP);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ",
      EC: 500,
      DT: null,
    });
  }
};

const ResetPasswordController = async (req, res) => {
  try {
    const TENDANGNHAP = req.body.TENDANGNHAP;
    const MATKHAU_MOI = req.body.MATKHAU_MOI;
    let results = await resetPassword(TENDANGNHAP, MATKHAU_MOI);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đã xảy ra lỗi máy chủ.",
      EC: 500,
      DT: null,
    });
  }
};
module.exports = {
  updateThongTinGiangVienController,
  getPhanCongGV_MAGVControler,
  DoiMatKhauController,
  QuenMatKhauController,
  ResetPasswordController
};
