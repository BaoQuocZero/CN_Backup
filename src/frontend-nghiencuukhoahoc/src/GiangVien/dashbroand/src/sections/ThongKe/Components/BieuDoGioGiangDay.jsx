import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { PolarArea } from "react-chartjs-2";

import {
    fetchDataGV,
    fetchBieuDo_GioGiangChonKhung,
    fetchDataNamHoc,
} from "../services/ThongKeServices";

const BieuDoGioGiangDay = () => {
    const auth = Cookies.get("accessToken");
    const [giangVien, setGiangVien] = useState(null);
    const [NamHoc_HocKiNienKhoa, setNamHoc_HocKiNienKhoa] = useState([]);
    const [bieuDoDataTron, setBieuDoDataTron] = useState(null);
    const [SelectNamHoc_HocKiNienKhoa, setSelectNamHoc_HocKiNienKhoa] = useState(null);

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
        if (!giangVien || !SelectNamHoc_HocKiNienKhoa) return;

        const getBieuDo_GioGiangChonKhung = async () => {
            try {
                const data = await fetchBieuDo_GioGiangChonKhung(giangVien.MAGV, SelectNamHoc_HocKiNienKhoa);

                const labels = ["Giờ giảng dạy hành chính", "Số giờ đã đăng ký"];
                const values = [
                    data[0]?.GIOGIANGDAY_HANHCHINH || 0,
                    parseInt(data[0]?.TONG_GIO) || 0,
                ];

                setBieuDoDataTron({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: ["#FF6384", "#36A2EB"],
                        },
                    ],
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
            }
        };

        getBieuDo_GioGiangChonKhung();
    }, [giangVien, SelectNamHoc_HocKiNienKhoa]);

    return (
        <div>
            <h2>Biểu đồ giờ giảng dạy</h2>
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
            {bieuDoDataTron ? (
                <PolarArea data={bieuDoDataTron} />
            ) : (
                <p>Đang tải dữ liệu biểu đồ...</p>
            )}
        </div>
    );
};

export default BieuDoGioGiangDay;