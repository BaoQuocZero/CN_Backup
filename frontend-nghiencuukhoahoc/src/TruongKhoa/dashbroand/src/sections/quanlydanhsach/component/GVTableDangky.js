import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  useMediaQuery,
  useTheme,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios"; // Giả sử bạn sử dụng axios để gọi API
import CookiesAxios from "../../CookiesAxios";

const GVTableDangky = ({ data, selectNamHoc }) => {
  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selectedGV, setSelectedGV] = useState(null); // Trạng thái để lưu giảng viên đã chọn
  const [details, setDetails] = useState(null); // Trạng thái để lưu thông tin chi tiết của giảng viên

  useEffect(() => {
    console.log("chèkjaldjsaldjkasda", data);
    if (selectNamHoc && selectedGV) {
      fetchDetails(selectedGV);
    }
  }, [selectNamHoc]);
  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile screen

  const fetchDetails = async (MAGV) => {
    try {
      const response = await CookiesAxios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/giangvien/danhsachgiangviendangkynkhk`,
        {
          TENNAMHOC: selectNamHoc,
        }
      );
      console.log(response);
      if (response.data.EC === 200) {
        setDetails(response.data.DT);
      }
    } catch (error) {
      console.error("Failed to fetch details", error);
    }
  };

  const handleRowClick = (row) => {
    if (selectedGV === row.MAGV) {
      setSelectedGV(null);
      setDetails(null);
    } else {
      setSelectedGV(row.MAGV);
      fetchDetails(row.MAGV);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {(!isMobile || showAll) && <TableCell>#</TableCell>}
            {(!isMobile || showAll) && <TableCell>Mã Giảng Viên</TableCell>}
            <TableCell>Tên Giảng Viên</TableCell>
            {(!isMobile || showAll) && <TableCell>Email</TableCell>}
            {(!isMobile || showAll) && <TableCell>Điện Thoại</TableCell>}
            {(!isMobile || showAll) && <TableCell>Số lượng đề tài</TableCell>}
            {/* {(!isMobile || showAll) && <TableCell>Tên đề tài</TableCell>} */}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => (
            <React.Fragment key={row.MAGV}>
              <TableRow
                onClick={() => handleRowClick(row)}
                sx={{
                  cursor: "pointer",
                }}
              >
                {(!isMobile || showAll) && <TableCell>{index + 1}</TableCell>}
                {(!isMobile || showAll) && <TableCell>{row.MAGV}</TableCell>}
                <TableCell
                  className={`${selectedGV === row.MAGV ? "text-success" : ""}`}
                >
                  {row.TENGV}
                </TableCell>
                {(!isMobile || showAll) && <TableCell>{row.EMAIL}</TableCell>}
                {(!isMobile || showAll) && (
                  <TableCell>{row.DIENTHOAI}</TableCell>
                )}
                {(!isMobile || showAll) && (
                  <TableCell>{row.SoLuongDeTai}</TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={6}
                >
                  <Collapse
                    in={selectedGV === row.MAGV}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box margin={1}>
                      {details &&
                      details.filter((detail) => detail.MAGV === row.MAGV)
                        .length > 0 ? (
                        details
                          .filter((detail) => detail.MAGV === row.MAGV)
                          .map((detail, index) => (
                            <Table
                              size="small"
                              aria-label="details"
                              key={index}
                            >
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={{ color: "red" }}>
                                    Đề tài đăng ký:
                                  </TableCell>
                                  <TableCell sx={{ color: "red" }}>
                                    {detail.DanhSachDeTai}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          ))
                      ) : (
                        <Typography sx={{ color: "red" }}>
                          Giảng viên không có đề tài đăng ký
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {data.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
      {isMobile && !showAll && (
        <Button
          variant="text"
          onClick={() => setShowAll(true)}
          sx={{ marginTop: 2 }}
        >
          Xem tất cả
        </Button>
      )}
      {isMobile && showAll && (
        <Button
          variant="text"
          onClick={() => setShowAll(false)}
          sx={{ marginTop: 2 }}
        >
          Ẩn bớt
        </Button>
      )}
    </TableContainer>
  );
};

export default GVTableDangky;
