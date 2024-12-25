const pool = require("../../config/database");

const getBieuDo_GioGiang = async (MAGV) => {

    try {
        const [results] = await pool.execute(
            `
        SELECT 
            giangvien.MAGV, 
            giangvien.TENGV,
            hockynienkhoa.MAHKNK, 
            hockynienkhoa.TENHKNK, 
            hockynienkhoa.TEN_NAM_HOC, 
            hockynienkhoa.NGAYBATDAUNIENKHOA,
            SUM(chitietphancong.TONG_SO_GIO) AS TONG_GIO
        FROM 
            giangvien
        JOIN 
            bangphancong ON bangphancong.MAGV = giangvien.MAGV
        JOIN 
            hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
        JOIN 
            chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
        WHERE giangvien.MAGV = 00242
        GROUP BY 
            giangvien.MAGV, 
            giangvien.TENGV,
            hockynienkhoa.MAHKNK, 
            hockynienkhoa.TENHKNK,
            hockynienkhoa.TEN_NAM_HOC,
            hockynienkhoa.NGAYBATDAUNIENKHOA
        ORDER BY 
            hockynienkhoa.NGAYBATDAUNIENKHOA ASC
        `,
            [MAGV]
        );

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: results,
        };
    } catch (error) {
        console.log("error getBieuDo_GioGiang >>>", error);
        return {
            EM: "Đã xảy ra lỗi trong quá trình lấy thông tin",
            EC: 0,
            DT: [],
        };
    }
};

const getBieuDo_GioGiangChonKhung = async (MAGV) => {

    try {
        const [results] = await pool.execute(
            `
        SELECT
            giangvien.MAGV,
            giangvien.TENGV,
            namhoc.MANAMHOC,
            namhoc.TENNAMHOC,
            khunggiochuan.GIOGIANGDAY_HANHCHINH,
            SUM(chitietphancong.TONG_SO_GIO) AS TONG_GIO
        FROM
            giangvien
        LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
        LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
        LEFT JOIN chon_khung ON chon_khung.MAGV = giangvien.MAGV
        LEFT JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
        LEFT JOIN khunggiochuan ON khunggiochuan.MAKHUNG = chon_khung.MAKHUNG
        WHERE
            giangvien.MAGV = ?
        GROUP BY
            giangvien.MAGV,
            giangvien.TENGV;
        `,
            [MAGV]
        );

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: results,
        };
    } catch (error) {
        console.log("error getBieuDo_GioGiangChonKhung >>>", error);
        return {
            EM: "Đã xảy ra lỗi trong quá trình lấy thông tin",
            EC: 0,
            DT: [],
        };
    }
};

module.exports = {
    getBieuDo_GioGiang,
    getBieuDo_GioGiangChonKhung,
};