const pool = require("../../config/database");

const selectBieuDoTron = async (MABOMON, MAHKNK) => {
  try {
    let [namhoc] = await pool.execute(
      `
      SELECT namhoc.* 
      FROM hockynienkhoa 
      JOIN namhoc ON namhoc.TENNAMHOC = hockynienkhoa.TEN_NAM_HOC
      WHERE hockynienkhoa.MAHKNK = ?
      `,
      [MAHKNK]
    );

    let [GIOGIANGDAY_HANHCHINH] = await pool.execute(
      `
      SELECT 
      SUM(khunggiochuan.GIOGIANGDAY_HANHCHINH) AS GIOGIANGDAY_HANHCHINH
      FROM giangvien 
      JOIN bomon ON bomon.MABOMON = giangvien.MABOMON
      JOIN chon_khung ON chon_khung.MAGV = giangvien.MAGV
      JOIN khunggiochuan ON khunggiochuan.MAKHUNG = chon_khung.MAKHUNG
      JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
      WHERE bomon.MABOMON = ? AND namhoc.MANAMHOC = ?
      `,
      [MABOMON, namhoc[0].MANAMHOC ? namhoc[0].MANAMHOC : 0]
    );

    let [TONG_SO_GIO] = await pool.execute(
      `
      SELECT 
      SUM(chitietphancong.TONG_SO_GIO) AS TONG_SO_GIO
      FROM giangvien 
      JOIN bomon ON bomon.MABOMON = giangvien.MABOMON
      JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
      JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
      JOIN hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
      WHERE bomon.MABOMON = ? AND hockynienkhoa.TEN_NAM_HOC = ?
      `,
      [MABOMON, namhoc[0].TENNAMHOC ? namhoc[0].TENNAMHOC : 0]
    );

    // Truy cập giá trị cụ thể và chuyển đổi sang kiểu số
    let totalGioGiangDay = GIOGIANGDAY_HANHCHINH[0]?.GIOGIANGDAY_HANHCHINH
      ? parseInt(GIOGIANGDAY_HANHCHINH[0].GIOGIANGDAY_HANHCHINH, 10)
      : 0;

    let totalTongSoGio = TONG_SO_GIO[0]?.TONG_SO_GIO
      ? parseInt(TONG_SO_GIO[0].TONG_SO_GIO, 10)
      : 0;

    const ThongKe = {
      TotalGioGiangDay: totalGioGiangDay, //Giờ hành chính
      TotalTongSoGio: totalTongSoGio, //Giờ thực dạy
    };

    return {
      EM: "Xem biểu đồ tròn thành công",
      EC: 1,
      DT: ThongKe,
    };
  } catch (error) {
    return {
      EM: "Lỗi services select_giangvien_chuachonkhung",
      EC: -1,
      DT: [],
      ThongKe: null,
    };
  }
};

const selectBieuDo_PhanCong = async (MABOMON, MAHKNK) => {
  try {
    const [TongSoGiangVienThuocBoMon] = await pool.execute(
      `
      SELECT 
      COUNT(DISTINCT gv.MAGV) AS TongSoGiangVienThuocBoMon
      FROM 
      giangvien gv
      WHERE 
      gv.MABOMON = ?
      `,
      [MABOMON]
    );

    const [SoGiangVienCoTrongBangPhanCong] = await pool.execute(
      `
      SELECT 
      COUNT(DISTINCT ctpc.MACHITIETPHANCONG) AS SoGiangVienCoTrongBangPhanCong
      FROM 
      giangvien gv
      JOIN bomon ON bomon.MABOMON = gv.MABOMON
      JOIN bangphancong bpc ON bpc.MAGV = gv.MAGV
      JOIN hockynienkhoa hknk ON hknk.MAHKNK = bpc.MAHKNK
      JOIN chitietphancong ctpc ON ctpc.MAPHANCONG = bpc.MAPHANCONG
      WHERE 
      gv.MABOMON = ? AND hknk.MAHKNK = ?
      `,
      [MABOMON, MAHKNK]
    );

    const tongSoGV = TongSoGiangVienThuocBoMon[0]?.TongSoGiangVienThuocBoMon || 0;
    const soGVCoTrongPC = SoGiangVienCoTrongBangPhanCong[0]?.SoGiangVienCoTrongBangPhanCong || 0;

    const results = {
      SoGiangVienCoTrongBangPhanCong: soGVCoTrongPC,
      SoGiangVienKhongCoTrongBangPhanCong: tongSoGV - soGVCoTrongPC,
      TongSoGiangVienThuocBoMon: tongSoGV,
    };

    return {
      EM: "Xem biểu đồ tròn phân công thành công",
      EC: 0,
      DT: results,
    };
  } catch (error) {
    return {
      EM: "Lỗi services selectBieuDo_PhanCong",
      EC: -1,
      DT: [],
    };
  }
};

const selectGV_Bomon = async (MABOMON, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const [results] = await pool.execute(
      `
SELECT 
    taikhoan.TENDANGNHAP, 
    taikhoan.PHANQUYEN, 
    taikhoan.TRANGTHAITAIKHOAN,
    giangvien.MAGV, 
    giangvien.TENGV, 
    giangvien.EMAIL,  
    giangvien.DIENTHOAI, 
    giangvien.DIACHI,
    chucvu.MACHUCVU, 
    chucvu.TENCHUCVU,
    chucdanh.MACHUCDANH, 
    chucdanh.TENCHUCDANH,
    bomon.MABOMON, 
    bomon.TENBOMON,
    COALESCE(SUM(chitietphancong.TONG_SO_GIO), 0) AS TONG_SO_GIO
FROM giangvien
LEFT JOIN co_chuc_danh ON co_chuc_danh.MAGV = giangvien.MAGV
LEFT JOIN giu_chuc_vu ON giu_chuc_vu.MAGV = giangvien.MAGV
LEFT JOIN chucdanh ON chucdanh.MACHUCDANH = co_chuc_danh.MACHUCDANH
LEFT JOIN chucvu ON chucvu.MACHUCVU = giu_chuc_vu.MACHUCVU
LEFT JOIN bomon ON bomon.MABOMON = giangvien.MABOMON
LEFT JOIN taikhoan ON taikhoan.MAGV = giangvien.MAGV
LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
WHERE bomon.MABOMON = ?
GROUP BY 
    taikhoan.TENDANGNHAP, 
    taikhoan.PHANQUYEN, 
    taikhoan.TRANGTHAITAIKHOAN,
    giangvien.MAGV, 
    giangvien.TENGV, 
    giangvien.EMAIL,  
    giangvien.DIENTHOAI, 
    giangvien.DIACHI,
    chucvu.MACHUCVU, 
    chucvu.TENCHUCVU,
    chucdanh.MACHUCDANH, 
    chucdanh.TENCHUCDANH,
    bomon.MABOMON, 
    bomon.TENBOMON
ORDER BY giangvien.TENGV ASC;
      `,
      [MABOMON]
    );

    // Kiểm tra và thay thế MAGV nếu là null
    const processedResults = results.map(row => ({
      ...row,
      MAGV: row.MAGV ?? 'Không tìm thấy',  // Nếu MAGV là null, gán default_id
    }));

    return {
      EM: "Xem danh sách giảng viên thành công",
      EC: 0,
      DT: processedResults,
    };
  } catch (error) {
    return {
      EM: "Lỗi services selectGV_Bomon",
      EC: -1,
      DT: [],
    };
  }
};

const getNamHoc_HocKiNienKhoa = async () => {
  try {
    const [results] = await pool.execute(
      `
SELECT hockynienkhoa.*, namhoc.* 
FROM hockynienkhoa
JOIN namhoc ON namhoc.TENNAMHOC = hockynienkhoa.TEN_NAM_HOC
ORDER BY hockynienkhoa.NGAYBATDAUNIENKHOA ASC
          `
    );

    return {
      EM: "Lấy thông tin thành công",
      EC: 1,
      DT: results,
    };
  } catch (error) {
    console.log("error getNamHoc_HocKiNienKhoa >>>", error);
    return {
      EM: "Đã xảy ra lỗi trong quá trình lấy thông tin",
      EC: 0,
      DT: [],
    };
  }
};

module.exports = {
  selectBieuDoTron,
  selectBieuDo_PhanCong,
  selectGV_Bomon,
  getNamHoc_HocKiNienKhoa,
};
