import React, { useState, useEffect } from "react";
import CookiesAxios from "../../CookiesAxios";
import { toast } from "react-toastify";

const ModalBaoCao = ({ monHoc, open, onSave, onClose }) => {
    const [hinhThucDanhGia, setHinhThucDanhGia] = useState([])
    const [formData, setFormData] = useState({
        MAPHANCONG: "",
        MAMONHOC: "",
        TENMONHOC: "",
        MALOP: "",
        TENHKNK: "",
        TEN_NAM_HOC: "",
        TONG_SO_GIO: 0,
        LANDANHGIA: "",
        NGAYDANHGIA: "",
        NGAYBAOCAOKETTHUC: "",
        TRANG_THAI_DANG_KY: "Chờ duyệt",
        MADANHGIAKETTHUC: "",
        TENDANHGIA: "",
    });

    useEffect(() => {
        if (monHoc) {
            setFormData({
                MAPHANCONG: monHoc?.MAPHANCONG || "",
                MAMONHOC: monHoc?.MAMONHOC || "",
                TENMONHOC: monHoc?.TENMONHOC || "",  // Tên môn học
                MALOP: monHoc?.MALOP || "",  // Mã lớp (nếu có trong monHoc)
                TENHKNK: monHoc?.TENHKNK || "",  // Tên học kỳ niên khóa (nếu có)
                TEN_NAM_HOC: monHoc?.TEN_NAM_HOC || "",  // Năm học (nếu có)
                TONG_SO_GIO: monHoc?.TONG_SO_GIO || 0,  // Tổng số giờ (nếu có)
                LANDANHGIA: monHoc?.LANDANHGIA || "",  // Lần đánh giá (nếu có)
                NGAYDANHGIA: monHoc?.NGAYDANHGIA ? monHoc?.NGAYDANHGIA.slice(0, 10) : "", // Lấy 10 ký tự đầu (yyyy-mm-dd)
                NGAYBAOCAOKETTHUC: monHoc?.NGAYBAOCAOKETTHUC ? monHoc?.NGAYBAOCAOKETTHUC.slice(0, 10) : "", // Lấy 10 ký tự đầu (yyyy-mm-dd)
                TRANG_THAI_DANG_KY: monHoc?.TRANG_THAI_DANG_KY || "Không rõ",  // Trạng thái đăng ký (nếu có)
                MADANHGIAKETTHUC: monHoc?.MADANHGIAKETTHUC || "",
                TENDANHGIA: monHoc?.TENDANHGIA || "",  // Tên đánh giá (nếu có)
            });
        }
        fetchDanhGia();  // Lấy danh sách hình thức đánh giá khi mở modal
    }, [monHoc, open]);  // Cập nhật khi monHoc hoặc open thay đổi

    const fetchDanhGia = async () => {
        try {
            const response = await CookiesAxios.get(
                `${process.env.REACT_APP_URL_SERVER}/api/v1/quyengiangvien/thongke/getHinhThucDanhGia`
            );
            // console.log("response.data.DT: ", response.data.DT)
            if (response.data.EC === 1) {
                setHinhThucDanhGia(response.data.DT);
            } else {
                console.log("Không tìm thấy thông tin fetchDanhGia!");
            }

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu fetchDanhGia:", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className={`modal ${open ? "show" : ""}`} style={{ display: open ? "block" : "none" }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered mt-5">
                <div className="modal-content mt-5">
                    <div className="modal-header">
                        <h5 className="modal-title">Báo cáo: {formData.TENMONHOC}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="TENMONHOC" className="form-label">Tên môn học</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="TENMONHOC"
                                                name="TENMONHOC"
                                                value={formData.TENMONHOC}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="MALOP" className="form-label">Lớp</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="MALOP"
                                                name="MALOP"
                                                value={formData.MALOP}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="TENHKNK" className="form-label">Học kỳ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="TENHKNK"
                                                name="TENHKNK"
                                                value={formData.TENHKNK}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="TEN_NAM_HOC" className="form-label">Năm học</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="TEN_NAM_HOC"
                                                name="TEN_NAM_HOC"
                                                value={formData.TEN_NAM_HOC}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="TONG_SO_GIO" className="form-label">Tổng số giờ</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="TONG_SO_GIO"
                                                name="TONG_SO_GIO"
                                                value={formData.TONG_SO_GIO}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="TENDANHGIA" className="form-label">Tên đánh giá</label>
                                            <select
                                                className="form-control"
                                                id="TENDANHGIA"
                                                name="MADANHGIAKETTHUC"
                                                value={formData.MADANHGIAKETTHUC}
                                                onChange={handleChange}
                                            >
                                                <option value="">Chọn hình thức đánh giá</option>
                                                {hinhThucDanhGia.map((item) => (
                                                    <option key={item.MADANHGIAKETTHUC} value={item.MADANHGIAKETTHUC}>
                                                        {item.TENDANHGIA}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="LANDANHGIA" className="form-label">Lần đánh giá</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="LANDANHGIA"
                                                name="LANDANHGIA"
                                                value={formData.LANDANHGIA}
                                                placeholder="1-2"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="NGAYDANHGIA" className="form-label">Ngày đánh giá</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="NGAYDANHGIA"
                                                name="NGAYDANHGIA"
                                                value={formData.NGAYDANHGIA}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="NGAYBAOCAOKETTHUC" className="form-label">Ngày báo cáo kết thúc</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="NGAYBAOCAOKETTHUC"
                                                name="NGAYBAOCAOKETTHUC"
                                                value={formData.NGAYBAOCAOKETTHUC}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="TRANG_THAI_DANG_KY" className="form-label">Trạng thái đăng ký</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="TRANG_THAI_DANG_KY"
                                                name="TRANG_THAI_DANG_KY"
                                                value={formData.TRANG_THAI_DANG_KY}
                                                onChange={handleChange}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Báo cáo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalBaoCao;