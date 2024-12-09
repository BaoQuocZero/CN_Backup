import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TablePagination,
} from "@mui/material";
import CookiesAxios from "../../CookiesAxios";
import "./modals.scss";
const TyLeQuyDoiGioChuanModal = ({ open, handleClose }) => {
  const [quyDinhs, setQuyDinhs] = useState([]);
  const [tyLeQuyDoi, setTyLeQuyDoi] = useState([]);
  const [selectedQuyDinh, setSelectedQuyDinh] = useState("");
  const [tenQuyDoi, setTenQuyDoi] = useState("");
  const [tyLe, setTyLe] = useState("");
  const [trangThaiQuyDoi, setTrangThaiQuyDoi] = useState("");
  const [ghiChuQuyDoi, setGhiChuQuyDoi] = useState("");
  const [vienChucTruong, setVienChucTruong] = useState("");
  const [thucHienChuan, setThucHienChuan] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng mục mỗi trang
  const [filteredAndData, setFilteredAndData] = useState([]); // Dữ liệu sau khi lọc và tìm kiếm

  useEffect(() => {
    if (open) {
      fetchQuyDinhs();
      fetchTyLeQuyDoi();
    }
  }, [open]);

  const fetchQuyDinhs = async () => {
    try {
      const response = await CookiesAxios.get(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/danhmuc/quydinh`
      );
      setQuyDinhs(response.data.DT);
    } catch (error) {
      console.error("Error fetching quy dinhs:", error);
    }
  };

  const fetchTyLeQuyDoi = async () => {
    try {
      const response = await CookiesAxios.get(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/danhmuc/tylequydoi`
      );
      setTyLeQuyDoi(response.data.DT);
    } catch (error) {
      console.error("Error fetching quy dinhs:", error);
    }
  };

  const handleAddTyLeQuyDoi = async () => {
    try {
      const response = await CookiesAxios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/danhmuc/tylequydoi`,
        {
          MA_QUY_DINH: selectedQuyDinh,
          TEN_QUY_DOI: tenQuyDoi,
          TY_LE: tyLe,
          TRANG_THAI_QUY_DOI: trangThaiQuyDoi,
          GHI_CHU_QUY_DOI: ghiChuQuyDoi,
          VIEN_CHUC_TRUONG: vienChucTruong,
          THUC_HIEN_CHUAN: thucHienChuan,
        }
      );
      console.log("check fetch setTyLeQuyDoi =>", response.data);
      setTyLeQuyDoi(response.data.DT);
      alert("bạn đã thêm tỉ lệ mới thành công");
    } catch (error) {
      console.error("Error fetching quy dinhs:", error);
    }
  };

  const handleEdiStatusTyLeQuyDoi = async (item) => {
    const TrangThai =
      item.TRANG_THAI_QUY_DOI === "Đang áp dụng"
        ? "Ngưng áp dụng"
        : "Đang áp dụng";
    try {
      const response = await CookiesAxios.put(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/danhmuc/tylequydoi/${item.MA_QUY_DOI}`,
        { TRANG_THAI_QUY_DOI: TrangThai }
      );
      console.log("check fetch setTyLeQuyDoi =>", response.data);
      if (response.data.EC === 1) {
        setTyLeQuyDoi(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching quy dinhs:", error);
    }
  };

  // Hàm lọc dữ liệu theo trạng thái và tìm kiếm
  const filteredAndSearchedData = tyLeQuyDoi.filter(
    (item) =>
      (filterStatus === "Tất cả" || item.TRANG_THAI_QUY_DOI === filterStatus) &&
      item.TEN_QUY_DOI.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm xử lý thay đổi số lượng mục mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Đặt lại trang về 0 khi thay đổi số lượng mục mỗi trang
  };

  // Hàm thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Lấy dữ liệu của trang hiện tại
  const dataForCurrentPage = filteredAndSearchedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Tỷ lệ quy đổi giờ chuẩn</DialogTitle>
      <DialogContent>
        <DialogContentText>Nội dung Tỷ lệ quy đổi giờ chuẩn.</DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Chọn Quy Định</InputLabel>
              <Select
                value={selectedQuyDinh}
                onChange={(e) => setSelectedQuyDinh(e.target.value)}
              >
                {quyDinhs.map((qd) => (
                  <MenuItem key={qd.MA_QUY_DINH} value={qd.MA_QUY_DINH}>
                    {qd.TEN_QUY_DINH}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tên Quy Đổi"
              fullWidth
              margin="normal"
              value={tenQuyDoi}
              onChange={(e) => setTenQuyDoi(e.target.value)}
            />
            <TextField
              label="Tỷ Lệ"
              fullWidth
              margin="normal"
              value={tyLe}
              onChange={(e) => setTyLe(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="vien-chuc-truong-label">
                Viên Chức Trường
              </InputLabel>
              <Select
                labelId="vien-chuc-truong-label"
                id="vien-chuc-truong-label"
                label="Viên Chức Trường"
                value={vienChucTruong}
                onChange={(e) => setVienChucTruong(e.target.value)}
              >
                <MenuItem value="Có">Có</MenuItem>
                <MenuItem value="Không">Không</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="thuc-hien-chuan-label">
                Thực Hiện Chuẩn
              </InputLabel>
              <Select
                labelId="thuc-hien-chuan-label"
                id="thuc-hien-chuan-label"
                label="Thực Hiện Chuẩn"
                value={thucHienChuan}
                onChange={(e) => setThucHienChuan(e.target.value)}
              >
                <MenuItem value="Có">Có</MenuItem>
                <MenuItem value="Không">Không</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng Thái Quy Đổi</InputLabel>
              <Select
                value={trangThaiQuyDoi}
                onChange={(e) => setTrangThaiQuyDoi(e.target.value)}
                label="Trạng Thái Quy Đổi"
              >
                <MenuItem value="Đang áp dụng">Đang áp dụng</MenuItem>
                <MenuItem value="Ngưng áp dụng">Ngưng áp dụng</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Ghi Chú Quy Đổi"
              fullWidth
              margin="normal"
              value={ghiChuQuyDoi}
              onChange={(e) => setGhiChuQuyDoi(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="filter-status-label">
                Trạng Thái Quy Đổi
              </InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                <MenuItem value="Đang áp dụng">Đang áp dụng</MenuItem>
                <MenuItem value="Ngưng áp dụng">Ngưng áp dụng</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Tìm Kiếm"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {dataForCurrentPage.length > 0 ? (
              <List>
                {dataForCurrentPage.map((item) => (
                  <ListItem key={item.MA_QUY_DOI}>
                    {/* Hiển thị các thông tin của item */}
                    <ListItemText
                      primary={item.TEN_QUY_DOI}
                      secondary={item.TY_LE}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">Không có dữ liệu</Typography>
            )}

            <TablePagination
              component="div"
              count={filteredAndSearchedData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]} // Các tùy chọn phân trang
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
        <Button onClick={handleAddTyLeQuyDoi}>Thêm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TyLeQuyDoiGioChuanModal;
