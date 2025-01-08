import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import CookiesAxios from "../CookiesAxios";

import ModalBaoCao from "./modal/ModalBaoCao.jsx";

const XemPhanCongGV = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [giangVien, setGiangVien] = useState(null);
    const [phanCong, setPhanCong] = useState({});
    const [filteredPhanCong, setFilteredPhanCong] = useState([]);

    const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm
    const [selectedMonHoc, setSelectedMonHoc] = useState(null);
    const [openModal, setOpenModal] = useState(false);

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

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredPhanCong(phanCong);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = phanCong.filter((item) =>
                Object.values(item).some((value) => {
                    // Kiểm tra nếu value không null hoặc undefined, sau đó chuyển thành chuỗi và so sánh
                    return value && value.toString().toLowerCase().includes(query);
                })
            );
            setFilteredPhanCong(filtered);
        }
    }, [searchQuery, phanCong]);

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
                `${process.env.REACT_APP_URL_SERVER}/api/v1/quyengiangvien/thongke/getPhanCongGV_MAGV`,
                { MAGV }
            );
            if (response.data.EC === 1 && response.data.DT[0].MAPHANCONG) {
                // Kiểm tra nếu MAPHANCONG khác null thì tiếp tục xử lý
                setPhanCong(response.data.DT);
                setLoading(false);
            } else {
                // Trường hợp không hợp lệ hoặc không có dữ liệu
                setError("Không tìm thấy dữ liệu phân công hoặc MAPHANCONG không hợp lệ!");
                setLoading(false);
            }

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu phân công:", error);
            setError("Lỗi khi lấy dữ liệu phân công!");
            setLoading(false);
        }
    };

    const handleBaoCao = (monHoc) => {
        setSelectedMonHoc(monHoc); // Cập nhật trạng thái khi chọn môn học
        setOpenModal(true);
    };

    const handleSave = async (fromKetThuc) => {
        try {
            // console.log("fromKetThuc: ", fromKetThuc)
            const response = await CookiesAxios.post(
                `${process.env.REACT_APP_URL_SERVER}/api/v1/quyengiangvien/thongke/createBaoCaoKetThuc`,
                { fromKetThuc }
            );
            setOpenModal(false);
            fetchDataPhanCongGV(giangVien.MAGV); // Làm mới danh sách
            toast.success(response.data.EM);
        } catch (error) {
            console.error("Error saving dánh giá:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container my-4">
                <h1 className="mb-4">Thông tin phân công</h1>
                <input
                    type="text"
                    className="form-control mb-4"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredPhanCong && filteredPhanCong.length > 0 ? (
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>

                                <th>Ngày bắt đầu</th>
                                <th>Tên học kỳ</th>
                                <th>Năm học</th>
                                <th>Môn học</th>
                                <th>Lớp</th>
                                <th>Tổng số giờ</th>
                                <th>Kết thúc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPhanCong.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(item.NGAYBATDAUNIENKHOA).toLocaleDateString()}</td>
                                    <td>{item.TENHKNK}</td>
                                    <td>{item.TEN_NAM_HOC}</td>
                                    <td>{item.TENMONHOC}</td>
                                    <td>{item.MALOP}</td>
                                    <td>{item.TONG_SO_GIO}</td>
                                    <td>
                                        {item.MADANHGIAKETTHUC ? (
                                            <>
                                                {item.TRANG_THAI_DANG_KY === "Không rõ" ? (
                                                    <>
                                                        <button
                                                            className="btn btn-warning"
                                                            onClick={() => handleBaoCao(item)}
                                                        >
                                                            Sửa Báo cáo
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-danger">
                                                            Báo cáo đã duyệt
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleBaoCao(item)}
                                                >
                                                    Tạo Báo cáo
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-warning" role="alert">
                        Không có phân công nào.
                    </div>
                )}
            </div>
            {/* Render Modal */}
            <ModalBaoCao
                monHoc={selectedMonHoc}
                open={openModal}
                onSave={handleSave}
                onClose={() => setOpenModal(false)}
            />
        </>
    );
};

export default XemPhanCongGV;