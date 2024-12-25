import React, { useEffect, useState } from "react";
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
import {
  fetchDataGV,
  fetchDataBieuDoTron,
  fetchDataBieuDoTron_PhanCong,
  fetchGV_BoMon
} from "./services/ThongKeServices";

const ThongKe = () => {
  const auth = Cookies.get("accessToken");
  const [giangVien, setGiangVien] = useState(null);
  const [listgiangVien, setListGiangVien] = useState([]);
  const [selectedGiangVien, setSelectedGiangVien] = useState(null);

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
    // Gọi API lấy dữ liệu biểu đồ tròn khi có thông tin giảng viên
    const getBieuDoTron = async () => {
      if (giangVien) {
        try {
          const data = await fetchDataBieuDoTron(giangVien.MABOMON, 9); // 9 là giá trị MANAMHOC mặc định

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
          const result = await fetchDataBieuDoTron_PhanCong(giangVien.MABOMON, 23);
          const data = result[0]; // Lấy phần tử đầu tiên từ mảng
          console.log("data: ", data);

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
          // console.log("listGV: ", listGV);
          setListGiangVien(listGV);
          setTotalPages(Math.ceil(listGV.DT.length / pageSize));  // Update total pages
        } catch (error) {
          console.error("Lỗi khi lấy ds GV:", error);
        }
      }
    };
    getListGV_BoMon();

  }, [giangVien, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Số giờ phân công.</h4>
        <Doughnut data={doughnut_GV_gioGiang} />
      </div>
      <div className="col-md-6">
        <h4>Phân công giảng viên</h4>
        <Pie data={pieData_GV_gioGiang_PhanCong} />
      </div>
      <div className="col-md-12 mt-3">
        <div class="alert alert-warning" role="alert">
          Về phần sấp xếp bảng đang chuyển sang dùng DataGrid
        </div>
        <div className="container mt-4">
          <h2 className="text-center mb-4">Danh Sách Giảng Viên</h2>
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
              {listgiangVien.map((gv, index) => (
                <tr key={index}>
                  <td className="text-center font-weight-bold">{gv.MAGV}</td>
                  <td>{gv.TENGV}</td>
                  <td>{gv.TENBOMON}</td>
                  <td>{gv.TENCHUCVU || "Không có"}</td>
                  <td>{gv.TENCHUCDANH || "Không có"}</td>
                  <td>{gv.MAPHANCONG || "Không có"}</td>
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

          {/* Pagination Controls */}
          <div class="alert alert-danger" role="alert">
            Lỗi phân trang đang sửa
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedGiangVien && (
        <ModalChiTietGV giangVien={selectedGiangVien} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ThongKe;