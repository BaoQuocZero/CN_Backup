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
    fetchBieuDo_GioGiang,
    fetchBieuDo_GioGiangChonKhung
} from "./services/ThongKeServices";

const ThongKe = () => {
    const auth = Cookies.get("accessToken");
    const [giangVien, setGiangVien] = useState(null);
    const [bieuDoDataLine, setBieuDoDataLine] = useState(null);
    const [bieuDoDataTron, setBieuDoDataTron] = useState(null);

    // Fetch giảng viên
    useEffect(() => {
        const decodeAuth = jwtDecode(auth);

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
        const getBieuDo_GioGiangChonKhung = async () => {
            try {
                const data = await fetchBieuDo_GioGiangChonKhung(giangVien.MAGV);
                console.log("Data: ", data);

                // Lấy giá trị GIOGIANGDAY_HANHCHINH và TONG_GIO từ dữ liệu
                const labels = ['Giờ giảng dạy hành chính', 'Số giờ đã đăng ký']; // Nhãn cho biểu đồ
                const values = [
                    data[0].GIOGIANGDAY_HANHCHINH, // Giá trị Giờ giảng dạy hành chính
                    parseInt(data[0].TONG_GIO) // Giá trị Tổng số giờ giảng dạy
                ];

                // Cập nhật dữ liệu cho biểu đồ
                setBieuDoDataTron({
                    labels: labels, // Nhãn cho biểu đồ
                    datasets: [
                        {
                            data: values, // Dữ liệu cho biểu đồ
                            backgroundColor: ["#FF6384", "#36A2EB"], // Màu sắc cho các phần trong biểu đồ
                        },
                    ],
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
            }
        };
        getBieuDo_GioGiangChonKhung();


    }, [giangVien]);

    return (
        <div className="row">
            <div className="col-md-7">
                <h2>Biểu đồ tổng số giờ giảng dạy</h2>
                {bieuDoDataLine ? (
                    <Line data={bieuDoDataLine} />
                ) : (
                    <p>Đang tải dữ liệu biểu đồ...</p>
                )}
            </div>
            <div className="col-md-5">
                <h2>Biểu đồ giờ giảng dạy</h2>
                {bieuDoDataTron ? (
                    <PolarArea data={bieuDoDataTron} />
                ) : (
                    <p>Đang tải dữ liệu biểu đồ...</p>
                )}
            </div>
        </div>
    );
};

export default ThongKe;