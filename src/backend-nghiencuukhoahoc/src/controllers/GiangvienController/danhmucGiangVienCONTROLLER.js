const {
  get_thongtin_danhmuc,
  getLoaiTacGiaByLoaiDanhMuc,
  get_thongtin_dangky_giangvien,
  get_thongtin_dangky_giangvien_hoptac,
  dangky_thongtin_giangvien,
} = require("../../services/GiangvienServices/danhmucGiangvienServices");

const {
  dangky_danhmuc_giangvien,
} = require("../../services/GiangvienServices/DanhMucSevicers/dangky_danhmuc_giangvien");

const select_thongtin_danhmuc = async (req, res) => {
  try {
    const TENDANGNHAP = req.body.TENDANGNHAP;
    const TENNAMHOC = req.body.TENNAMHOC;
    if (!TENDANGNHAP || !TENNAMHOC) {
      return res.status(400).json({
        EM: " TENDANGNHAP  TENNAMHOC bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await get_thongtin_danhmuc(TENDANGNHAP, TENNAMHOC);
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

const select_loaitacgia_loaidanhmuc = async (req, res) => {
  try {
    const MA_LOAI_DANH_MUC = req.body.MA_LOAI_DANH_MUC;
    if (!MA_LOAI_DANH_MUC) {
      return res.status(400).json({
        EM: "MA_LOAI_DANH_MUC bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await getLoaiTacGiaByLoaiDanhMuc(MA_LOAI_DANH_MUC);
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

const dangky_danhmuc_Controller = async (req, res) => {
  try {

    let dataDangKyDanhMuc = req.body;
    if (!dataDangKyDanhMuc) {
      return res.status(400).json({
        EM: "dataDangKyDanhMuc bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await dangky_danhmuc_giangvien(dataDangKyDanhMuc);
    // let results = {
    //   EM: "ok",
    //   EC: 1,
    //   DT: "ok",
    // };
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

const luu_data_dangky_danhmuc_Controller = async (req, res) => {
  try {
    const datadangky = req.body;
    if (!datadangky) {
      return res.status(400).json({
        EM: "datadangky bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await dangky_thongtin_giangvien(datadangky);
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

const select_thongtin_dangkydanhmuc_giangvien = async (req, res) => {
  try {
    const MAGV = req.body.MAGV;
    const TENNAMHOC = req.body.TENNAMHOC;
    if (!MAGV || !TENNAMHOC) {
      return res.status(400).json({
        EM: "MAGV TENNAMHOC bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await get_thongtin_dangky_giangvien(MAGV, TENNAMHOC);
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

const select_thongtin_dangkydanhmuc__danhsach_giangvien = async (req, res) => {
  try {
    const TEN_NGHIEN_CUU = req.body.TEN_NGHIEN_CUU;
    if (!TEN_NGHIEN_CUU) {
      return res.status(400).json({
        EM: "TEN_NGHIEN_CUU bị rỗng",
        EC: 400,
        DT: null,
      });
    }
    let results = await get_thongtin_dangky_giangvien_hoptac(TEN_NGHIEN_CUU);
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

module.exports = {
  select_thongtin_danhmuc,
  select_loaitacgia_loaidanhmuc,
  dangky_danhmuc_Controller,
  luu_data_dangky_danhmuc_Controller,
  select_thongtin_dangkydanhmuc_giangvien,
  select_thongtin_dangkydanhmuc__danhsach_giangvien,
};
