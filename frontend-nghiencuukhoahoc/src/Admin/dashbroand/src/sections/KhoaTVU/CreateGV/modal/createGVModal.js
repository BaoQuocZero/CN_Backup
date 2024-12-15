// src/modal/CreateGVModal.jsx
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const CreateGVModal = ({
    isOpenModal,
    handleCloseModal,
    TenGV,
    setTenGV,
    TenDangNhapGV,
    setTenDangNhapGV,
    QuyenGiangVien,
    setQuyenGiangVien,
    MaGV,
    setMaGV,
    TrangThaiGV,
    setTrangThaiGV,
    handleSubmit
}) => {
    if (!isOpenModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{QuyenGiangVien ? "Sửa Giảng Viên" : "Thêm Giảng Viên"}</h3>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTenGV">
                        <Form.Label>Tên Giảng Viên</Form.Label>
                        <Form.Control
                            type="text"
                            value={TenGV}
                            onChange={(e) => setTenGV(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formTenDangNhapGV">
                        <Form.Label>Tên Đăng Nhập Giảng Viên</Form.Label>
                        <Form.Control
                            type="text"
                            value={TenDangNhapGV}
                            onChange={(e) => setTenDangNhapGV(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formQuyenGV">
                        <Form.Label>Quyền Giảng Viên</Form.Label>
                        <FormControl fullWidth>
                            <InputLabel id="quyen-giang-vien-label">Quyền Giảng Viên</InputLabel>
                            <Select
                                labelId="quyen-giang-vien-label"
                                value={QuyenGiangVien}
                                label="Quyền Giảng Viên"
                                onChange={(e) => setQuyenGiangVien(e.target.value)}
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="GiangVien">Giảng Viên</MenuItem>
                            </Select>
                        </FormControl>
                    </Form.Group>

                    <Form.Group controlId="formMaGV">
                        <Form.Label>Mã Giảng Viên</Form.Label>
                        <Form.Control
                            type="text"
                            value={MaGV}
                            onChange={(e) => setMaGV(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formTrangThaiGV">
                        <Form.Label>Trạng Thái Giảng Viên</Form.Label>
                        <FormControl fullWidth>
                            <InputLabel id="trang-thai-giang-vien-label">Trạng Thái</InputLabel>
                            <Select
                                labelId="trang-thai-giang-vien-label"
                                value={TrangThaiGV}
                                label="Trạng Thái Giảng Viên"
                                onChange={(e) => setTrangThaiGV(e.target.value)}
                            >
                                <MenuItem value="Active">Hoạt Động</MenuItem>
                                <MenuItem value="Inactive">Không Hoạt Động</MenuItem>
                            </Select>
                        </FormControl>
                    </Form.Group>

                    <div className="modal-actions">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button variant="primary" type="submit">
                            {QuyenGiangVien ? "Lưu" : "Thêm"}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CreateGVModal;