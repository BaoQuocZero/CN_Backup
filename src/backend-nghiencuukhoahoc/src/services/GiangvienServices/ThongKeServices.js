const pool = require("../../config/database");

const getBieuDo_GioGiang = async (MAGV) => {

    try {

        const [resultsNamHoc] = await pool.execute(
            `
        SELECT * FROM hockynienkhoa
        `
        );

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
        LEFT JOIN 
            bangphancong ON bangphancong.MAGV = giangvien.MAGV
        LEFT JOIN 
            hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
        LEFT JOIN 
            chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
        WHERE giangvien.MAGV = ?
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

        const mergeResults = (resultsNamHoc, results) => {
            return resultsNamHoc.map((hocKy) => {
                const matchedResult = results.find((result) => result.MAHKNK === hocKy.MAHKNK);
                return {
                    ...hocKy,
                    MAGV: matchedResult?.MAGV || null,
                    TENGV: matchedResult?.TENGV || null,
                    TONG_GIO: matchedResult?.TONG_GIO || 0, // Mặc định là 0 nếu không có thông tin
                };
            });
        };

        // Gọi hàm mergeResults để kết hợp dữ liệu
        const mergedData = mergeResults(resultsNamHoc, results);

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: mergedData,
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

const getBieuDo_GioGiangChonKhung = async (MAGV, SelectNamHoc_HocKiNienKhoa) => {
    try {
        const [resultsKhungGio] = await pool.execute(
            `
        SELECT
            giangvien.MAGV,
            namhoc.TENNAMHOC,
            khunggiochuan.GIOGIANGDAY_HANHCHINH
        FROM
            giangvien
        LEFT JOIN chon_khung ON chon_khung.MAGV = giangvien.MAGV
        LEFT JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
        LEFT JOIN khunggiochuan ON khunggiochuan.MAKHUNG = chon_khung.MAKHUNG
        WHERE
            giangvien.MAGV = ? AND namhoc.TENNAMHOC = ?
        `,
            [MAGV, SelectNamHoc_HocKiNienKhoa]
        );

        const [resultsHocKiNienKhoa] = await pool.execute(
            `
        SELECT
            giangvien.MAGV,
            hockynienkhoa.*,
            SUM(chitietphancong.TONG_SO_GIO) AS TONG_GIO
        FROM
            giangvien
        LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
        LEFT JOIN hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
        LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
        WHERE
            giangvien.MAGV = ? AND hockynienkhoa.TEN_NAM_HOC = ?
        GROUP BY
            giangvien.MAGV,
            giangvien.TENGV;
        `,
            [MAGV, SelectNamHoc_HocKiNienKhoa]
        );

        // Gộp dữ liệu
        const combinedResults = [{
            MAGV: (resultsKhungGio[0] && resultsKhungGio[0].MAGV) || MAGV, // MAGV từ phần tử đầu tiên của resultsKhungGio, nếu không có lấy giá trị mặc định MAGV
            TENNAMHOC: SelectNamHoc_HocKiNienKhoa || 'Năm học chưa xác định', // SelectNamHoc_HocKiNienKhoa hoặc giá trị mặc định
            GIOGIANGDAY_HANHCHINH: resultsKhungGio[0]?.GIOGIANGDAY_HANHCHINH || 0, // GIOGIANGDAY_HANHCHINH từ phần tử đầu tiên của resultsKhungGio
            MAHKNK: (resultsHocKiNienKhoa[0] && resultsHocKiNienKhoa[0].MAHKNK) || 'Chưa xác định', // MAHKNK từ phần tử đầu tiên của resultsHocKiNienKhoa, nếu không có trả về 'Chưa xác định'
            TENHKNK: (resultsHocKiNienKhoa[0] && resultsHocKiNienKhoa[0].TENHKNK) || 'Chưa xác định', // TENHKNK từ phần tử đầu tiên của resultsHocKiNienKhoa
            NGAYBATDAUNIENKHOA: (resultsHocKiNienKhoa[0] && resultsHocKiNienKhoa[0].NGAYBATDAUNIENKHOA) || null, // NGAYBATDAUNIENKHOA từ phần tử đầu tiên của resultsHocKiNienKhoa
            TONG_GIO: (resultsHocKiNienKhoa[0] && resultsHocKiNienKhoa[0].TONG_GIO) || 0 // TONG_GIO từ phần tử đầu tiên của resultsHocKiNienKhoa
        }];

        // console.log("MAGV: ", MAGV);
        // console.log("SelectNamHoc_HocKiNienKhoa: ", SelectNamHoc_HocKiNienKhoa);
        // console.log("resultsKhungGio: ", resultsKhungGio);
        // console.log("resultsHocKiNienKhoa: ", resultsHocKiNienKhoa);
        // console.log("combinedResults: ", combinedResults);

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: combinedResults,
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

const getPhanCongGV_MAGV = async (MAGV) => {
    try {
        const [results] = await pool.execute(
            `
SELECT 
gv.*,
bpc.MAPHANCONG, bpc.THOIGIANLAP,
hknk.*,
ctpc.MACHITIETPHANCONG, ctpc.TONG_SO_GIO,
mh.MAMONHOC, mh.TENMONHOC,
l.MALOP, l.TENLOP,
bcktm.*,
htdg.*
FROM giangvien gv
LEFT JOIN bangphancong bpc ON bpc.MAGV = gv.MAGV
LEFT JOIN hockynienkhoa hknk ON hknk.MAHKNK = bpc.MAHKNK
LEFT JOIN chitietphancong ctpc ON ctpc.MAPHANCONG = bpc.MAPHANCONG
LEFT JOIN monhoc mh ON mh.MAMONHOC = ctpc.MAMONHOC
LEFT JOIN lop l ON l.MALOP = ctpc.MALOP
LEFT JOIN bao_cao_ket_thuc_mon bcktm ON bcktm.MACHITIETPHANCONG = ctpc.MACHITIETPHANCONG
LEFT JOIN hinhthucdanhgia htdg ON htdg.MADANHGIAKETTHUC = bcktm.MADANHGIAKETTHUC
WHERE gv.MAGV = ?
ORDER BY hknk.NGAYBATDAUNIENKHOA DESC;
        `,
            [MAGV]
        );

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: results,
        };
    } catch (error) {
        console.log("error getPhanCongGV_MAGV >>>", error);
        return {
            EM: "Đã xảy ra lỗi trong quá trình lấy thông tin",
            EC: 0,
            DT: [],
        };
    }
};

const getHinhThucDanhGia = async () => {
    try {
        const [results] = await pool.execute(
            `SELECT * FROM hinhthucdanhgia`
        );

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: results,
        };
    } catch (error) {
        console.log("error getHinhThucDanhGia >>>", error);
        return {
            EM: "Đã xảy ra lỗi trong quá trình lấy thông tin",
            EC: 0,
            DT: [],
        };
    }
};

const createBaoCaoKetThuc = async (dataKetThuc) => {
    try {
        const [resultsChiTietPhanCong] = await pool.execute(
            `
            SELECT chitietphancong.*
            FROM chitietphancong 
            JOIN bangphancong ON bangphancong.MAPHANCONG = chitietphancong.MAPHANCONG
            JOIN monhoc ON monhoc.MAMONHOC = chitietphancong.MAMONHOC
            JOIN lop ON lop.MALOP = chitietphancong.MALOP
            WHERE bangphancong.MAPHANCONG = ? AND monhoc.MAMONHOC = ? AND lop.MALOP = ?
            `,
            [dataKetThuc.MAPHANCONG, dataKetThuc.MAMONHOC, dataKetThuc.MALOP]
        );

        // Kiểm tra nếu không có kết quả chi tiết phân công
        if (resultsChiTietPhanCong.length === 0) {
            return {
                EM: "Không tìm thấy chi tiết phân công cho môn học này",
                EC: 0,
                DT: [],
            };
        }

        // Lấy giá trị MACHITIETPHANCONG từ kết quả truy vấn
        const MACHITIETPHANCONG = resultsChiTietPhanCong[0].MACHITIETPHANCONG;

        // Kiểm tra nếu báo cáo kết thúc môn đã tồn tại
        const [existingReport] = await pool.execute(
            `
            SELECT * FROM bao_cao_ket_thuc_mon
            WHERE MADANHGIAKETTHUC = ? AND MACHITIETPHANCONG = ?
            `,
            [dataKetThuc.MADANHGIAKETTHUC, MACHITIETPHANCONG]
        );

        if (existingReport.length > 0) {
            // Nếu báo cáo đã tồn tại, thực hiện UPDATE
            const [updateResult] = await pool.execute(
                `
                UPDATE bao_cao_ket_thuc_mon
                SET 
                    LANDANHGIA = ?,
                    NGAYDANHGIA = ?,
                    NGAYBAOCAOKETTHUC = ?,
                    TRANG_THAI_DANG_KY = ?
                WHERE MADANHGIAKETTHUC = ? AND MACHITIETPHANCONG = ?
                `,
                [
                    dataKetThuc.LANDANHGIA,         // LANDANHGIA
                    dataKetThuc.NGAYDANHGIA,        // NGAYDANHGIA
                    dataKetThuc.NGAYBAOCAOKETTHUC,  // NGAYBAOCAOKETTHUC
                    dataKetThuc.TRANG_THAI_DANG_KY, // TRANG_THAI_DANG_KY
                    dataKetThuc.MADANHGIAKETTHUC,    // MADANHGIAKETTHUC
                    MACHITIETPHANCONG               // MACHITIETPHANCONG
                ]
            );

            console.log("Update result: ", updateResult);

            return {
                EM: "Cập nhật báo cáo kết thúc môn học thành công",
                EC: 1,
                DT: updateResult,
            };
        } else {
            // Nếu báo cáo chưa tồn tại, thực hiện INSERT
            const [insertResult] = await pool.execute(
                `
                INSERT INTO bao_cao_ket_thuc_mon 
                (MADANHGIAKETTHUC, MACHITIETPHANCONG, LANDANHGIA, NGAYDANHGIA, NGAYBAOCAOKETTHUC, TRANG_THAI_DANG_KY)
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    dataKetThuc.MADANHGIAKETTHUC,    // MADANHGIAKETTHUC
                    MACHITIETPHANCONG,               // MACHITIETPHANCONG
                    dataKetThuc.LANDANHGIA,         // LANDANHGIA
                    dataKetThuc.NGAYDANHGIA,        // NGAYDANHGIA
                    dataKetThuc.NGAYBAOCAOKETTHUC,  // NGAYBAOCAOKETTHUC
                    dataKetThuc.TRANG_THAI_DANG_KY  // TRANG_THAI_DANG_KY
                ]
            );

            console.log("Insert result: ", insertResult);

            return {
                EM: "Lưu báo cáo kết thúc môn học thành công",
                EC: 1,
                DT: insertResult,
            };
        }
    } catch (error) {
        console.log("error createBaoCaoKetThuc >>>", error);
        return {
            EM: "Đã xảy ra lỗi trong quá trình tạo báo cáo kết thúc",
            EC: 0,
            DT: [],
        };
    }
};

const getNamHoc_HocKiNienKhoa = async () => {
    try {
        const [results] = await pool.execute(
            `
SELECT namhoc.* 
FROM hockynienkhoa
JOIN namhoc ON namhoc.TENNAMHOC = hockynienkhoa.TEN_NAM_HOC
GROUP BY namhoc.TENNAMHOC
ORDER BY hockynienkhoa.NGAYBATDAUNIENKHOA ASC
            `
        );

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: results,
        };
    } catch (error) {
        console.log("error getHinhThucDanhGia >>>", error);
        return {
            EM: "Đã xảy ra lỗi trong quá trình lấy thông tin",
            EC: 0,
            DT: [],
        };
    }
};

const getPhanCongGV_NamHoc = async (MAGV) => {
    try {
        const [results] = await pool.execute(
            `
SELECT 
gv.*,
bpc.MAPHANCONG, bpc.THOIGIANLAP,
hknk.*,
ctpc.MACHITIETPHANCONG, ctpc.TONG_SO_GIO,
mh.MAMONHOC, mh.TENMONHOC,
l.MALOP, l.TENLOP,
bcktm.*,
htdg.*
FROM giangvien gv
LEFT JOIN bangphancong bpc ON bpc.MAGV = gv.MAGV
LEFT JOIN hockynienkhoa hknk ON hknk.MAHKNK = bpc.MAHKNK
LEFT JOIN chitietphancong ctpc ON ctpc.MAPHANCONG = bpc.MAPHANCONG
LEFT JOIN monhoc mh ON mh.MAMONHOC = ctpc.MAMONHOC
LEFT JOIN lop l ON l.MALOP = ctpc.MALOP
LEFT JOIN bao_cao_ket_thuc_mon bcktm ON bcktm.MACHITIETPHANCONG = ctpc.MACHITIETPHANCONG
LEFT JOIN hinhthucdanhgia htdg ON htdg.MADANHGIAKETTHUC = bcktm.MADANHGIAKETTHUC
WHERE gv.MAGV = ?
ORDER BY hknk.NGAYBATDAUNIENKHOA DESC;
        `,
            [MAGV]
        );

        return {
            EM: "Lấy thông tin thành công",
            EC: 1,
            DT: results,
        };
    } catch (error) {
        console.log("error getPhanCongGV_MAGV >>>", error);
        return {
            EM: "Đã xảy ra lỗi trong quá trình lấy thông tin",
            EC: 0,
            DT: [],
        };
    }
};

const PhanCongGVThongKe = async (MAGV, SelectNamHoc_HocKiNienKhoa) => {
    try {




        const [results] = await pool.execute(
            `
SELECT
giangvien.MAGV,
hockynienkhoa.TEN_NAM_HOC, hockynienkhoa.TENHKNK, hockynienkhoa.NGAYBATDAUNIENKHOA,
monhoc.MAMONHOC, monhoc.TENMONHOC,
lop.MALOP, lop.TENLOP, lop.NAMTUYENSINH,
bao_cao_ket_thuc_mon.LANDANHGIA, bao_cao_ket_thuc_mon.NGAYDANHGIA, bao_cao_ket_thuc_mon.NGAYBAOCAOKETTHUC,
hinhthucdanhgia.MADANHGIAKETTHUC, hinhthucdanhgia.TENDANHGIA
FROM giangvien
LEFT JOIN chon_khung ON chon_khung.MAGV = giangvien.MAGV
LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
LEFT JOIN hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
LEFT JOIN monhoc ON monhoc.MAMONHOC = chitietphancong.MAMONHOC
LEFT JOIN lop ON lop.MALOP = chitietphancong.MALOP
LEFT JOIN bao_cao_ket_thuc_mon ON bao_cao_ket_thuc_mon.MACHITIETPHANCONG = chitietphancong.MACHITIETPHANCONG
LEFT JOIN hinhthucdanhgia ON hinhthucdanhgia.MADANHGIAKETTHUC = bao_cao_ket_thuc_mon.MADANHGIAKETTHUC
WHERE giangvien.MAGV = ? AND hockynienkhoa.TEN_NAM_HOC = ?
GROUP BY 
giangvien.MAGV,
hockynienkhoa.TEN_NAM_HOC, hockynienkhoa.TENHKNK, hockynienkhoa.NGAYBATDAUNIENKHOA,
monhoc.MAMONHOC, monhoc.TENMONHOC,
lop.MALOP, lop.TENLOP, lop.NAMTUYENSINH,
bao_cao_ket_thuc_mon.LANDANHGIA, bao_cao_ket_thuc_mon.NGAYDANHGIA, bao_cao_ket_thuc_mon.NGAYBAOCAOKETTHUC,
hinhthucdanhgia.MADANHGIAKETTHUC, hinhthucdanhgia.TENDANHGIA
ORDER BY hockynienkhoa.NGAYBATDAUNIENKHOA DESC
        `,
            [MAGV, SelectNamHoc_HocKiNienKhoa]
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
    getPhanCongGV_MAGV,
    getHinhThucDanhGia,
    createBaoCaoKetThuc,
    getNamHoc_HocKiNienKhoa,
    PhanCongGVThongKe,
};