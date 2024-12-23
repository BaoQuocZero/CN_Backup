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
import {
  fetchDataGV,
  fetchDataBieuDoTron,
  fetchDataBieuDoTron_PhanCong
} from "./services/ThongKeServices";

const ThongKe = () => {
  const auth = Cookies.get("accessToken");
  const [giangVien, setGiangVien] = useState(null);

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
            labels: ["Giờ hành chính", "Giờ đã phân công"],
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

  }, [giangVien]);

  return (
    <div className="row">
      <div className="col-md-4">
        <h4>Số giờ phân công.</h4>
        <Doughnut data={doughnut_GV_gioGiang} />
      </div>
      <div className="col-md-4">
        <h4>Phân công giảng viên</h4>
        <Pie data={pieData_GV_gioGiang_PhanCong} />
      </div>

      <div className="col-md-12 mt-3">
        <h4>Danh sách Giảng viên</h4>
        <table className="table table-hover table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Mã Giảng Viên</th>
              <th scope="col">Tên Giảng Viên</th>
              <th scope="col">Bộ Môn</th>
              <th scope="col">Số Giờ Giảng</th>
              <th scope="col">Tình Trạng</th>
            </tr>
          </thead>
          <tbody>
            {/* Ví dụ dữ liệu bảng */}
            <tr>
              <td>GV001</td>
              <td>Nguyễn Văn A</td>
              <td>Toán</td>
              <td>30</td>
              <td><span className="badge badge-success">Đã phân công</span></td>
            </tr>
            <tr>
              <td>GV002</td>
              <td>Trần Thị B</td>
              <td>Lý</td>
              <td>20</td>
              <td><span className="badge badge-warning">Chưa phân công</span></td>
            </tr>
            <tr>
              <td>GV003</td>
              <td>Phạm Minh C</td>
              <td>Hóa</td>
              <td>25</td>
              <td><span className="badge badge-success">Đã phân công</span></td>
            </tr>
            <tr>
              <td>GV004</td>
              <td>Lê Quang D</td>
              <td>Sinh</td>
              <td>15</td>
              <td><span className="badge badge-warning">Chưa phân công</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ThongKe;