import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { DataGrid } from "@mui/x-data-grid";

import {
    fetchDataGV,
    fetchBieuDo_GioGiang,
    fetchBieuDo_GioGiangChonKhung,
    fetchDataNamHoc,
    fetchPhanCongGVThongKe,
} from "./services/ThongKeServices";

import BieuDoGioGiangDay from "./Components/BieuDoGioGiangDay";

const ThongKeGV = () => {
    // Dùng useLocation để lấy dữ liệu từ state
    const location = useLocation();
    const giangVien = location.state?.giangVien;
    const [bieuDoDataLine, setBieuDoDataLine] = useState(null);
    const [NamHoc_HocKiNienKhoa, setNamHoc_HocKiNienKhoa] = useState([]);
    const [SelectNamHoc_HocKiNienKhoa, setSelectNamHoc_HocKiNienKhoa] = useState(null);
    const [PhanCongGVThongKe, setPhanCongGVThongKe] = useState([]);



    useEffect(() => {
        const getNamHoc_HocKiNienKhoa = async () => {
            try {
                const NamHoc_HocKiNienKhoa = await fetchDataNamHoc();
                setNamHoc_HocKiNienKhoa(NamHoc_HocKiNienKhoa);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách năm học:", error);
            }
        };

        getNamHoc_HocKiNienKhoa();
    }, []);
    // Fetch dữ liệu biểu đồ khi giảng viên có dữ liệu
    useEffect(() => {
        if (!giangVien) return;

        const getBieuDo_GioGiang = async () => {
            try {
                const data = await fetchBieuDo_GioGiang(giangVien.MAGV);

                // Chuyển đổi dữ liệu thành dạng phù hợp cho biểu đồ
                const labels = data.map(item => item.TENHKNK + " " + item.TEN_NAM_HOC); // Học kỳ
                const totalHours = data.map(item => parseInt(item.TONG_GIO)); // Tổng giờ

                // Cập nhật dữ liệu cho biểu đồ
                setBieuDoDataLine({
                    labels: labels,
                    datasets: [
                        {
                            label: "Đường số giờ giảng dạy",
                            data: totalHours,
                            borderColor: "#FF6384", // Màu đường
                            backgroundColor: "rgba(255, 99, 132, 0.2)", // Màu nền phía dưới đường
                            fill: true, // Điền màu phía dưới đường
                            borderWidth: 4, // Độ dày của đường
                            lineTension: 0.4, // Mức độ cong của đường
                            pointBackgroundColor: "#FF6384", // Màu sắc của các điểm trên đường
                            pointRadius: 6, // Kích thước các điểm
                            pointHoverRadius: 8, // Kích thước khi hover
                            pointBorderWidth: 2, // Độ dày của viền điểm
                            pointHoverBackgroundColor: "#FF6384", // Màu nền của điểm khi hover
                            pointBorderColor: "#fff", // Màu viền của điểm
                            tension: 0.4, // Mức độ cong cho các điểm
                        },
                    ],
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
            }
        };
        getBieuDo_GioGiang();

    }, [giangVien]);

    useEffect(() => {
        if (!SelectNamHoc_HocKiNienKhoa) return;

        const getBieuDo_GioGiangChonKhung = async () => {
            try {
                const data = await fetchPhanCongGVThongKe(giangVien.MAGV, SelectNamHoc_HocKiNienKhoa);
                const dataWithId = data?.map((gv, index) => ({
                    ...gv,
                    id: index + 1,
                }));
                setPhanCongGVThongKe(dataWithId)
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
            }
        };

        getBieuDo_GioGiangChonKhung();
    }, [SelectNamHoc_HocKiNienKhoa]);

    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "TENMONHOC", headerName: "Môn", width: 200 },
        { field: "TENHKNK", headerName: "Học kỳ", width: 100 },
        { field: "MALOP", headerName: "Mã lớp", width: 100 },
        { field: "TENLOP", headerName: "Tên lớp", width: 200 },
        { field: "NAMTUYENSINH", headerName: "Khóa", width: 100 },
        { field: "NGAYDANHGIA", headerName: "Ngày đánh giá", width: 150 },
        { field: "NGAYBAOCAOKETTHUC", headerName: "Ngày báo cáo", width: 150 },
        { field: "TENDANHGIA", headerName: "Loại đánh giá", width: 150 },
    ];

    if (!giangVien) {
        return <div>Không có dữ liệu giảng viên.</div>;
    }
    return (
        <div className="row">
            <h2>Giảng viên: {giangVien.TENGV}</h2>
            <div className="col-6">
                <p><strong>Mã Giảng Viên:</strong> {giangVien.MAGV}</p>
                <p><strong>Chức vụ:</strong> {giangVien.TENCHUCVU}</p>
                <p><strong>Chức danh:</strong> {giangVien.TENCHUCDANH}</p>
                <p><strong>Thời gian nhận:</strong> {giangVien.THOIGIANNHAN}</p>
                <p><strong>Điện thoại:</strong> {giangVien.DIENTHOAI}</p>
            </div>
            <div className="col-6">
                <p><strong>Địa chỉ:</strong> {giangVien.DIACHI}</p>
                <p><strong>Bộ môn:</strong> {giangVien.TENBOMON}</p>
                <p><strong>Phân quyền:</strong> {giangVien.PHANQUYEN}</p>
                <p><strong>Trạng thái tài khoản:</strong> {giangVien.TRANGTHAITAIKHOAN}</p>
            </div>
            <div className="col-md-7">
                <h2>Biểu đồ tổng số giờ giảng dạy</h2>
                {bieuDoDataLine ? (
                    <Line data={bieuDoDataLine} />
                ) : (
                    <p>Đang tải dữ liệu biểu đồ...</p>
                )}
            </div>
            <div className="col-md-5">
                <BieuDoGioGiangDay giangVien={giangVien} />
            </div>

            <div className="col-md-12">
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
                            <option key={index} value={item.TENNAMHOC}>
                                {item.TENNAMHOC}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ height: 300, width: "100%" }}>
                    <DataGrid rows={PhanCongGVThongKe} columns={columns} pageSize={5} />
                </div>
            </div>
        </div>
    );
};

export default ThongKeGV;