const {
    getBieuDo_GioGiang,
    getBieuDo_GioGiangChonKhung,
    getPhanCongGV_MAGV,
    getHinhThucDanhGia,
    createBaoCaoKetThuc,
    getNamHoc_HocKiNienKhoa,
} = require("../../services/GiangvienServices/ThongKeServices");

const getBieuDo_GioGiangControler = async (req, res) => {
    try {
        const MAGV = req.body.MAGV;
        let results = await getBieuDo_GioGiang(MAGV);

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

const getBieuDo_GioGiangChonKhungController = async (req, res) => {
    try {
        const MAGV = req.body.MAGV;
        const SelectNamHoc_HocKiNienKhoa = req.body.SelectNamHoc_HocKiNienKhoa;
        let results = await getBieuDo_GioGiangChonKhung(MAGV, SelectNamHoc_HocKiNienKhoa);

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

const getPhanCongGV_MAGV_Controller = async (req, res) => {
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

const getHinhThucDanhGiaController = async (req, res) => {
    try {
        let results = await getHinhThucDanhGia();

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

const createBaoCaoKetThucController = async (req, res) => {
    try {
        let results = await createBaoCaoKetThuc(req.body.fromKetThuc);

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
    getBieuDo_GioGiangControler,
    getBieuDo_GioGiangChonKhungController,
    getPhanCongGV_MAGV_Controller,
    getHinhThucDanhGiaController,
    createBaoCaoKetThucController,
    getNamHoc_HocKiNienKhoaController,
};