const {
  createchitietphancong_excel,
  Dangky_chitietphancong,
  xem_chitietphancong_giangvien,
  xem_chitietphancong_lop,
  xem_chitietphancong_banthan,
  xem_giophancong_giangvienkhac,
} = require("../../services/TruongbomonServices/CRUDChitietphancong");

const selectChitietphancongController_giangvien = async (req, res) => {
  try {
    const MAHKNK = req.body.MAHKNK;
    // Kiểm tra dữ liệu đầu vào
    if (!MAHKNK) {
      return res.status(400).json({
        EM: "Học kì niên khóa bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await xem_chitietphancong_giangvien(MAHKNK);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      EM: "lỗi controller createChitietphancongExcelController",
      EC: -1,
      DT: [],
    });
  }
};

const select_giophancong_giangvienkhac_CONTROLLER = async (req, res) => {
  try {
    const MAHKNK = req.body.MAHKNK;

    if (!MAHKNK) {
      return res.status(400).json({
        EM: "Học kì niên khóa bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await xem_giophancong_giangvienkhac(MAHKNK);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      EM: "lỗi controller createChitietphancongExcelController",
      EC: -1,
      DT: [],
    });
  }
};

const selectChitietphancongController_lop = async (req, res) => {
  try {
    let results = await xem_chitietphancong_lop();

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      EM: "lỗi controller createChitietphancongExcelController",
      EC: -1,
      DT: [],
    });
  }
};

const createChitietphancongExcelController = async (req, res) => {
  try {
    const dataChitietphancongExcelArray = req.body;

    let results = await createchitietphancong_excel(
      dataChitietphancongExcelArray
    );

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      EM: "lỗi controller createChitietphancongExcelController",
      EC: -1,
      DT: [],
    });
  }
};

const Dangky_ChitietphancongExcelController = async (req, res) => {
  try {
    const dataChitietphancongExcelArray = req.body;

    let results = await Dangky_chitietphancong(dataChitietphancongExcelArray);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      EM: "lỗi controller createChitietphancongExcelController",
      EC: -1,
      DT: [],
    });
  }
};

const Xem_Chitietphancong_banthan_Controller = async (req, res) => {
  try {
    const MAGV = req.body.MAGV;
    const MAHKNK = req.body.HKNK.MAHKNK;
    const HOCKI = req.body.HKNK.TENHKNK;
    if (!MAGV || !MAHKNK) {
      return res.status(400).json({
        EM: !MAGV
          ? "Mã giảng viên không được bỏ trống"
          : "Học kì niên khóa không được bỏ trống",
        EC: 400,
        DT: null,
      });
    }
    let results = await xem_chitietphancong_banthan(MAGV, MAHKNK);

    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      EM: "lỗi controller createChitietphancongExcelController",
      EC: -1,
      DT: [],
    });
  }
};

module.exports = {
  createChitietphancongExcelController,
  Dangky_ChitietphancongExcelController,
  selectChitietphancongController_giangvien,
  selectChitietphancongController_lop,
  Xem_Chitietphancong_banthan_Controller,
  select_giophancong_giangvienkhac_CONTROLLER,
};
