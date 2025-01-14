const pool = require("../../config/database");
const moment = require("moment");
const createchitietphancong_excel = async (datachitietphancong) => {
  try {
    let results = [];
    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    for (var i = 0; i < datachitietphancong.length; i++) {
      let [results_magv, fields_magv] = await pool.execute(
        `select * from giangvien where TENGV = ?`,
        [datachitietphancong[i].TENGV]
      );

      console.log("check results_magv", results_magv);

      let [results_hknk, fields_hknk] = await pool.execute(
        `select * from hockynienkhoa where TENHKNK = ?`,
        [datachitietphancong[i].TENHKNK]
      );

      let [results_bangphancong, fields1] = await pool.execute(
        `select * from bangphancong where MAHKNK = ? and MAGV = ?`,
        [results_hknk[0].MAHKNK, results_magv[0].MAGV]
      );

      let [results_TENMONHOC, fields_TENMONHOC] = await pool.execute(
        `select * from monhoc where TENMONHOC = ?`,
        [datachitietphancong[i].TENMONHOC]
      );

      console.log("check mamonhoc", results_TENMONHOC);
      if (results_bangphancong.length === 0) {
        await pool.execute(
          `insert into bangphancong (MAHKNK,MAGV,THOIGIANLAP) values (?,?,?)`,
          [results_hknk[0].MAHKNK, results_magv[0].MAGV, currentTime]
        );
      }

      let [results_bangphancong_data, fields_data] = await pool.execute(
        `select * from bangphancong where MAHKNK = ? and MAGV = ?`,
        [results_hknk[0].MAHKNK, results_magv[0].MAGV]
      );

      await pool.execute(
        `INSERT INTO chitietphancong (MAMONHOC,MAPHANCONG,MALOP,TONG_SO_GIO) VALUES (?, ?,?,?)`,
        [
          results_TENMONHOC[0].MAMONHOC,
          results_bangphancong_data[0].MAPHANCONG,
          datachitietphancong[i].MALOP,
          datachitietphancong[i].THOIGIAN,
        ]
      );

      results.push({
        EM: `Tạo phân công thành công`,
        EC: 0,
        DT: [],
      });
    }

    return {
      EM: "Tất cả chi tiết đã được tạo",
      EC: 1,
      DT: results,
    };
  } catch (error) {
    console.log("Lỗi services createchitietphancong_excel", error);
    return {
      EM: "Lỗi services createTaiKhoanExcel",
      EC: -1,
      DT: [],
    };
  }
};

const Dangky_chitietphancong = async (datachitietphancong) => {
  try {
    // const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    // for (var i = 0; i < datachitietphancong.length; i++) {
    //   let [results_magv, fields_magv] = await pool.execute(
    //     `select * from giangvien where TENGV = ?`,
    //     [datachitietphancong[i].TENGV]
    //   );
    //   console.log("check results_magv", results_magv);
    //   let [results_hknk, fields_hknk] = await pool.execute(
    //     `select * from hockynienkhoa where TENHKNK = ?`,
    //     [datachitietphancong[i].TENHKNK]
    //   );
    //   let [results_bangphancong, fields1] = await pool.execute(
    //     `select * from bangphancong where MAHKNK = ? and MAGV = ?`,
    //     [results_hknk[0].MAHKNK, results_magv[0].MAGV]
    //   );
    //   let [results_TENMONHOC, fields_TENMONHOC] = await pool.execute(
    //     `select * from monhoc where TENMONHOC = ?`,
    //     [datachitietphancong[i].TENMONHOC]
    //   );
    //   console.log("check mamonhoc", results_TENMONHOC);
    //   if (results_bangphancong.length === 0) {
    //     await pool.execute(
    //       `insert into bangphancong (MAHKNK,MAGV,THOIGIANLAP) values (?,?,?)`,
    //       [results_hknk[0].MAHKNK, results_magv[0].MAGV, currentTime]
    //     );
    //   }
    //   let [results_bangphancong_data, fields_data] = await pool.execute(
    //     `select * from bangphancong where MAHKNK = ? and MAGV = ?`,
    //     [results_hknk[0].MAHKNK, results_magv[0].MAGV]
    //   );
    //   await pool.execute(
    //     `INSERT INTO chitietphancong (MAMONHOC,MAPHANCONG,MALOP) VALUES (?, ?,?)`,
    //     [
    //       results_TENMONHOC[0].MAMONHOC,
    //       results_bangphancong_data[0].MAPHANCONG,
    //       datachitietphancong[i].MALOP,
    //     ]
    //   );
    //   results.push({
    //     EM: `Tạo phân công thành công`,
    //     EC: 0,
    //     DT: [],
    //   });
    // }
    // return {
    //   EM: "Tất cả chi tiết đã được tạo",
    //   EC: 1,
    //   DT: results,
    // };
  } catch (error) {
    console.log("Lỗi services createchitietphancong_excel", error);
    return {
      EM: "Lỗi services createTaiKhoanExcel",
      EC: -1,
      DT: [],
    };
  }
};

const xem_chitietphancong_giangvien = async (MAHKNK) => {
  try {
    let [results_chitietphancong_data, fields_data] = await pool.execute(
      `select chitietphancong.*,bangphancong.*,monhoc.*,giangvien.*,chon_khung.*,khunggiochuan.*,hockynienkhoa.* from hockynienkhoa,chitietphancong,bangphancong,monhoc,giangvien,chon_khung,khunggiochuan where giangvien.MAGV = chon_khung.MAGV and hockynienkhoa.MAHKNK = bangphancong.MAHKNK and chon_khung.MAKHUNG = khunggiochuan.MAKHUNG and  giangvien.MAGV = bangphancong.MAGV and chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG and monhoc.MAMONHOC = chitietphancong.MAMONHOC 
      and hockynienkhoa.MAHKNK = ?`,
      [MAHKNK]
    );

    const danhSachPhanCongGiangVien = [];

    results_chitietphancong_data.forEach((dong) => {
      let giangVien = danhSachPhanCongGiangVien.find(
        (gv) => gv.TENGV === dong.TENGV
      );

      if (!giangVien) {
        giangVien = {
          MAGV: dong.MAGV,
          TENGV: dong.TENGV,
          GIOGIANGDAY_CHUAN: dong.GIOGIANGDAY_CHUAN,
          monPhanCong: [],
        };
        danhSachPhanCongGiangVien.push(giangVien);
      }

      let monHoc = giangVien.monPhanCong.find((m) => m.mon === dong.TENMONHOC);

      if (!monHoc) {
        monHoc = {
          TENMONHOC: dong.TENMONHOC,
          TENHKNK: dong.TENHKNK,
          TEN_NAM_HOC: dong.TEN_NAM_HOC,
          SO_GIO: dong.TONG_SO_GIO,
          MALOP: [],
        };
        giangVien.monPhanCong.push(monHoc);
      }

      if (!monHoc.MALOP.includes(dong.MALOP)) {
        monHoc.MALOP.push(dong.MALOP);
      }
    });
    return {
      EM: "xem thông tin phân công thành công",
      EC: 1,
      DT: danhSachPhanCongGiangVien,
    };
  } catch (error) {
    console.log("Lỗi services createchitietphancong_excel", error);
    return {
      EM: "Lỗi services createTaiKhoanExcel",
      EC: -1,
      DT: [],
    };
  }
};

const xem_chitietphancong_lop = async () => {
  try {
    let [results_chitietphancong_data, fields_data] = await pool.execute(
      `select chitietphancong.*,bangphancong.*,monhoc.*,giangvien.*,chon_khung.*,khunggiochuan.* from chitietphancong,bangphancong,monhoc,giangvien,chon_khung,khunggiochuan where giangvien.MAGV = chon_khung.MAGV and chon_khung.MAKHUNG = khunggiochuan.MAKHUNG and  giangvien.MAGV = bangphancong.MAGV and chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG and monhoc.MAMONHOC = chitietphancong.MAMONHOC`
    );

    const danhSachPhanCongGiangVien_banthan = [];

    results_chitietphancong_data.forEach((dong) => {
      let MaLop = danhSachPhanCongGiangVien_banthan.find(
        (lop) => lop.MALOP === dong.MALOP
      );

      if (!MaLop) {
        MaLop = {
          MALOP: dong.MALOP,
          monPhanCong: [],
        };
        danhSachPhanCongGiangVien_banthan.push(MaLop);
      }

      let monHoc = MaLop.monPhanCong.find(
        (m) => m.TENMONHOC === dong.TENMONHOC
      );

      if (!monHoc) {
        monHoc = {
          TENMONHOC: dong.TENMONHOC,
          TENHKNK: dong.TENHKNK,
          TEN_NAM_HOC: dong.TEN_NAM_HOC,
          TENGV: [],
        };
        MaLop.monPhanCong.push(monHoc);
      }

      if (!monHoc.TENGV.includes(dong.TENGV)) {
        monHoc.TENGV.push({ MAGV: dong.MAGV, TENGV: dong.TENGV });
      }
    });
    return {
      EM: "xem thông tin phân công thành công",
      EC: 1,
      DT: danhSachPhanCongGiangVien_banthan,
    };
  } catch (error) {
    console.log("Lỗi services createchitietphancong_excel", error);
    return {
      EM: "Lỗi services createTaiKhoanExcel",
      EC: -1,
      DT: [],
    };
  }
};

const xem_chitietphancong_banthan = async (MAGV, MAHKNK) => {
  try {
    let [results_hknk, fields_hknk] = await pool.execute(
      `select TEN_NAM_HOC from hockynienkhoa where MAHKNK = ?
`,
      [MAHKNK]
    );

    let [results_namhoc, fields_namhoc] = await pool.execute(
      `select TENNAMHOC from namhoc where TENNAMHOC = ?
`,
      [results_hknk[0].TEN_NAM_HOC]
    );

    let results_chitietphancong_data = [];

    if (results_namhoc[0].TENNAMHOC === results_hknk[0].TEN_NAM_HOC) {
      results_chitietphancong_data = await pool.execute(
        `SELECT chitietphancong.*, 
         bangphancong.*, 
         monhoc.*, 
         giangvien.*, 
         chon_khung.*, 
         khunggiochuan.*, 
         hockynienkhoa.*, 
         lop.*, 
         bao_cao_ket_thuc_mon.*, 
         hinhthucdanhgia.*
  FROM hockynienkhoa
  LEFT JOIN bangphancong ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
  LEFT JOIN chitietphancong ON bangphancong.MAPHANCONG = chitietphancong.MAPHANCONG
  LEFT JOIN monhoc ON chitietphancong.MAMONHOC = monhoc.MAMONHOC
  LEFT JOIN giangvien ON bangphancong.MAGV = giangvien.MAGV
  LEFT JOIN chon_khung ON giangvien.MAGV = chon_khung.MAGV
  LEFT JOIN khunggiochuan ON chon_khung.MAKHUNG = khunggiochuan.MAKHUNG
  LEFT JOIN lop ON chitietphancong.MALOP = lop.MALOP
  LEFT JOIN bao_cao_ket_thuc_mon ON chitietphancong.MACHITIETPHANCONG = bao_cao_ket_thuc_mon.MACHITIETPHANCONG
  LEFT JOIN hinhthucdanhgia ON bao_cao_ket_thuc_mon.MADANHGIAKETTHUC = hinhthucdanhgia.MADANHGIAKETTHUC
  LEFT JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
  WHERE namhoc.TENNAMHOC = ?
  AND giangvien.MAGV = ?
  and hockynienkhoa.MAHKNK = ?;
  `,
        [results_namhoc[0].TENNAMHOC, MAGV, MAHKNK]
      );
    }

    const danhSachPhanCongGiangVien = [];

    results_chitietphancong_data[0].forEach((dong) => {
      let Monhoc = danhSachPhanCongGiangVien.find(
        (mon) => mon.MAMONHOC === dong.MAMONHOC
      );

      if (!Monhoc) {
        Monhoc = {
          TENMONHOC: dong.TENMONHOC,
          THOI_LUONG_MON_HOC: dong.TONG_SO_GIO,
          TENHKNK: dong.TENHKNK,
          CHITIET_LOP: [],
        };
        danhSachPhanCongGiangVien.push(Monhoc);
      }

      let lophoc = Monhoc.CHITIET_LOP.find((m) => m.MALOP === dong.MALOP);

      if (!lophoc) {
        lophoc = {
          MALOP: dong.MALOP,
          TENLOP: dong.TENLOP,
          NAMTUYENSINH: dong.NAMTUYENSINH,
          SISO: dong.SISO,
          LANDANHGIA: dong.LANDANHGIA,
          NGAYDANHGIA: dong.NGAYDANHGIA,
          NGAYBAOCAOKETTHUC: dong.NGAYBAOCAOKETTHUC,
          TENDANHGIA: dong.TENDANHGIA,
          TRANG_THAI_DANG_KY: dong.TRANG_THAI_DANG_KY,
        };
        Monhoc.CHITIET_LOP.push(lophoc);
      }

      // if (!monHoc.TENGV.includes(dong.TENGV)) {
      //   monHoc.TENGV.push({ MAGV: dong.MAGV, TENGV: dong.TENGV });
      // }
    });

    return {
      EM: "xem thông tin phân công thành công",
      EC: 1,
      DT: danhSachPhanCongGiangVien,
    };
  } catch (error) {
    console.log("Lỗi services createchitietphancong_excel", error);
    return {
      EM: "Lỗi services createTaiKhoanExcel",
      EC: -1,
      DT: [],
    };
  }
};

const xem_giophancong_giangvienkhac = async (MAHKNK) => {
  try {

    let [results_namhoc] = await pool.execute(
      `
SELECT * FROM hockynienkhoa WHERE MAHKNK = ?
  `,
      [MAHKNK]
    );
    // console.log("results_namhoc: ", results_namhoc)
    // console.log("results_namhoc.TEN_NAM_HOC: ", results_namhoc[0].TEN_NAM_HOC)
    let [results_KhungChuan] = await pool.execute(
      `
SELECT 
giangvien.MAGV,
khunggiochuan.GIOGIANGDAY_HANHCHINH
FROM giangvien
LEFT JOIN chon_khung ON chon_khung.MAGV = giangvien.MAGV
LEFT JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
LEFT JOIN khunggiochuan ON khunggiochuan.MAKHUNG = chon_khung.MAKHUNG
WHERE namhoc.TENNAMHOC = "Năm học 2020 - 2021" OR namhoc.TENNAMHOC IS NULL;
  `, [results_namhoc[0].TEN_NAM_HOC]
    );

    let [results_chitietphancong_data] = await pool.execute(
      `
SELECT 
giangvien.MAGV, giangvien.TENGV, 
SUM(chitietphancong.TONG_SO_GIO) as TONG_SO_GIO_DAY
FROM giangvien
LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG  = bangphancong.MAPHANCONG
GROUP BY giangvien.MAGV, giangvien.TENGV
ORDER BY SUM(chitietphancong.TONG_SO_GIO) ASC
  `
    );

    // console.log("results_KhungChuan: ", results_KhungChuan)
    // console.log("results_chitietphancong_data: ", results_chitietphancong_data)
    const mergeResults = (khungChuan, chiTietPhanCong) => {
      const mergedResults = chiTietPhanCong.map(item => {
        const khungItem = khungChuan.find(kh => kh.MAGV === item.MAGV);
        return {
          ...item,
          GIOGIANGDAY_HANHCHINH: khungItem ? khungItem.GIOGIANGDAY_HANHCHINH : null,
        };
      });

      return mergedResults;
    };
    const mergedResults = mergeResults(results_KhungChuan, results_chitietphancong_data);
    // console.log("mergedResults: ", mergedResults);

    // let results = [];
    // for (let i = 0; i < results_chitietphancong_data.length; i++) {
    //   results.push({
    //     MAGV: results_chitietphancong_data[i].MAGV,
    //     TENGV: results_chitietphancong_data[i].TENGV,
    //     GIOGIANGDAY_CHUAN:
    //       results_chitietphancong_data[i].GIOGIANGDAY_CHUAN + 300,
    //     TONG_SO_GIO_DAY: results_chitietphancong_data[i].TONG_SO_GIO_DAY,
    //   });
    // }

    return {
      EM: "xem thông tin phân công thành công",
      EC: 1,
      DT: mergedResults,
    };
  } catch (error) {
    console.log("Lỗi services createchitietphancong_excel", error);
    return {
      EM: "Lỗi services createTaiKhoanExcel",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  createchitietphancong_excel,
  Dangky_chitietphancong,
  xem_chitietphancong_giangvien,
  xem_chitietphancong_lop,
  xem_chitietphancong_banthan,
  xem_giophancong_giangvienkhac,
};
