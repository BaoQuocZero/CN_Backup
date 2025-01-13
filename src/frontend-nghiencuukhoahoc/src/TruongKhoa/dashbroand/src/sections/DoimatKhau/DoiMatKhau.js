import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Đảm bảo import đúng
import CookiesAxios from "../CookiesAxios";
import { fetchDataGV } from "./Services/DoiMatKhauService";

const DoiMatKhau = () => {
    const auth = Cookies.get("accessToken");
    const [giangVien, setGiangVien] = useState(null);
    const [form, setForm] = useState({
        matKhauCu: "",
        matKhauMoi: "",
        xacNhanMatKhauMoi: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Xử lý đổi mật khẩu
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const { matKhauCu, matKhauMoi, xacNhanMatKhauMoi } = form;

        // Kiểm tra độ dài mật khẩu mới
        if (matKhauMoi.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        if (matKhauMoi !== xacNhanMatKhauMoi) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            const response = await CookiesAxios.post(
                `${process.env.REACT_APP_URL_SERVER}/api/v1/quyengiangvien/giangvien/doimatkhau`,
                {
                    TENDANGNHAP: giangVien?.TENDANGNHAP,
                    MATKHAU_CU: matKhauCu,
                    MATKHAU_MOI: matKhauMoi,
                }
            );

            if (response.data.EC === 1) {
                setSuccess("Đổi mật khẩu thành công!");
                setForm({ matKhauCu: "", matKhauMoi: "", xacNhanMatKhauMoi: "" });
            } else {
                setError(response.data.EM || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            setError("Không thể đổi mật khẩu. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="container">
            <h2 className="mt-4">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label htmlFor="matKhauCu" className="form-label">
                        Mật khẩu cũ
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="matKhauCu"
                        name="matKhauCu"
                        value={form.matKhauCu}
                        onChange={handleChange}
                        placeholder="Nếu tài khoản chưa có mật khẩu thì không cần nhập!"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="matKhauMoi" className="form-label">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="matKhauMoi"
                        name="matKhauMoi"
                        value={form.matKhauMoi}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="xacNhanMatKhauMoi" className="form-label">
                        Xác nhận mật khẩu mới
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="xacNhanMatKhauMoi"
                        name="xacNhanMatKhauMoi"
                        value={form.xacNhanMatKhauMoi}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <button type="submit" className="btn btn-primary">
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default DoiMatKhau;