const pool = require("../../config/database");
const axios = require("axios");

const Lay_GV_DaiDien_Thuoc_BoMon = async (MABOMON) => {
    try {
        let [giangvien] = await pool.execute(
            `
            SELECT
            bomon.*,
            giangvien.* 
            FROM bomon
            JOIN giangvien ON giangvien.MABOMON = bomon.MABOMON
            WHERE bomon.MABOMON = ?
            `,
            [MABOMON]
        );
        if (!giangvien || giangvien.length === 0) {
            return {
                EM: "Không có giảng viên nào thuộc bộ môn này",
                EC: 0,
                DT: [],
            };
        }

        return {
            EM: "Lấy dữ liệu thành công",
            EC: 1,
            DT: giangvien,
        };
    } catch (error) {
        console.error("Lỗi Lay_BoMon_Thuoc_Khoa: ", error);
        return {
            EM: "Lỗi Lay_BoMon_Thuoc_Khoa",
            EC: -1,
            DT: [],
        };
    }
};

const Lay_BoMon_Thuoc_Khoa = async (MAGV) => {
    try {
        let [giangvien] = await pool.execute(
            `
        SELECT 
            khoa.*,
            bomon.*,
            giangvien.*
        FROM giangvien 
        JOIN bomon ON bomon.MABOMON = giangvien.MABOMON
        JOIN khoa ON khoa.MAKHOA = bomon.MAKHOA
        WHERE giangvien.MAGV = ?
            `,
            [MAGV]
        );
        if (!giangvien || giangvien.length === 0) {
            return {
                EM: "Không có giảng viên này",
                EC: 0,
                DT: [],
            };
        }

        let [bomon] = await pool.execute(
            `
        SELECT 
            khoa.*,
            bomon.*
        FROM khoa 
        JOIN bomon ON bomon.MAKHOA = khoa.MAKHOA
        WHERE khoa.MAKHOA = ?
            `,
            [giangvien[0].MAKHOA]
        );
        if (!bomon || bomon.length === 0) {
            return {
                EM: "Khoa không có bộ môn nào",
                EC: 0,
                DT: [],
            };
        }

        return {
            EM: "Lấy dữ liệu thành công",
            EC: 1,
            DT: bomon,
        };
    } catch (error) {
        console.error("Lỗi Lay_BoMon_Thuoc_Khoa: ", error);
        return {
            EM: "Lỗi Lay_BoMon_Thuoc_Khoa",
            EC: -1,
            DT: [],
        };
    }
};

const Lay_NamHoc_HocKyNienKhoa = async () => {
    try {

        let [namHoc_HocKyNienKhoa] = await pool.execute(
            `
            SELECT 
            namhoc.*,
            hockynienkhoa.* 
            FROM hockynienkhoa 
            JOIN namhoc ON namhoc.TENNAMHOC = hockynienkhoa.TEN_NAM_HOC
            ORDER BY hockynienkhoa.NGAYBATDAUNIENKHOA DESC
            `
        );

        return {
            EM: "Lấy dữ liệu thành công",
            EC: 1,
            DT: namHoc_HocKyNienKhoa,
        };
    } catch (error) {
        console.error("Lỗi Lay_BoMon_Thuoc_Khoa: ", error);
        return {
            EM: "Lỗi Lay_BoMon_Thuoc_Khoa",
            EC: -1,
            DT: [],
        };
    }
};

const Lay_BieuDo_GioDay_KhungChuan = async (MAGV) => {
    try {
        let [giangvien] = await pool.execute(
            `
        SELECT 
            khoa.*,
            bomon.*,
            giangvien.*
        FROM giangvien 
        JOIN bomon ON bomon.MABOMON = giangvien.MABOMON
        JOIN khoa ON khoa.MAKHOA = bomon.MAKHOA
        WHERE giangvien.MAGV = ?
            `,
            [MAGV]
        );
        if (!giangvien || giangvien.length === 0) {
            return {
                EM: "Không có giảng viên này",
                EC: 0,
                DT: [],
            };
        }

        let [TONG_GIO_HANH_CHINH] = await pool.execute(
            `
        SELECT 
            khoa.MAKHOA, khoa.TENKHOA,
            namhoc.MANAMHOC, namhoc.TENNAMHOC,
            SUM(IFNULL(khunggiochuan.GIOGIANGDAY_HANHCHINH, 0)) AS TONG_GIO_HANH_CHINH
        FROM giangvien 
        JOIN bomon ON bomon.MABOMON = giangvien.MABOMON
        JOIN khoa ON khoa.MAKHOA = bomon.MAKHOA
        JOIN chon_khung ON  chon_khung.MAGV = giangvien.MAGV
        JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
        JOIN khunggiochuan ON khunggiochuan.MAKHUNG = chon_khung.MAKHUNG
        WHERE khoa.MAKHOA = ?
        GROUP BY namhoc.MANAMHOC, namhoc.TENNAMHOC
        ORDER BY namhoc.TENNAMHOC ASC
            `,
            [giangvien[0].MAKHOA]
        );

        let [GIO_PHAN_CONG] = await pool.execute(
            `
            SELECT 
            hockynienkhoa.TEN_NAM_HOC, 
            namhoc.MANAMHOC, namhoc.TENNAMHOC,
            SUM(IFNULL(chitietphancong.TONG_SO_GIO, 0)) AS TONG_SO_GIO
            FROM bangphancong
            LEFT JOIN hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
            LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
            LEFT JOIN namhoc ON namhoc.TENNAMHOC = hockynienkhoa.TEN_NAM_HOC
            GROUP BY hockynienkhoa.TEN_NAM_HOC
            `
        );
        // console.log("TONG_GIO_HANH_CHINH: ", TONG_GIO_HANH_CHINH)
        // console.log("GIO_PHAN_CONG: ", GIO_PHAN_CONG)

        // Gộp TONG_GIO_HANH_CHINH và GIO_PHAN_CONG dựa trên TENNAMHOC/TEN_NAM_HOC
        const mergedData = TONG_GIO_HANH_CHINH.map(item => {
            const matchingData = GIO_PHAN_CONG.find(
                gc => Number(gc.MANAMHOC) === Number(item.MANAMHOC) // Chuyển đổi cả hai giá trị về kiểu số
            );
            return {
                ...item,
                TONG_SO_GIO: matchingData ? matchingData.TONG_SO_GIO : 0
            };
        });

        // console.log("Merged Data: ", mergedData);
        // Sắp xếp dữ liệu từ năm cũ đến năm mới
        // const sortedData = mergedData.sort((a, b) => a.MANAMHOC - b.MANAMHOC);

        // console.log("Sorted Merged Data: ", sortedData);
        return {
            EM: "Lấy dữ liệu thành công",
            EC: 1,
            DT: mergedData,
        };
    } catch (error) {
        console.error("Lỗi Lay_BieuDo_GioDay_KhungChuan: ", error);
        return {
            EM: "Lỗi Lay_BieuDo_GioDay_KhungChuan",
            EC: -1,
            DT: [],
        };
    }
};

const Lay_BieuDo_Theo_BoMon_NamHoc = async (MABOMON, MAHKNK) => {
    try {
        if (!MABOMON || !MAHKNK || MABOMON.length === 0 || MAHKNK.length === 0) {
            return {
                EM: "Dữ liệu không hợp lệ",
                EC: 0,
                DT: [],
            };
        }

        let [namhoc] = await pool.execute(
            `
            SELECT 
            namhoc.MANAMHOC, namhoc.TENNAMHOC
            FROM hockynienkhoa 
            JOIN namhoc ON namhoc.TENNAMHOC = hockynienkhoa.TEN_NAM_HOC
            WHERE hockynienkhoa.MAHKNK = ?
            `,
            [MAHKNK]
        );

        if (!namhoc || namhoc.length === 0) {
            return {
                EM: "Không tìm thấy năm học",
                EC: 0,
                DT: [],
            };
        }

        let [khunggiochuan] = await pool.execute(
            `
            SELECT 
            bomon.MABOMON, bomon.TENBOMON,
            namhoc.MANAMHOC, namhoc.TENNAMHOC,
            SUM(khunggiochuan.GIOGIANGDAY_HANHCHINH) AS GIOGIANGDAY_HANHCHINH
            FROM bomon 
            JOIN giangvien ON giangvien.MABOMON = bomon.MABOMON
            JOIN chon_khung ON chon_khung.MAGV = giangvien.MAGV
            JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
            JOIN khunggiochuan ON khunggiochuan.MAKHUNG = chon_khung.MAKHUNG
            WHERE bomon.MABOMON = ? AND namhoc.MANAMHOC = ?
            GROUP BY 
            bomon.MABOMON, bomon.TENBOMON,
            namhoc.MANAMHOC, namhoc.TENNAMHOC
            `,
            [MABOMON, namhoc[0].MANAMHOC]
        );

        let [TONG_SO_GIO] = await pool.execute(
            `
            SELECT 
            bomon.MABOMON, bomon.TENBOMON,
            namhoc.MANAMHOC, namhoc.TENNAMHOC,
            SUM(chitietphancong.TONG_SO_GIO) AS TONG_SO_GIO
            FROM bomon 
            JOIN giangvien ON giangvien.MABOMON = bomon.MABOMON
            JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
            JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
            JOIN hockynienkhoa ON hockynienkhoa.MAHKNK =  bangphancong.MAHKNK
            JOIN namhoc ON namhoc.TENNAMHOC = hockynienkhoa.TEN_NAM_HOC
            WHERE bomon.MABOMON = ? AND namhoc.MANAMHOC = ?
            GROUP BY 
            bomon.MABOMON, bomon.TENBOMON,
            namhoc.MANAMHOC, namhoc.TENNAMHOC
            `,
            [MABOMON, namhoc[0].MANAMHOC]
        );
        console.log("khunggiochuan: ", khunggiochuan)
        console.log("TONG_SO_GIO: ", TONG_SO_GIO)
        const mergedData = khunggiochuan.map(item => {
            const matchingData = TONG_SO_GIO.find(
                tg => tg.MABOMON === item.MABOMON && tg.MANAMHOC === item.MANAMHOC
            );
            return {
                ...item,
                TONG_SO_GIO: matchingData ? matchingData.TONG_SO_GIO : 0, // Gán giá trị TONG_SO_GIO hoặc 0 nếu không tìm thấy
            };
        });

        console.log("Merged Data: ", mergedData);

        return {
            EM: "Lấy dữ liệu thành công",
            EC: 1,
            DT: mergedData,
        };
    } catch (error) {
        console.error("Lỗi Lay_BieuDo_Theo_BoMon_NamHoc: ", error);
        return {
            EM: "Lỗi Lay_BieuDo_Theo_BoMon_NamHoc",
            EC: -1,
            DT: [],
        };
    }
};

const Lay_GVKhoa = async (MAGV) => {
    try {
        let [khoa] = await pool.execute(
            `
        SELECT 
        khoa.*,
        bomon.*,
        giangvien.*
        FROM giangvien
        JOIN bomon ON bomon.MABOMON = giangvien.MABOMON
        JOIN khoa ON khoa.MAKHOA = bomon.MAKHOA
        WHERE giangvien.MAGV = ?
            `,
            [MAGV]
        );
        if (!MAGV || khoa.length === 0) {
            return {
                EM: "Dữ liệu không hợp lệ",
                EC: 0,
                DT: [],
            };
        }

        let [giangvien_Khoa] = await pool.execute(
            `
            SELECT 
            khoa.*,
            bomon.*,
            giangvien.*,
            taikhoan.*,
            chucvu.*,
            chucdanh.*
            FROM khoa 
            JOIN bomon ON bomon.MAKHOA = khoa.MAKHOA
            JOIN giangvien ON giangvien.MABOMON = bomon.MABOMON
            LEFT JOIN taikhoan ON taikhoan.MAGV = giangvien.MAGV
            LEFT JOIN giu_chuc_vu ON giu_chuc_vu.MAGV = giangvien.MAGV
            LEFT JOIN chucvu ON chucvu.MACHUCVU = giu_chuc_vu.MACHUCVU
            LEFT JOIN co_chuc_danh ON co_chuc_danh.MAGV = giangvien.MAGV
            LEFT JOIN chucdanh ON chucdanh.MACHUCDANH = co_chuc_danh.MACHUCDANH
            WHERE khoa.MAKHOA = ?;
            `,
            [khoa[0].MAKHOA]
        );

        return {
            EM: "Lấy dữ liệu thành công",
            EC: 1,
            DT: giangvien_Khoa,
        };
    } catch (error) {
        console.error("Lỗi Lay_BieuDo_Theo_BoMon_NamHoc: ", error);
        return {
            EM: "Lỗi Lay_BieuDo_Theo_BoMon_NamHoc",
            EC: -1,
            DT: [],
        };
    }
};

module.exports = {
    Lay_GV_DaiDien_Thuoc_BoMon,
    Lay_BieuDo_GioDay_KhungChuan,

    Lay_BoMon_Thuoc_Khoa,
    Lay_NamHoc_HocKyNienKhoa,
    Lay_BieuDo_Theo_BoMon_NamHoc,
    Lay_GVKhoa,
};
