import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  MenuItem,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Form, Dropdown } from "react-bootstrap";
import "../style/StylePhanCong.scss";
import AddIcon from "@mui/icons-material/Add";
import CookiesAxios from "../../CookiesAxios";
const LopMonHocTable = ({
  data,
  fetchDataMonHoc_byLop,
  select_HocKiNienKhoa,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [suggestedTeachers, setSuggestedTeachers] = useState([]); // State cho danh sách giảng viên được gợi ý
  const suggestionsRef = useRef(null);
  const [indexSelect, setIndexSelect] = useState(null);
  const [listGVDiaLog, setListGVDiaLog] = useState([]);

  const [searchEmail, setSearchEmail] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  const calculateTeachingHours = (siso, tinChiLyThuyet, tinChiThucHanh) => {
    const gioLyThuyet = tinChiLyThuyet * 15;
    const gioThucHanh =
      siso > 30 ? tinChiThucHanh * 2 * 30 : tinChiThucHanh * 1 * 30;
    return gioLyThuyet + gioThucHanh;
  };

  const handleRowClick = (index, row) => {
    setSelectedRow(row);
    setOpen(true);
    setIndexSelect(index);
    fetchTableGVModal();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setSuggestedTeachers([]); // Reset danh sách gợi ý khi đóng modal
  };

  useEffect(() => {
    fetchTableGVModal()
  }, [open]);

  const handleUpdateSelectTeacher = async (index, row) => {
    const response = await CookiesAxios.post(
      `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/giangvien/phancong/update/giangvien`,
      {
        selectedRow, row
      }
    );
    fetchDataMonHoc_byLop();
    handleClose();
    setSearchEmail(""); // Reset ô tìm kiếm sau khi chọn giảng viên
  };

  const fetchTableGVModal = async () => {
    try {
      if (select_HocKiNienKhoa) {
        // Safer check
        // Gọi API khi có hơn 2 ký tự
        const response = await CookiesAxios.post(
          `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/giangvien/xem/phancong/gio/giangvien`,
          {
            MAHKNK: select_HocKiNienKhoa.MAHKNK,
          }
        );
        setListGVDiaLog(response.data.DT)
        setFilteredTeachers(response.data.DT)
      } else {
        setSuggestedTeachers([]); // Reset danh sách gợi ý nếu ký tự ít hơn 3
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm giảng viên:", error);
    }
  };

  //Các hàm dùng trong DiaLog ================================================================================
  // Hàm tìm kiếm
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchEmail(searchValue);

    // Lọc dữ liệu giảng viên dựa trên email hoặc tên giảng viên
    const filteredData = listGVDiaLog.filter((teacher) => {
      const teacherName = teacher.TENGV ? teacher.TENGV.toLowerCase() : '';
      const teacherId = teacher.MAGV ? teacher.MAGV.toLowerCase() : '';

      return teacherName.includes(searchValue) || teacherId.includes(searchValue);
    });

    setFilteredTeachers(filteredData);  // Cập nhật dữ liệu sau khi lọc
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Mã Lớp</TableCell>
              <TableCell align="left">Tên Môn Học</TableCell>
              <TableCell align="left">Số Thứ Tự Học Kỳ</TableCell>
              <TableCell align="left">Số Giờ GD Của Môn</TableCell>
              <TableCell align="left">Phân Công</TableCell>
              <TableCell align="left">Số Giờ Đã Phân Công</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      selectedRow === row ? "#f0f0f0" : "inherit",
                    ":hover": {
                      backgroundColor: "#f0f2f4", // Màu nền giảm sáng khi hover
                      "& .MuiTableCell-root": {
                        color: "#3032ff", // Màu chữ giảm sáng khi hover
                      },
                    },
                  }}
                  title={
                    row.TONG_SO_GIO
                      ? `Giảng Viên Đang Có Số Giờ Là ${row.TONG_SO_GIO} giờ`
                      : `Giảng Viên Chưa Được Phân Công`
                  }
                >
                  <TableCell component="th" scope="row">
                    {row.MALOP}
                  </TableCell>
                  <TableCell align="left">{row.TENMONHOC}</TableCell>
                  <TableCell align="center">{row.SOTHUTUHOCKI}</TableCell>
                  <TableCell align="center">
                    {calculateTeachingHours(
                      row.SISO,
                      row.SOTINCHILYTHUYET,
                      row.SOTINCHITHUCHANH
                    )}
                  </TableCell>
                  <TableCell align="left">{row.giangVien ? row.giangVien.TENGV : row.TENGV}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: row.TONG_SO_GIO < 500 ? "green" : "red",
                    }}
                  >
                    {row.giangVien ? row.giangVien.TONG_SO_GIO : row.TONG_SO_GIO}
                  </TableCell>
                  <TableCell>
                    <EditIcon
                      onClick={() => handleRowClick(index, row)}
                      sx={{
                        cursor: "pointer",
                        transition:
                          "transform 0.2s ease-in-out, color 0.2s ease-in-out",
                        ":hover": {
                          transform: "scale(1.2)",
                          color: "#6092db",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: {
                xs: "90vw", // 90% chiều rộng trên thiết bị nhỏ
                sm: "80vw", // 80% chiều rộng trên thiết bị nhỏ hơn
                md: "70vw", // 70% chiều rộng trên thiết bị vừa
                lg: "60vw", // 60% chiều rộng trên thiết bị lớn
              },
              height: {
                xs: "90vh", // 90% chiều cao trên thiết bị nhỏ
                sm: "80vh", // 80% chiều cao trên thiết bị nhỏ hơn
              },
              maxHeight: "80vh", // Đặt chiều cao tối đa
              maxWidth: "90vw", // Đặt chiều rộng tối đa
            },
          },
        }}
      >
        <DialogTitle>Thông Tin Giảng Viên</DialogTitle>
        <DialogContent>
          {" "}
          {selectedRow && (
            <div style={{ flex: 1 }}>
              <p>
                <strong>Mã Giảng Viên:</strong> {selectedRow.MAGV}
              </p>
              <p>
                <strong>Tên Giảng Viên:</strong> {selectedRow.TENGV}
              </p>
              <p>
                <strong>Số Giờ Đã Phân Công:</strong>{" "}
                {selectedRow.TONG_SO_GIO || "Chưa có"}
              </p>

              {/* Bạn có thể thêm các trường thông tin khác tại đây */}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {/* Hiển thị thông tin giảng viên bên phải input */}

            <div
              style={{
                width: "300px",
                position: "relative",
                marginRight: "20px",
              }}
            >
              {/* Ô tìm kiếm */}
              <Form.Control
                type="text"
                placeholder="Tìm kiếm giảng viên theo tên"
                value={searchEmail}
                onChange={handleSearch}
              />
            </div>
          </div>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Mã Giảng Viên</TableCell>
                <TableCell align="center">Tên Giảng Viên</TableCell>
                <TableCell align="center">Tổng Số Giờ Đã Được Phân Công</TableCell>
                <TableCell align="center">Số Giờ Giảng Dạy Chuẩn</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredTeachers) && filteredTeachers.length > 0 ? (
                filteredTeachers.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        selectedRow === row ? "#f0f0f0" : "inherit",
                    }}
                    title={
                      row.TONG_SO_GIO
                        ? `Giảng Viên Đang Có Số Giờ Là ${row.TONG_SO_GIO_DAY} giờ`
                        : `Giảng Viên Chưa Được Phân Công`
                    }
                  >
                    <TableCell component="th" scope="row">{row.MAGV}</TableCell>
                    <TableCell align="justify">{row.TENGV}</TableCell>
                    <TableCell align="center">{row.TONG_SO_GIO_DAY ? row.TONG_SO_GIO_DAY : 0}</TableCell>
                    <TableCell align="center">{row.GIOGIANGDAY_HANHCHINH ? row.GIOGIANGDAY_HANHCHINH : 0}</TableCell>
                    <TableCell>
                      <AddIcon
                        onClick={() => handleUpdateSelectTeacher(index, row)}
                        // onMouseEnter={() => handleHoverTeacher(teacher)}
                        sx={{
                          cursor: "pointer",
                          transition:
                            "transform 0.2s ease-in-out, color 0.2s ease-in-out", // Tạo hiệu ứng mượt cho cả phóng to và thay đổi màu
                          ":hover": {
                            transform: "scale(1.2)", // Phóng to biểu tượng khi hover
                            color: "#6092db", // Đổi màu biểu tượng khi hover
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LopMonHocTable;
