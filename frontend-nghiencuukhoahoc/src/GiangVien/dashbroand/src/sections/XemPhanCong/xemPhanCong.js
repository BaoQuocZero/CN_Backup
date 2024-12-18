import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import CookiesAxios from "../CookiesAxios";

const XemPhanCongGV = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [giangVien, setGiangVien] = useState(null);
    const [phanCong, setPhanCong] = useState({});

    // Lấy thông tin giảng viên từ token
    useEffect(() => {
        const auth = Cookies.get("accessToken");
        if (auth) {
            const decodeAuth = jwtDecode(auth);
            fetchDataGV(decodeAuth.taikhoan);
        } else {
            setError("Token không tồn tại!");
        }
    }, []);

    // Khi giangVien có giá trị, lấy phân công của giảng viên
    useEffect(() => {
        if (giangVien && giangVien.MAGV) {
            fetchDataPhanCongGV(giangVien.MAGV);
        }
    }, [giangVien]);

    const fetchDataGV = async (taikhoan) => {
        try {
            const response = await CookiesAxios.get(
                `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/giangvien/only/xemprofile/${taikhoan}`
            );
            if (response.data.EC === 1) {
                setGiangVien(response.data.DT);
            } else {
                setError("Không tìm thấy thông tin giảng viên!");
                setLoading(false);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giảng viên:", error);
            setError("Lỗi khi lấy thông tin giảng viên!");
            setLoading(false);
        }
    };

    const fetchDataPhanCongGV = async (MAGV) => {
        try {
            const response = await CookiesAxios.post(
                `${process.env.REACT_APP_URL_SERVER}/api/v1/quyengiangvien/giangvien/xem/phancong`,
                { MAGV }
            );
            if (response.data.EC === 1) {
                setPhanCong(response.data.DT);
                setLoading(false);
            } else {
                setError("Không tìm thấy dữ liệu phân công!");
                setLoading(false);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu phân công:", error);
            setError("Lỗi khi lấy dữ liệu phân công!");
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <div className="container my-4">
                <h1 className="mb-4">Thông tin phân công</h1>

                {phanCong && phanCong.length > 0 ? (
                    phanCong.map((item, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Mã Phân Công Số: {item.MAPHANCONG}</h5>
                                <h5 className="card-title">Được Phân Vào: {new Date(item.THOIGIANLAP).toLocaleString()}</h5>
                                <div className="row">
                                    {/* Cột 1 */}
                                    <div className="col-md-6">
                                        <p className="card-text"><strong>Tên Lớp:</strong> {item.TENLOP}</p>
                                        <p className="card-text"><strong>Sĩ Số Lớp:</strong> {item.SISO}</p>
                                        <p className="card-text"><strong>Số Giờ Dạy:</strong> {item.TONG_SO_GIO} giờ</p>
                                        <p className="card-text"><strong>Năm Tuyển Sinh:</strong> {item.NAMTUYENSINH}</p>
                                    </div>

                                    {/* Cột 2 */}
                                    <div className="col-md-6">
                                        <p className="card-text"><strong>Tên Môn Học:</strong> {item.TENMONHOC}</p>
                                        <p className="card-text"><strong>Tín Chỉ Lý Thuyết:</strong> {item.SOTINCHILYTHUYET} tín chỉ</p>
                                        <p className="card-text"><strong>Tín Chỉ Thực Hành:</strong> {item.SOTINCHITHUCHANH} tín chỉ</p>
                                        <p className="card-text"><strong>Thời Gian Phân Công:</strong> {new Date(item.THOIGIANLAP).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-warning" role="alert">
                        Không có phân công nào.
                    </div>
                )}
            </div>
        </>
    );
};

export default XemPhanCongGV;