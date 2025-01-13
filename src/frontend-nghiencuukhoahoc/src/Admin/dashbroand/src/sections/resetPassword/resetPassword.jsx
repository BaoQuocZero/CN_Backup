import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CookiesAxios from "../CookiesAxios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // Sử dụng Spinner

export default function ResetPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // Bước hiện tại (1: nhập email, 2: nhập mã bảo mật, 3: đặt lại mật khẩu)
    const [form, setForm] = useState({
        email: "",
        maBaoMat: "",
        matKhauMoi: "",
        xacNhanMatKhauMoi: "",
    });
    const [maBaomat, setMaBaomat] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false); // Trạng thái loading

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không khi người dùng thay đổi
        if (name === "matKhauMoi" || name === "xacNhanMatKhauMoi") {
            if (form.matKhauMoi !== form.xacNhanMatKhauMoi) {
                setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            } else {
                setError("");
            }
        }
    };

    // Gửi mã bảo mật
    const handleSendCode = async (e) => {
        toast.warning("Đợi một chút trong khi chúng tôi kiểm tra yêu cầu của bạn!");
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true); // Bắt đầu loading

        try {
            const response = await CookiesAxios.post(
                `${process.env.REACT_APP_URL_SERVER}/api/v1/quyengiangvien/giangvien/QuenMatKhau`,
                { TENDANGNHAP: form.email }
            );
            if (response.data.EC === 1) {
                setSuccess("Mã bảo mật đã được gửi đến email của bạn.");
                setMaBaomat(response.data.DT);
                setStep(2); // Chuyển sang bước nhập mã bảo mật
            } else {
                setError(response.data.EM || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error("Lỗi gửi mã bảo mật:", error);
            setError("Không thể gửi mã. Vui lòng thử lại sau.");
        } finally {
            setLoading(false); // Dừng loading khi API trả về
        }
    };

    // Xác thực mã bảo mật
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.maBaoMat !== maBaomat) {
            setError("Mã bảo mật không đúng!");
            return;
        }

        setSuccess("Mã bảo mật chính xác. Vui lòng đặt lại mật khẩu.");
        setStep(3); // Chuyển sang bước đặt lại mật khẩu
    };

    // Đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const { matKhauMoi, xacNhanMatKhauMoi } = form;

        if (matKhauMoi !== xacNhanMatKhauMoi) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        setLoading(true); // Bắt đầu loading

        try {
            const response = await CookiesAxios.post(
                `${process.env.REACT_APP_URL_SERVER}/api/v1/quyengiangvien/giangvien/doimatkhau/reset`,
                { TENDANGNHAP: form.email, MATKHAU_MOI: matKhauMoi }
            );

            if (response.data.EC === 1) {
                toast.success("Đặt lại mật khẩu thành công!");
                setSuccess("Đặt lại mật khẩu thành công!");
                setStep(1); // Quay lại bước nhập email
                setForm({
                    email: "",
                    maBaoMat: "",
                    matKhauMoi: "",
                    xacNhanMatKhauMoi: "",
                });
                navigate("/");
            } else {
                setError(response.data.EM || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error("Lỗi đặt lại mật khẩu:", error);
            setError("Không thể đặt lại mật khẩu. Vui lòng thử lại sau.");
        } finally {
            setLoading(false); // Dừng loading khi API trả về
        }
    };

    return (
        <div className="container">
            <h2 className="mt-4">Quên mật khẩu</h2>
            {step === 1 && (
                <form onSubmit={handleSendCode} className="mt-3">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Nhập email của bạn
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <ClipLoader size={20} color="#ffffff" /> : "Gửi mã bảo mật"}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyCode} className="mt-3">
                    <div className="mb-3">
                        <label htmlFor="maBaoMat" className="form-label">
                            Nhập mã bảo mật
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="maBaoMat"
                            name="maBaoMat"
                            value={form.maBaoMat}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <ClipLoader size={20} color="#ffffff" /> : "Xác nhận mã bảo mật"}
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleResetPassword} className="mt-3">
                    <div className="mb-3">
                        <label htmlFor="matKhauMoi" className="form-label">
                            Nhập mật khẩu mới
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
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <ClipLoader size={20} color="#ffffff" /> : "Đặt lại mật khẩu"}
                    </button>
                </form>
            )}
        </div>
    );
}