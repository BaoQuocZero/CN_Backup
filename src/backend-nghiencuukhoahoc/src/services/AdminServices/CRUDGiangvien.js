const pool = require("../../config/database");
const { selectBomon_MABOMON } = require("./CRUDBomon");

const {
  timTaiKhoan_TENDANGNHAP,
  timGiangVien_MAGV,
  selectBomon_TENBOMON,
  selectChucdanh_TENCHUCDANH,
  timChucVu_TENCHUCVU,
  timChucVu_MAGV,
  timCoChucDanh_MAGV,
  timChucVu_MACHUCVU,
  timChucDanh_MACHUCDANH,

  dataFronEnd,
} = require("./helpers");

const selectGiangVien = async (page, limit) => {
  // Kiểm tra page và limit có hợp lệ không
  if (!page || page < 1) page = 1;

  if (!limit || limit < 1) limit = 10;

  let offset = (page - 1) * limit;

  // Truy vấn dữ liệu giảng viên với phân trang
  let [results0, fields] = await pool.execute(
    `SELECT k.TENKHOA, bm.MABOMON, bm.TENBOMON, tk.TENDANGNHAP, gv.TENGV, gv.EMAIL, tk.MAGV, cd.TENCHUCDANH, cv.TENCHUCVU, gv.DIENTHOAI, gv.DIACHI, tk.PHANQUYEN, tk.TRANGTHAITAIKHOAN
      FROM taikhoan AS tk
      LEFT JOIN giangvien AS gv ON tk.MAGV = gv.MAGV
      LEFT JOIN bomon AS bm ON bm.MABOMON = gv.MABOMON
      LEFT JOIN khoa AS k ON k.MAKHOA = bm.MAKHOA
      LEFT JOIN giu_chuc_vu AS gcv ON gv.MAGV = gcv.MAGV
      LEFT JOIN chucvu AS cv ON gcv.MACHUCVU = cv.MACHUCVU
      LEFT JOIN co_chuc_danh AS ccd ON ccd.MAGV = gv.MAGV
      LEFT JOIN chucdanh AS cd ON ccd.MACHUCDANH = cd.MACHUCDANH
      ORDER BY tk.TENDANGNHAP ASC
      LIMIT ? OFFSET ?;
    `,
    [limit, offset]
  );

  // Truy vấn tổng số lượng bản ghi để tính số trang
  const totalCountResult = await pool.execute(
    `SELECT COUNT(*) AS total
    FROM taikhoan AS tk
    LEFT JOIN giangvien AS gv ON tk.MAGV = gv.MAGV
    LEFT JOIN bomon AS bm ON bm.MABOMON = gv.MABOMON
    LEFT JOIN khoa AS k ON k.MAKHOA = bm.MAKHOA
    LEFT JOIN giu_chuc_vu AS gcv ON gv.MAGV = gcv.MAGV
    LEFT JOIN chucvu AS cv ON gcv.MACHUCVU = cv.MACHUCVU
    LEFT JOIN co_chuc_danh AS ccd ON ccd.MAGV = gv.MAGV
    LEFT JOIN chucdanh AS cd ON ccd.MACHUCDANH = cd.MACHUCDANH`
  );

  const totalCount = totalCountResult[0][0].total;
  let totalPages = Math.ceil(totalCount / limit);

  // Cấu trúc dữ liệu trả về
  let data = {
    items: results0, // Danh sách giảng viên
    totalItems: totalCount, // Tổng số bản ghi
    totalPages: totalPages, // Tổng số trang
    currentPage: page, // Trang hiện tại
    itemsPerPage: limit, // Số bản ghi mỗi trang
  };

  return {
    EM: "Xem thông tin giảng viên thành công",
    EC: 1,
    DT: data,
  };
};

const selectOnlyGiangVienByTenDangNhap = async (TENDANGNHAP) => {
  if (!TENDANGNHAP) {
    console.error("Tên đăng nhập không được truyền vào.");
    return {
      EM: "Tên đăng nhập không được truyền vào.",
      EC: -1,
      DT: [],
    };
  }

  try {
    let [results, fields] = await pool.execute(
      `SELECT 
  TK.TENDANGNHAP,
  GV.TENGV,
  GV.MAGV,
  CV.TENCHUCVU,
  CD.TENCHUCDANH,
  CCD.THOIGIANNHAN,
  GV.DIENTHOAI,
  GV.DIACHI,
  BM.MABOMON,
  BM.TENBOMON,
  TK.PHANQUYEN,
  TK.TRANGTHAITAIKHOAN,
  K.TENKHOA
FROM 
  taikhoan AS TK
LEFT JOIN 
  giangvien AS GV ON TK.MAGV = GV.MAGV
LEFT JOIN 
  giu_chuc_vu AS GCV ON GV.MAGV = GCV.MAGV
LEFT JOIN 
  chucvu AS CV ON GCV.MACHUCVU = CV.MACHUCVU
LEFT JOIN 
  co_chuc_danh AS CCD ON GV.MAGV = CCD.MAGV
LEFT JOIN 
  chucdanh AS CD ON CCD.MACHUCDANH = CD.MACHUCDANH
LEFT JOIN 
  bomon AS BM ON GV.MABOMON = BM.MABOMON
LEFT JOIN 
  khoa AS K ON BM.MAKHOA = K.MAKHOA
WHERE 
  TK.TENDANGNHAP = ?;
;`,
      [TENDANGNHAP]
    );

    if (results[0] && results[0].THOIGIANNHAN) {
      const date = new Date(results[0].THOIGIANNHAN);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      results[0].THOIGIANNHAN = `${year}-${month}-${day}`;
    }

    return {
      EM: "Xem thông tin giảng viên thành công",
      EC: 1,
      DT: results[0],
    };
  } catch (error) {
    console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
    return {
      EM: "Lỗi services selectGiangVien",
      EC: -1,
      DT: [],
    };
  }
};

const selectOnlyGiangVien = async (MABOMON) => {
  try {
    let [results1, fields1] = await pool.execute(
      `select * from giangvien where MABOMON= ?`,
      [MABOMON]
    );
    return {
      EM: " xem thông tin giảng viên của bộ môn đó thành công",
      EC: 1,
      DT: results1,
    };
  } catch (error) {
    return {
      EM: "lỗi services selectGiangVien",
      EC: -1,
      DT: [],
    };
  }
};

const createGiangVien = async (dataGiangVien) => {
  try {
    //dataGiangVien phải bao gồm MAGV, MABOMON, TENDANGNHAP, TENGV, EMAIL, DIENTHOAI, DIACHI

    if (timGiangVien_MAGV(dataGiangVien.maGV)) {
      return {
        EM: "Giảng viên này đã tồn tại",
        EC: 0,
        DT: [],
      };
    }

    let [results, fields] = await pool.execute(
      `INSERT INTO giangvien VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dataGiangVien.MAGV,
        dataGiangVien.MABOMON,
        dataGiangVien.TENDANGNHAP,
        dataGiangVien.TENGV,
        dataGiangVien.EMAIL,
        dataGiangVien.DIENTHOAI,
        dataGiangVien.DIACHI,
      ]
    );
    return {
      EM: "thêm giảng viên mới thành công",
      EC: 1,
      DT: results,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "lỗi services createGiangVien",
      EC: -1,
      DT: [],
    };
  }
};

const updateTrangThaiTaiKhoanGiangVien = async (
  MAGV,
  TRANGTHAITAIKHOAN,
  MABOMON,
  isOpenGetAllApiGV
) => {
  try {
    if (!(await timGiangVien_MAGV(MAGV))) {
      return {
        EM: "Giảng viên này không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    let [results, fields] = await pool.execute(
      `UPDATE taikhoan SET TRANGTHAITAIKHOAN = ? WHERE MAGV = ?;`,
      [TRANGTHAITAIKHOAN, MAGV]
    );

    let results0 = await dataFronEnd(isOpenGetAllApiGV, MABOMON);

    return {
      EM: "Cập nhật trạng thái tài khoản thành công",
      EC: 1,
      DT: results0.DT,
    };
    // if (isOpenGetAllApiGV) {
    //   let [results0, fields0] = await pool.execute(
    //     "SELECT bm.MABOMON, bm.TENBOMON, tk.TENDANGNHAP, gv.TENGV, gv.EMAIL, tk.MAGV, gv.DIENTHOAI, gv.DIACHI, tk.PHANQUYEN, tk.TRANGTHAITAIKHOAN " +
    //     "FROM taikhoan as tk, giangvien as gv, bomon as bm " +
    //     "WHERE tk.MAGV = gv.MAGV AND bm.MABOMON = gv.MABOMON"
    //   );
    //   return {
    //     EM: "Cập nhật trạng thái tài khoản thành công",
    //     EC: 1,
    //     DT: results0,
    //   };
    // } else {
    //   let [results0, fields0] = await pool.execute(
    //     "SELECT bm.MABOMON, bm.TENBOMON, tk.TENDANGNHAP, gv.TENGV, gv.EMAIL, tk.MAGV, gv.DIENTHOAI, gv.DIACHI, tk.PHANQUYEN, tk.TRANGTHAITAIKHOAN " +
    //     "FROM taikhoan as tk, giangvien as gv, bomon as bm " +
    //     "WHERE tk.MAGV = gv.MAGV AND bm.MABOMON = gv.MABOMON AND bm.MABOMON = ?",
    //     [MABOMON]
    //   );
    //   return {
    //     EM: "Cập nhật trạng thái tài khoản thành công",
    //     EC: 1,
    //     DT: results0,
    //   };
    // }
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi services updateTrangThaiTaiKhoanGiangVien",
      EC: -1,
      DT: [],
    };
  }
};

const updateGiangVien = async (MAGV, dataGiangVien) => {
  try {
    // MAGV
    // dataGiangVien gồm MABOMON TENGV EMAIL DIENTHOAI DIACHI

    let KiemTra_MAGV = await timGiangVien_MAGV(MAGV);
    if (!KiemTra_MAGV.length > 0) {
      return {
        EM: "Giảng viên này không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    let KiemTra_MABOMON = await selectBomon_MABOMON(dataGiangVien.MABOMON);
    if (!KiemTra_MABOMON) {
      return {
        EM: "Bộ môn này không tồn tại",
        EC: 0,
        DT: [],
      };
    }

    let [results, fields] = await pool.execute(
      `UPDATE giangvien
            SET MABOMON = ?, TENGV = ?, EMAIL = ?, DIENTHOAI = ?, DIACHI = ? 
            WHERE MAGV = ?;`,
      [
        dataGiangVien.MABOMON,
        dataGiangVien.TENGV,
        dataGiangVien.EMAIL,
        dataGiangVien.DIENTHOAI,
        dataGiangVien.DIACHI,
        MAGV,
      ]
    );

    return {
      EM: "Sửa giảng viên thành công",
      EC: 1,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi services updateGiangVien",
      EC: -1,
      DT: [],
    };
  }
};

const deleteGiangVien = async (MAGV, MABOMON, isOpenGetAllApiGV) => {
  try {
    if (!timGiangVien_MAGV(MAGV)) {
      return {
        EM: "Giảng viên này không tồn tại",
        EC: 0,
        DT: [],
      };
    }
    // Kiểm tra và xóa trong bảng giu_chuc_vu
    const [results1] = await pool.execute(
      `SELECT * FROM giu_chuc_vu WHERE MAGV = ?`,
      [MAGV]
    );
    if (results1.length > 0) {
      await pool.execute(`DELETE FROM giu_chuc_vu WHERE MAGV = ?`, [MAGV]);
    }

    // Kiểm tra và xóa trong bảng co_chuc_danh
    const [results2] = await pool.execute(
      `SELECT * FROM co_chuc_danh WHERE MAGV = ?`,
      [MAGV]
    );
    if (results2.length > 0) {
      await pool.execute(`DELETE FROM co_chuc_danh WHERE MAGV = ?`, [MAGV]);
    }

    // Kiểm tra và xóa trong bảng taikhoan
    const [results3] = await pool.execute(
      `SELECT * FROM taikhoan WHERE MAGV = ?`,
      [MAGV]
    );
    if (results3.length > 0) {
      await pool.execute(`DELETE FROM taikhoan WHERE MAGV = ?`, [MAGV]);
    }

    // Cuối cùng, xóa trong bảng giangvien
    await pool.execute(`DELETE FROM giangvien WHERE MAGV = ?`, [MAGV]);

    let results0 = await dataFronEnd(isOpenGetAllApiGV, MABOMON);

    return {
      EM: "Xóa Giảng Viên Thành Công",
      EC: 1,
      DT: results0.DT,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi Không Thể Xóa Giảng Viên",
      EC: -1,
      DT: [],
    };
  }
};

const updateGIANGVIEN = async (datagiangvien) => {
  try {
    let [results1, fields1] = await pool.execute(
      "select * from taikhoan where TENDANGNHAP = ?",
      [tenDangnhap]
    );
    if (results1.length > 0) {
      const isCorrectPass = await bcrypt.compare(
        matKhaucu,
        results1[0].MATKHAU
      );
      if (isCorrectPass) {
        let hashpass = await hashPassword(matkhaumoi);
        let [results, fields] = await pool.execute(
          `UPDATE taikhoan SET MATKHAU = ?, PHANQUYEN = ?, TRANGTHAI = ? WHERE TENDANGNHAP = ?`,
          [hashpass, phanQuyen, trangThai, tenDangnhap]
        );
        return {
          EM: "update thành công",
          EC: 0,
          DT: [],
        };
      }
      return {
        EM: "mật khẩu cũ không khớp không thể update",
        EC: 0,
        DT: [],
      };
    }
    return {
      EM: "tài khoản không tồn tại",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "lỗi services createTaiKhoan",
      EC: 1,
      DT: [],
    };
  }
};
const searchTenGiangVien = async (TENGIANGVIEN) => {
  try {
    const query = `SELECT k.TENKHOA, bm.MABOMON, bm.TENBOMON, tk.TENDANGNHAP, gv.TENGV, gv.EMAIL, tk.MAGV, cd.TENCHUCDANH, cv.TENCHUCVU, gv.DIENTHOAI, gv.DIACHI, tk.PHANQUYEN, tk.TRANGTHAITAIKHOAN
        FROM taikhoan AS tk
        LEFT JOIN giangvien AS gv ON tk.MAGV = gv.MAGV
        LEFT JOIN bomon AS bm ON bm.MABOMON = gv.MABOMON
        LEFT JOIN khoa AS k ON k.MAKHOA = bm.MAKHOA
        LEFT JOIN giu_chuc_vu AS gcv ON gv.MAGV = gcv.MAGV
        LEFT JOIN chucvu AS cv ON gcv.MACHUCVU = cv.MACHUCVU
        LEFT JOIN co_chuc_danh AS ccd ON ccd.MAGV = gv.MAGV
        LEFT JOIN chucdanh AS cd ON ccd.MACHUCDANH = cd.MACHUCDANH
       WHERE gv.TENGV LIKE ? LIMIT 10
       
      `;
    const [rows] = await pool.execute(query, [`%${TENGIANGVIEN}%`]);
    return {
      EM: "Xem giảng viên thành công",
      EC: 1,
      DT: rows,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Lỗi services updateGiangVien",
      EC: -1,
      DT: [],
    };
  }
};
const fakeChonKhungGV = async (data) => {
  try {
    let results = [];
    // Lặp qua từng phần tử trong mảng data
    for (var i = 0; i < data.length; i++) {
      // Chuẩn bị các giá trị cần chèn cho từng bản ghi
      let MAGV = data[i].MAGV;
      let MAKHUNG = data[i].MAKHUNG;
      let MANAMHOC = data[i].MANAMHOC;

      // Chèn bản ghi vào bảng chon_khung
      await pool.execute(
        `INSERT INTO chon_khung (MAGV, MAKHUNG, MANAMHOC) VALUES (?, ?, ?)`,
        [MAGV, MAKHUNG, MANAMHOC]
      );

      // Lưu kết quả trả về sau mỗi lần chèn thành công
      results.push({
        EM: `Chèn giảng viên với MAGV: ${MAGV} thành công`,
        EC: 0,
        DT: [],
      });
    }

    return {
      EM: "Tất cả giảng viên đã được chèn thành công",
      EC: 1,
      DT: results,
    };
  } catch (error) {
    console.log("Lỗi services fakeChonKhungGV", error);
    return {
      EM: "Lỗi trong quá trình chèn giảng viên",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  selectGiangVien,
  selectOnlyGiangVien,
  selectOnlyGiangVienByTenDangNhap,
  createGiangVien,

  updateGiangVien,
  updateTrangThaiTaiKhoanGiangVien,

  deleteGiangVien,
  searchTenGiangVien,
  fakeChonKhungGV,
};
