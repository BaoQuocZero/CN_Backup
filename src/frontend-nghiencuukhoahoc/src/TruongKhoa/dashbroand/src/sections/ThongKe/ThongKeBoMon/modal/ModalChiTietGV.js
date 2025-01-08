import React from "react";

const ModalChiTietGV = ({ giangVien, onClose }) => {
    if (!giangVien) return null;

    return (
        <div className="modal show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content shadow-lg">
                    <div className="modal-header">
                        <h5 className="modal-title">Thông Tin Chi Tiết Giảng Viên</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p><strong>Mã Giảng Viên:</strong> {giangVien.MAGV}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Tên Giảng Viên:</strong> {giangVien.TENGV}</p>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p><strong>Bộ Môn:</strong> {giangVien.TENBOMON}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Chức Vụ:</strong> {giangVien.TENCHUCVU || "Không có"}</p>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p><strong>Chức Danh:</strong> {giangVien.TENCHUCDANH || "Không có"}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Email:</strong> {giangVien.EMAIL}</p>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <p><strong>Điện Thoại:</strong> {giangVien.DIENTHOAI}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Địa Chỉ:</strong> {giangVien.DIACHI}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Tình Trạng:</strong> {giangVien.TRANGTHAITAIKHOAN}</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalChiTietGV;