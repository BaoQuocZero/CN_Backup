import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  Bubble,
  Scatter,
  Chart,
  PolarArea,
} from "react-chartjs-2";
import "chart.js/auto"; // Đăng ký tự động

import ModalChiTietGV from "./modal/ModalChiTietGV";
import ThongKeGV from "./ThongKeGV/ThongKe";

import {
  fetchDataGV,
  fetchDataBieuDoTron,
  fetchDataBieuDoTron_PhanCong,
  fetchGV_BoMon,
  fetchDataNamHoc
} from "./services/ThongKeServices";

const ThongKe = () => {
  const auth = Cookies.get("accessToken");
  const [giangVien, setGiangVien] = useState(null);
  const [listgiangVien, setListGiangVien] = useState([]);
  const [selectedGiangVien, setSelectedGiangVien] = useState(null);
  const [NamHoc_HocKiNienKhoa, setNamHoc_HocKiNienKhoa] = useState([]);
  const [SelectNamHoc_HocKiNienKhoa, setSelectNamHoc_HocKiNienKhoa] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm
  const [filteredListgiangVien, setFilteredListgiangVien] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // State for current page
  const [totalPages, setTotalPages] = useState(1);    // State for total pages
  const pageSize = 2;  // Number of items per page

  const handleViewDetails = (giangVien) => {
    setSelectedGiangVien(giangVien);
  };

  const handleCloseModal = () => {
    setSelectedGiangVien(null);
  };

  const [doughnut_GV_gioGiang, setDoughnut_GV_GioGiang] = useState({
    labels: ["Giờ hành chính", "Giờ thực dạy"],
    datasets: [
      {
        data: [5, 5],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  });

  const [pieData_GV_gioGiang_PhanCong, setPieData_GV_GioGiang_PhanCong] = useState({
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  });

  useEffect(() => {
    const decodeAuth = jwtDecode(auth);

    // Gọi API lấy dữ liệu giảng viên
    const getGiangVien = async () => {
      try {
        const gv = await fetchDataGV(decodeAuth.taikhoan);
        setGiangVien(gv);
      } catch (error) {
        console.error("Lỗi khi lấy giảng viên:", error);
      }
    };

    getGiangVien();
  }, [auth]);

  useEffect(() => {
    const getNamHoc_HocKiNienKhoa = async () => {
      try {
        const NamHoc_HocKiNienKhoa = await fetchDataNamHoc();
        setNamHoc_HocKiNienKhoa(NamHoc_HocKiNienKhoa);
        if (NamHoc_HocKiNienKhoa.length > 0) {
          setSelectNamHoc_HocKiNienKhoa((prev) =>
            prev || NamHoc_HocKiNienKhoa[0].MANAMHOC
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách năm học:", error);
      }
    };

    getNamHoc_HocKiNienKhoa();
  }, []);

  useEffect(() => {
    // Gọi API lấy dữ liệu biểu đồ tròn khi có thông tin giảng viên
    const getBieuDoTron = async () => {
      if (giangVien) {
        try {
          const data = await fetchDataBieuDoTron(giangVien.MABOMON, SelectNamHoc_HocKiNienKhoa); // 9 là giá trị MANAMHOC mặc định

          setDoughnut_GV_GioGiang({
            labels: ["Tổng giờ hành chính bộ môn", "Tổng giờ đã phân công"],
            datasets: [
              {
                label: "Số giờ",
                data: [
                  data.TotalGioGiangDay || 0,
                  data.TotalTongSoGio || 0,
                ],
                backgroundColor: ["#FF6384", "#36A2EB"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB"],
              },
            ],
          });
        } catch (error) {
          console.error("Lỗi khi lấy biểu đồ tròn:", error);
        }
      }
    };

    getBieuDoTron();

    const getBieuDoTron_PhanCong = async () => {
      if (giangVien) {
        try {
          const result = await fetchDataBieuDoTron_PhanCong(giangVien.MABOMON, SelectNamHoc_HocKiNienKhoa ? SelectNamHoc_HocKiNienKhoa : 23);
          const data = result; // Lấy phần tử đầu tiên từ mảng
          setPieData_GV_GioGiang_PhanCong({
            labels: [
              "Có trong bảng phân công",
              "Không có trong bảng phân công",
              // "Tổng số giảng viên",
            ],
            datasets: [
              {
                data: [
                  data.SoGiangVienCoTrongBangPhanCong || 0,
                  data.SoGiangVienKhongCoTrongBangPhanCong || 0,
                  // data.TongSoGiangVienThuocBoMon || 0,
                ],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          });
        } catch (error) {
          console.error("Lỗi khi lấy biểu đồ tròn:", error);
        }
      }
    };
    getBieuDoTron_PhanCong();

    const getListGV_BoMon = async () => {
      if (giangVien) {
        try {
          const listGV = await fetchGV_BoMon(giangVien.MABOMON, 1, 1000);
          setListGiangVien(listGV);
          setFilteredListgiangVien(listGV);
        } catch (error) {
          console.error("Lỗi khi lấy ds GV:", error);
        }
      }
    };
    getListGV_BoMon();

    // console.log("SelectNamHoc_HocKiNienKhoa: ", SelectNamHoc_HocKiNienKhoa)
  }, [giangVien, SelectNamHoc_HocKiNienKhoa]);

  const columns = [
    { field: "MAGV", headerName: "Mã Giảng Viên", width: 180 },
    { field: "TENGV", headerName: "Tên Giảng Viên", width: 200 },
    { field: "TENBOMON", headerName: "Bộ Môn", width: 180 },
    {
      field: "TENCHUCVU",
      headerName: "Chức vụ",
      width: 180,
    },
    {
      field: "TENCHUCDANH",
      headerName: "Chức danh",
      width: 180,
    },
    {
      field: "TONG_SO_GIO",
      headerName: "Phân công",
      width: 180,
    },
    {
      field: "TRANGTHAITAIKHOAN",
      headerName: "Tình Trạng",
      width: 180,
    },
    {
      field: "actions",
      headerName: "Chi tiết",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Link to="/admin/thong-ke-gv" state={{ giangVien: params.row }}>
          Mở Thống Kê Giảng Viên
        </Link>
      )
    },
  ];

  // Lọc giảng viên theo từ khóa tìm kiếm
  const filteredRows = listgiangVien.filter((gv) =>
    gv.MAGV.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gv.TENGV.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gv.TENBOMON.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowsWithAutoIncrementId = filteredRows.map((row, index) => ({
    ...row,
    id: index + 1,  // Gán id tự tăng (index + 1)
  }));

  return (
    <div className="row">
      <div className="form-group">
        <label htmlFor="selectNamHocHocKi">Chọn Năm Học - Học Kỳ:</label>
        <select
          id="selectNamHocHocKi"
          className="form-control"
          value={SelectNamHoc_HocKiNienKhoa || ""}
          onChange={(e) => setSelectNamHoc_HocKiNienKhoa(e.target.value)}
        >
          <option value="">-- Chọn --</option>
          {NamHoc_HocKiNienKhoa.map((item, index) => (
            <option key={index} value={item.MAHKNK}>
              {item.TENHKNK} - {item.TENNAMHOC}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <h4>Số giờ phân công.</h4>
        <PolarArea data={doughnut_GV_gioGiang} />
      </div>
      <div className="col-md-6">
        <h4>Phân công giảng viên</h4>
        <Pie data={pieData_GV_gioGiang_PhanCong} />
      </div>
      <div className="col-md-12 mt-3">
        <div className="container mt-4">
          <h2 className="text-center mb-4">Danh Sách Giảng Viên</h2>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ width: '100%' }}>
            <DataGrid
              rows={rowsWithAutoIncrementId}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
      {/* <div className="col-md-12 mt-3">
        <div className="container mt-4">
          <h2 className="text-center mb-4">Danh Sách Giảng Viên</h2>
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <table className="table table-hover table-bordered table-striped shadow-sm">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Mã Giảng Viên</th>
                <th scope="col">Tên Giảng Viên</th>
                <th scope="col">Bộ Môn</th>
                <th scope="col">Chức vụ</th>
                <th scope="col">Chức danh</th>
                <th scope="col">Phân công</th>
                <th scope="col">Tình Trạng</th>
                <th scope="col">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredListgiangVien.map((gv, index) => (
                <tr key={index}>
                  <td className="text-center font-weight-bold">{gv.MAGV}</td>
                  <td>{gv.TENGV}</td>
                  <td>{gv.TENBOMON}</td>
                  <td>{gv.TENCHUCVU || "Không có"}</td>
                  <td>{gv.TENCHUCDANH || "Không có"}</td>
                  <td>{gv.TONG_SO_GIO || "Không có"}</td>
                  <td>{gv.TRANGTHAITAIKHOAN || "Không rõ"}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewDetails(gv)}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div> */}

      {selectedGiangVien && (
        <ModalChiTietGV giangVien={selectedGiangVien} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ThongKe;