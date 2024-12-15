// src/components/CreateGiangVienForm.jsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import CreateGVModal from '../modal/createGVModal'; // Nhập đúng path của modal

const CreateGiangVienForm = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [TenGV, setTenGV] = useState('');
  const [TenDangNhapGV, setTenDangNhapGV] = useState('');
  const [QuyenGiangVien, setQuyenGiangVien] = useState('');
  const [MaGV, setMaGV] = useState('');
  const [TrangThaiGV, setTrangThaiGV] = useState('');

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  // Các hàm xử lý khi thêm hoặc chỉnh sửa giảng viên
  const handleSumitAddGV = () => {
    console.log('Thêm giảng viên: ', TenGV, TenDangNhapGV, QuyenGiangVien, MaGV, TrangThaiGV);
    // Thêm giảng viên vào cơ sở dữ liệu hoặc xử lý logic ở đây
  };

  const handleSumitEditGV = () => {
    console.log('Sửa giảng viên: ', TenGV, TenDangNhapGV, QuyenGiangVien, MaGV, TrangThaiGV);
    // Sửa giảng viên trong cơ sở dữ liệu hoặc xử lý logic ở đây
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (QuyenGiangVien) {
      handleSumitEditGV();
    } else {
      handleSumitAddGV();
    }
    handleCloseModal(); // Đóng modal sau khi submit
  };

  return (
    <>
      <Button
        variant="success"
        onClick={handleOpenModal}
        className="mt-1"
        title="Thêm giảng viên cho bộ môn"
      >
        Thêm Giảng Viên
      </Button>

      {/* Modal sẽ được hiển thị khi isOpenModal là true */}
      <CreateGVModal
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        TenGV={TenGV}
        setTenGV={setTenGV}
        TenDangNhapGV={TenDangNhapGV}
        setTenDangNhapGV={setTenDangNhapGV}
        QuyenGiangVien={QuyenGiangVien}
        setQuyenGiangVien={setQuyenGiangVien}
        MaGV={MaGV}
        setMaGV={setMaGV}
        TrangThaiGV={TrangThaiGV}
        setTrangThaiGV={setTrangThaiGV}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default CreateGiangVienForm;