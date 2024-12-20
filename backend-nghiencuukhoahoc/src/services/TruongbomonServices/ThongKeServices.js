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

    console.log("results: ", results[0]);
    console.log("ThongKe: ", ThongKe);

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


module.exports = {
  selectBieuDoTron,
};
