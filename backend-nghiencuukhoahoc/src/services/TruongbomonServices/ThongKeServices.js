const pool = require("../../config/database");
const moment = require("moment");
const e = require("express");

const selectBieuDoTron = async (MABOMON, MANAMHOC) => {
  try {
    let [results, fields1] = await pool.execute(
      `
      SELECT 
        gv.MAGV,
        gv.TENGV,
        nh.MANAMHOC,
        nh.TENNAMHOC,
        l.MALOP,
        l.TENLOP,
        l.SISO,
        kgc.GIOGIANGDAY_HANHCHINH, 
        SUM(mh.SOTINCHILYTHUYET) AS TONG_SOTINCHILYTHUYET, 
        SUM(mh.SOTINCHITHUCHANH) AS TONG_SOTINCHITHUCHANH,
        (SUM(mh.SOTINCHILYTHUYET * 30) + SUM(mh.SOTINCHITHUCHANH * 15) * 2) AS TongSoGio
    FROM 
        bomon bm
    JOIN 
        giangvien gv ON gv.MABOMON = bm.MABOMON
    JOIN 
        chon_khung ON chon_khung.MAGV = gv.MAGV
    JOIN 
        khunggiochuan kgc ON kgc.MAKHUNG = chon_khung.MAKHUNG
    JOIN 
        namhoc nh ON nh.MANAMHOC = chon_khung.MANAMHOC
    JOIN 
        bangphancong bpc ON bpc.MAGV = gv.MAGV
    JOIN 
        hockynienkhoa hknk ON hknk.MAHKNK = bpc.MAHKNK
    JOIN 
        chitietphancong ctpc ON ctpc.MAPHANCONG = bpc.MAPHANCONG
    JOIN 
        monhoc mh ON mh.MAMONHOC = ctpc.MAMONHOC
    JOIN 
        lop l ON l.MALOP = ctpc.MALOP
    WHERE 
        bm.MABOMON = ? 
        AND nh.MANAMHOC = ?
    GROUP BY 
        gv.MAGV,
        gv.TENGV,
        nh.MANAMHOC,
        nh.TENNAMHOC,
        l.MALOP,
        l.TENLOP,
        l.SISO
    ORDER BY 
        gv.MAGV ASC;
      `,
      [MABOMON, MANAMHOC]
    );

    // Tính tổng GIOGIANGDAY_HANHCHINH và TongSoGio
    let totalGioGiangDay = 0;
    let totalTongSoGio = 0;

    results.forEach((item) => {
      totalGioGiangDay += Number(item.GIOGIANGDAY_HANHCHINH) || 0;
      totalTongSoGio += Number(item.TongSoGio) || 0;
    });

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
    const [results] = await pool.execute(
      `
      SELECT 
          COUNT(DISTINCT CASE WHEN bpc.MAGV IS NOT NULL THEN gv.MAGV END) AS SoGiangVienCoTrongBangPhanCong,
          COUNT(DISTINCT CASE WHEN bpc.MAGV IS NULL THEN gv.MAGV END) AS SoGiangVienKhongCoTrongBangPhanCong,
          COUNT(DISTINCT gv.MAGV) AS TongSoGiangVienThuocBoMon
      FROM 
          giangvien gv
      LEFT JOIN bangphancong bpc ON bpc.MAGV = gv.MAGV
      LEFT JOIN hockynienkhoa hknk ON hknk.MAHKNK = bpc.MAHKNK
      WHERE 
          gv.MABOMON = ? AND (hknk.MAHKNK = ? OR hknk.MAHKNK IS NULL);
      `,
      [MABOMON, MAHKNK]
    );

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

module.exports = {
  selectBieuDoTron,
  selectBieuDo_PhanCong,

};
