const {
    getBieuDo_GioGiang,
    getBieuDo_GioGiangChonKhung,
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
        let results = await getBieuDo_GioGiangChonKhung(MAGV);

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
};