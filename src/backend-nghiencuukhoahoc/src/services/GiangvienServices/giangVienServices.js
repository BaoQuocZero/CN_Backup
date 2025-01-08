const pool = require("../../config/database");

const getPhanCongGV_MAGV = async (MAGV) => {
    try {
        const [results1, fields] = await pool.execute(
            `
        SELECT gv.MAGV, bpc.*, ctpc.*, mh.*, l.* FROM giangvien gv
        JOIN bangphancong bpc ON bpc.MAGV = gv.MAGV
        JOIN hockynienkhoa hknk ON bpc.MAHKNK = hknk.MAHKNK
        JOIN chitietphancong ctpc ON ctpc.MAPHANCONG = bpc.MAPHANCONG
        JOIN monhoc mh ON mh.MAMONHOC = ctpc.MAMONHOC
        JOIN lop l ON l.MALOP = ctpc.MALOP
        WHERE gv.MAGV = ?
        `,
            [MAGV]
        );

        return {
            EM: "Xem thông tin tất cả tên khung giờ chuẩn theo tên chức danh thành công",
            EC: 1,
            DT: results1,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "lỗi services getPhanCongGV_MAGV",
            EC: -1,
            DT: [],
        };
    }
};

module.exports = {
    getPhanCongGV_MAGV,
};