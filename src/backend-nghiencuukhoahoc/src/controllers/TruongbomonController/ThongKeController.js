const {
  selectBieuDoTron,
  selectBieuDo_PhanCong,
  selectGV_Bomon,
  getNamHoc_HocKiNienKhoa,
} = require("../../services/TruongbomonServices/ThongKeServices");

const getBieuDoTron = async (req, res) => {
  try {
    const MABOMON = req.body.MABOMON;
    const MAHKNK = req.body.MAHKNK;
    let results = await selectBieuDoTron(MABOMON, MAHKNK);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });

  } catch (error) {
    console.log(error);
    return res.status(200).json({
      EM: "lỗi get_bieudotron",
      EC: -1,
      DT: [],
    });
  }
};

const getBieuDoTron_PhanCong = async (req, res) => {
  try {
    const MABOMON = req.body.MABOMON;
    const MAHKNK = req.body.MAHKNK;
    let results = await selectBieuDo_PhanCong(MABOMON, MAHKNK);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });

  } catch (error) {
    console.log(error);
    return res.status(200).json({
      EM: "lỗi getBieuDoTron_PhanCong",
      EC: -1,
      DT: [],
    });
  }
};

const getGV_BoMon = async (req, res) => {
  try {
    const MABOMON = req.body.MABOMON;
    const currentPage = req.body.currentPage;
    const pageSize = req.body.pageSize;
    let results = await selectGV_Bomon(MABOMON, currentPage, pageSize);
    return res.status(200).json({
      EM: results.EM,
      EC: results.EC,
      DT: results.DT,
    });

  } catch (error) {
    console.log(error);
    return res.status(200).json({
      EM: "lỗi getGV_BoMon",
      EC: -1,
      DT: [],
    });
  }
};

const getNamHoc_HocKiNienKhoaController = async (req, res) => {
  try {
    let results = await getNamHoc_HocKiNienKhoa();

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
  getBieuDoTron,
  getBieuDoTron_PhanCong,
  getGV_BoMon,
  getNamHoc_HocKiNienKhoaController,
};
