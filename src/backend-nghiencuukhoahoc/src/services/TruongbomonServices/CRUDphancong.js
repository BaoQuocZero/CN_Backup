const pool = require("../../config/database");
const moment = require("moment");

const { timnamhoc_TENNAMHOC } = require("../AdminServices/helpers");
const e = require("express");
const select_giangvien_chuachonkhung = async (TENNAMHOC) => {
  try {
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT gv.*
FROM giangvien gv
WHERE NOT EXISTS (
    SELECT 1
    FROM chon_khung ck
    JOIN namhoc nh ON ck.MANAMHOC = nh.MANAMHOC
    WHERE ck.MAGV = gv.MAGV
    AND nh.TENNAMHOC = ?
);
`,
      [TENNAMHOC]
    );
    return {
      EM: "Xem thông tin giảng viên chưa chọn khung chuẩn thành công",
      EC: 1,
      DT: results_ctdt_bomon,
    };
  } catch (error) {
    return {
      EM: "Lỗi services select_giangvien_chuachonkhung",
      EC: -1,
      DT: [],
    };
  }
};
const selectLop_BoMon = async (TENBOMON, data) => {
  try {
    let [results1, fields1] = await pool.execute(
      ` SELECT lop.* 
      FROM lop
      INNER JOIN chuongtrinhdaotao ON lop.MACHUONGTRINH = chuongtrinhdaotao.MACHUONGTRINH
      INNER JOIN bomon ON chuongtrinhdaotao.MABOMON = bomon.MABOMON
      WHERE bomon.TENBOMON = ?`,
      [TENBOMON]
    );

    return {
      EM: " Xem thông tin lớp thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    console.log("error", error);
    return {
      EM: "lỗi services selectMonHoc",
      EC: -1,
      DT: [],
    };
  }
};
const select_giangvien_dachonkhung = async () => {
  try {
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT gv.*
      FROM giangvien gv
      JOIN chon_khung ck ON gv.MAGV = ck.MAGV
      JOIN taikhoan tk ON gv.MAGV = tk.MAGV
      WHERE tk.TENDANGNHAP IS NOT NULL;`
    );
    return {
      EM: "Xem thông tin giảng viên đã chọn khung chuẩn thành công",
      EC: 1,
      DT: results_ctdt_bomon,
    };
  } catch (error) {
    console.log("error =>", error);
    return {
      EM: "Lỗi services select_giangvien_dachonkhung",
      EC: -1,
      DT: [],
    };
  }
};

const select_giangvien_dachonkhung_chitiet = async (TENNAMHOC) => {
  try {
    let [results_ctdt_bomon, fields1] = await pool.execute(
      `SELECT gv.*,nh.TENNAMHOC,kgc.*
      FROM giangvien gv
      JOIN chon_khung ck ON gv.MAGV = ck.MAGV
      JOIN khunggiochuan kgc ON kgc.MAKHUNG = ck.MAKHUNG
      JOIN namhoc nh ON nh.MANAMHOC = ck.MANAMHOC
      JOIN taikhoan tk ON gv.MAGV = tk.MAGV
      WHERE tk.TENDANGNHAP IS NOT NULL 
       and nh.TENNAMHOC = ?; `,
      [TENNAMHOC]
    );

    console.log(results_ctdt_bomon);

    let danhSachGiangVienDaChonKhung = [];

    results_ctdt_bomon.forEach((dong) => {
      let MaGV = danhSachGiangVienDaChonKhung.find(
        (gv) => gv.MAGV === dong.MAGV
      );

      if (!MaGV) {
        MaGV = {
          MAGV: dong.MAGV,
          ThongtinGiangvien: [],
        };
        danhSachGiangVienDaChonKhung.push(MaGV);
      }

      let giangvien = MaGV.ThongtinGiangvien.find(
        (m) => m.TENGV === dong.TENGV
      );

      if (!giangvien) {
        giangvien = {
          MABOMON: dong.MABOMON,
          TENNAMHOC: dong.TENNAMHOC,
          TENGIANGVIEN: dong.TENGV,
          EMAIL: dong.EMAIL,
          GIOCHUAN: [],
        };
        MaGV.ThongtinGiangvien.push(giangvien);
      }
      if (!giangvien.GIOCHUAN.includes(dong.TENKHHUNGCHUAN)) {
        giangvien.GIOCHUAN.push({
          GIOGIANGDAY_HANHCHINH: dong.GIOGIANGDAY_HANHCHINH,
          GIOGIANGDAY_CHUAN: dong.GIOGIANGDAY_CHUAN,
          GIONGHIENCUUKHOAHOC_HANHCHINH: dong.GIONGHIENCUUKHOAHOC_HANHCHINH,
          GIONGHIENCUUKHOAHOC_CHUAN: dong.GIONGHIENCUUKHOAHOC_CHUAN,
          GIOPHUCVUCONGDONG_HANHCHINH: dong.GIOPHUCVUCONGDONG_HANHCHINH,
          GIOPHUCVUCONGDONG_CHUAN: dong.GIOPHUCVUCONGDONG_CHUAN,
        });
      }
    });

    return {
      EM: "Xem thông tin giảng viên đã chọn khung chuẩn thành công",
      EC: 1,
      DT: danhSachGiangVienDaChonKhung,
    };
  } catch (error) {
    console.log("error =>", error);
    return {
      EM: "Lỗi services select_giangvien_dachonkhung_chitiet",
      EC: -1,
      DT: [],
    };
  }
};

const select_lophoc_monhoc = async (MALOP, SOHOCKI, MAHKNK, TEN_NAM_HOC) => {
  try {

    let [results_lop, fields_lop] = await pool.execute(
      `SELECT * FROM lop WHERE lop.MALOP =  ?`,
      [MALOP]
    );

    if (results_lop.length > 0) {
      // Lấy NAMTUYENSINH và chuyển thành ngày đầu tiên của năm
      const namTuyenSinh = results_lop[0].NAMTUYENSINH;
      const ngayBatDau = `${namTuyenSinh}-01-01`;

      let [results_hockynienkhoa, fields_hockynienkhoa] = await pool.execute(
        `
        SELECT hockynienkhoa.* 
        FROM hockynienkhoa
        WHERE hockynienkhoa.NGAYBATDAUNIENKHOA >= ?
        ORDER BY hockynienkhoa.NGAYBATDAUNIENKHOA ASC`,
        [ngayBatDau]
      );

      // Tìm phần tử trong results_hockynienkhoa
      const index = results_hockynienkhoa.findIndex(
        (item) =>
          item.TENHKNK === SOHOCKI &&
          item.TEN_NAM_HOC.toLowerCase() === TEN_NAM_HOC.toLowerCase()
      );

      if (index !== -1) {
        // console.log(
        //   `Phần tử thỏa mãn điều kiện nằm ở vị trí: ${index}, dữ liệu: `,
        //   results_hockynienkhoa[index]
        // );

        let [results_MonHoc, fields_MonHoc] = await pool.execute(
          `
SELECT 
lop.*,
chuongtrinhdaotao.MACHUONGTRINH, chuongtrinhdaotao.TENCHUONGTRINH,
thuoc.SOTHUTUHOCKI,
monhoc.*
FROM lop 
LEFT JOIN chuongtrinhdaotao ON chuongtrinhdaotao.MACHUONGTRINH = lop.MACHUONGTRINH
LEFT JOIN thuoc ON thuoc.MACHUONGTRINH = chuongtrinhdaotao.MACHUONGTRINH
LEFT JOIN monhoc ON monhoc.MAMONHOC = thuoc.MAMONHOC
WHERE lop.MALOP = ? AND thuoc.SOTHUTUHOCKI = ?
          `,
          [MALOP, index + 1]
        );

        let [results_GiangVien, fields_GiangVien] = await pool.execute(
          `
SELECT 
    giangvien.*,
    khunggiochuan.GIOGIANGDAY_HANHCHINH
FROM giangvien
LEFT JOIN chon_khung ON chon_khung.MAGV = giangvien.MAGV
LEFT JOIN namhoc ON namhoc.MANAMHOC = chon_khung.MANAMHOC
LEFT JOIN khunggiochuan ON chon_khung.MAKHUNG = khunggiochuan.MAKHUNG
WHERE namhoc.TENNAMHOC = ?
          `,
          [TEN_NAM_HOC]
        );

        let [results_PhanCong, fields_PhanCong] = await pool.execute(
          `
SELECT 
    giangvien.MAGV, giangvien.TENGV,
    lop.MALOP,
    monhoc.MAMONHOC,
    SUM(chitietphancong.TONG_SO_GIO) AS TONG_SO_GIO
FROM giangvien
LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
LEFT JOIN hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
LEFT JOIN lop ON lop.MALOP = chitietphancong.MALOP
LEFT JOIN monhoc ON monhoc.MAMONHOC = chitietphancong.MAMONHOC
WHERE hockynienkhoa.TEN_NAM_HOC = ?
GROUP BY giangvien.MAGV, lop.MALOP, monhoc.MAMONHOC
          `,
          [TEN_NAM_HOC]
        );

        // console.log("results_MonHoc: ", results_MonHoc)
        // console.log("results_GiangVien: ", results_GiangVien)
        // console.log("results_PhanCong: ", results_PhanCong)
        // Gộp dữ liệu từ results_MonHoc và results_PhanCong
        const combinedMonHocPhanCong = results_MonHoc.map((monHoc) => {
          const phanCong = results_PhanCong.find(
            (pc) => pc.MALOP === monHoc.MALOP && pc.MAMONHOC === monHoc.MAMONHOC
          );

          return {
            ...monHoc,
            ...(phanCong || {}), // Thêm dữ liệu từ phanCong (nếu có)
          };
        });

        // Gộp dữ liệu tiếp theo với results_GiangVien
        const finalResult = combinedMonHocPhanCong.map((monHocPhanCong) => {
          const giangVien = results_GiangVien.find(
            (gv) => gv.MAGV === monHocPhanCong.MAGV
          );

          return {
            ...monHocPhanCong,
            ...(giangVien || {}), // Thêm dữ liệu từ giangVien (nếu có)
          };
        });

        // Kết quả cuối cùng
        // console.log("Kết quả gộp dữ liệu: ", finalResult);


        return {
          EM: "Tìm thấy học kỳ niên khóa thỏa mãn điều kiện",
          EC: 1,
          DT: finalResult,
        };
      } else {
        console.log("Không tìm thấy phần tử thỏa mãn điều kiện.");
        return {
          EM: "Không tìm thấy học kỳ niên khóa thỏa mãn điều kiện",
          EC: 1,
          DT: [],
        };
      }
    } else {
      return {
        EM: "Không tìm thấy thông tin lớp học",
        EC: 1,
        DT: [],
      };
    }

  } catch (error) {
    console.error("error", error);
    return {
      EM: "Lỗi services select_lophoc_monhoc",
      EC: -1,
      DT: [],
    };
  }
};

const create_listgiangvien_phancong = async (MAGV) => {
  try {
    const currentTime = moment().format("YYYY-MM-DD");

    let [results_ctdt_bomon, fields1] = await pool.execute(
      `insert into bangphancong (MAGV,THOIGIANLAP) values (?,?)`,
      [MAGV, currentTime]
    );
    return {
      EM: "phân công cho giảng viên thành công",
      EC: 1,
      DT: results_ctdt_bomon,
    };
  } catch (error) {
    return {
      EM: "Lỗi services create_listgiangvien_phancong",
      EC: -1,
      DT: [],
    };
  }
};

const xem_listgiangvien_phancong = async (page, limit) => {
  if (page && limit) {
    let offset = (page - 1) * limit;
    let [results0, fields] = await pool.execute(
      `select giangvien.*,bangphancong.* from giangvien, bangphancong where giangvien.MAGV = bangphancong.MAGV order by giangvien.MAGV LIMIT ? OFFSET ?;`,
      [limit, offset]
    );

    const totalCountResult = await pool.execute(
      `SELECT COUNT(*) AS total
      from giangvien, bangphancong where giangvien.MAGV = bangphancong.MAGV`
    );

    const totalCount = totalCountResult[0][0].total;
    let totalPages = Math.ceil(totalCount / limit);
    let data = {
      totalRows: results0,
      totalPages: totalPages,
      users: fields,
    };
    return {
      EM: "Xem thông tin giảng viên phân công thành công",
      EC: 1,
      DT: data,
    };
  } else {
    let [results0, fields] = await pool.execute(
      `select giangvien.*,bangphancong.* from giangvien, bangphancong where giangvien.MAGV = bangphancong.MAGV order by giangvien.MAGV`,
      [TENBOMON]
    );

    return {
      EM: "Xem thông tin giảng viên phân công thành công",
      EC: 1,
      DT: results0,
    };
  }
};

function tinhSoTinChi(lythuyet, thuchanh) {
  // Chuyển đổi các tham số thành kiểu số (nếu chúng là chuỗi)
  const nNumber = Number(lythuyet);
  const soHocKiNumber = Number(thuchanh);

  // Tính toán
  return nNumber * 15 + soHocKiNumber * 30 * 2;
}

const phancong_tudong_giangvien = async (data_phancong) => {
  try {
    // console.log("data_phancong: ", data_phancong)
    const currentTime = moment().format("YYYY-MM-DD");
    for (var i = 0; i < data_phancong.data.length; i++) {
      let tongSogio = tinhSoTinChi(
        data_phancong.data[i].SOTINCHILYTHUYET,
        data_phancong.data[i].SOTINCHITHUCHANH
      );

      const [kiemtra_bangphancong, fields_kiemtrabangphancong] =
        await pool.execute(
          `select * from bangphancong where MAHKNK = ? and MAGV = ?`,
          [data_phancong.HOCKINIENKHOA.MAHKNK, data_phancong.data[i].MAGV]
        );

      if (kiemtra_bangphancong.length === 0) {
        await pool.execute(
          `insert into bangphancong (MAHKNK,MAGV,THOIGIANLAP) values (?,?,?)`,
          [
            data_phancong.HOCKINIENKHOA.MAHKNK,
            data_phancong.data[i].MAGV,
            currentTime,
          ]
        );
      }

      const [select_bangphancong, fields_selectbangphancong] = await pool.execute(
        `select MAPHANCONG from bangphancong where MAHKNK = ? and MAGV = ?`,
        [data_phancong.HOCKINIENKHOA.MAHKNK, data_phancong.data[i].MAGV]
      );

      const [select_chitietphancong, fields_selectchitietphancong] =
        await pool.execute(
          `select * from chitietphancong where MAMONHOC = ? and MAPHANCONG = ? and MALOP = ?`,
          [
            data_phancong.data[i].MAMONHOC,
            select_bangphancong[0].MAPHANCONG,
            data_phancong.data[i].MALOP,
          ]
        );

      if (select_chitietphancong.length === 0) {
        await pool.execute(
          `insert into chitietphancong (MAMONHOC,MAPHANCONG,MALOP,TONG_SO_GIO) values (?,?,?,?)`,
          [
            data_phancong.data[i].MAMONHOC,
            select_bangphancong[0].MAPHANCONG,
            data_phancong.data[i].MALOP,
            tongSogio,
          ]
        );
      }
    }

    return {
      EM: "phân công cho giảng viên thành công",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.log("error: ", error)
    return {
      EM: "Lỗi services create_listgiangvien_phancong",
      EC: -1,
      DT: [],
    };
  }
};

const update_phancong_giangvien = async (dataOld, dataNew) => {
  try {
    console.log("dataOld : ", dataOld);
    console.log("dataNew: ", dataNew);
    const currentTime = moment().format("YYYY-MM-DD");

    const [select_chitietphancong_dataOld] = await pool.execute(
      `
SELECT 
  giangvien.*,
  bangphancong.*,
  hockynienkhoa.*,
  chitietphancong.*
FROM giangvien
LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
LEFT JOIN chitietphancong ON chitietphancong.MAPHANCONG = bangphancong.MAPHANCONG
LEFT JOIN hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
WHERE giangvien.MAGV = ? AND chitietphancong.MALOP = ? AND chitietphancong.MAMONHOC = ?
      `,
      [dataOld.MAGV ? dataOld.MAGV : "", dataOld.MALOP, dataOld.MAMONHOC]
    );

    if (select_chitietphancong_dataOld.length === 0 || select_chitietphancong_dataOld[0].MACHITIETPHANCONG === null) {

      return {
        EM: "Không tìm thấy giảng viên cũ",
        EC: 0,
        DT: [],
      };
    }

    const [select_bangphancong_dataNew] = await pool.execute(
      `
SELECT 
  giangvien.*,
  bangphancong.*,
  hockynienkhoa.*
FROM giangvien
LEFT JOIN bangphancong ON bangphancong.MAGV = giangvien.MAGV
LEFT JOIN hockynienkhoa ON hockynienkhoa.MAHKNK = bangphancong.MAHKNK
WHERE giangvien.MAGV = ? AND hockynienkhoa.MAHKNK = ?
      `,
      [dataNew.MAGV, select_chitietphancong_dataOld[0].MAHKNK]
    );

    if (select_bangphancong_dataNew.length === 0) {
      const [tao_bangphancong_dataNew] = await pool.execute(
        `
INSERT INTO bangphancong(MAHKNK, MAGV, THOIGIANLAP) 
VALUES (?, ?, ?)
        `,
        [select_chitietphancong_dataOld[0].MAHKNK, dataNew.MAGV, currentTime]
      );

      const insertId = tao_bangphancong_dataNew.insertId;

      await pool.execute(
        `
UPDATE chitietphancong 
SET MAPHANCONG = ?
WHERE MACHITIETPHANCONG = ?
        `,
        [insertId, select_chitietphancong_dataOld[0].MACHITIETPHANCONG]
      );

      return {
        EM: "Phân công cho giảng viên thành công",
        EC: 1,
        DT: [],
      };
    }

    await pool.execute(
      `
UPDATE chitietphancong 
SET MAPHANCONG = ?
WHERE MACHITIETPHANCONG = ?
      `,
      [select_bangphancong_dataNew[0].MAPHANCONG, select_chitietphancong_dataOld[0].MACHITIETPHANCONG]
    );

    return {
      EM: "Phân công cho giảng viên thành công",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Lỗi xảy ra trong quá trình xử lý",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  select_giangvien_chuachonkhung,
  select_giangvien_dachonkhung,
  select_lophoc_monhoc,
  select_giangvien_dachonkhung_chitiet,

  //bảng phân công
  create_listgiangvien_phancong,
  xem_listgiangvien_phancong,
  selectLop_BoMon,
  phancong_tudong_giangvien,
  update_phancong_giangvien,
};
