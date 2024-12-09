import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import ReactPaginate from "react-paginate";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Box,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CookiesAxios from "../CookiesAxios";
import GVTableDangky from "./component/GVTableDangky";
import GVTableChuadangky from "./component/GVTableChuadangky";
const GiangvienCNTTList = () => {
  const [data_ListGVChuaChonKhung, setData_ListGVChuaChonKhung] = useState([]);
  const [data_ListGVDaChonKhung, setData_ListGVDaChonKhung] = useState([]);
  const [data_NamHoc, setData_NamHoc] = useState([]);
  const [ListNamHoc, setListNamHoc] = useState(null);
  const [selectNamHoc, setSelectNamHoc] = useState(null);
  // ---------------------------------------------------------------
  const [isDisableNamHoc, setIsDisableNamHoc] = useState(false);
  const [isOpenXemGiangVienChonKhung, setIsOpenXemGiangVienChonKhung] =
    useState(true);

  useEffect(() => {
    const fetchNamHocList = async () => {
      try {
        const response_NamHoc = await CookiesAxios.get(
          `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/namhoc/xem`
        );
        console.log("check response_NamHoc", response_NamHoc.data);
        if (response_NamHoc.data.EC === 1) {
          setListNamHoc(response_NamHoc.data.DT);
          setSelectNamHoc(response_NamHoc.data.DT[0].TENNAMHOC);
        }
      } catch (error) {
        console.error("Error fetching NamHoc data:", error);
      }
    };
    fetchNamHocList();
  }, []);
  useEffect(() => {
    if (selectNamHoc) {
      fetchGiangVienList(selectNamHoc);
      fetchListGiangVienChuaChonKhung(selectNamHoc);
    }
  }, [selectNamHoc]);

  useEffect(() => {
    if (
      data_ListGVChuaChonKhung.length === 0 &&
      isOpenXemGiangVienChonKhung === false
    ) {
      fetchListGiangVienChuaChonKhung();
    }
  }, [isOpenXemGiangVienChonKhung]);

  const fetchListGiangVienChuaChonKhung = async (selectNamHoc) => {
    try {
      const response = await CookiesAxios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/giangvien/danhsachgiangvienchuadangkynkhk`,
        {
          TENNAMHOC: selectNamHoc,
        }
      );
      console.log("chua chon khung =>", response.data);
      if (response.data.EC === 200) {
        setData_ListGVChuaChonKhung(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching BoMon data:", error);
    }
  };
  const fetchGiangVienList = async (selectNamHoc) => {
    try {
      const response = await CookiesAxios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/giangvien/danhsachgiangviendangkynkhk`,
        { TENNAMHOC: selectNamHoc }
      );
      console.log("check setData_ListGVDaChonKhung", response.data);
      if (response.data.EC === 200) {
        setData_ListGVDaChonKhung(response.data.DT);
      }
    } catch (error) {
      console.error("Error fetching GiangVien data:", error);
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: { md: 220, xs: "100%" } }}>
        <FormControl fullWidth className="profile-email-input">
          <InputLabel id="select-label-trang-thai" shrink={!!selectNamHoc}>
            Năm học
          </InputLabel>
          <Select
            labelId="select-label-trang-thai"
            id="trang-thai-select"
            name="TENCHUCDANH"
            label="Chức danh"
            value={selectNamHoc}
            defaultValue={selectNamHoc}
            disabled={isDisableNamHoc}
            onChange={(e) => setSelectNamHoc(e.target.value)}
            variant="outlined"
          >
            {ListNamHoc && ListNamHoc.length > 0 ? (
              ListNamHoc.map((namhoc, index) => (
                <MenuItem key={index} value={namhoc.TENNAMHOC}>
                  {namhoc.TENNAMHOC}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                Không có năm học nào
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
        <Button
          variant={isOpenXemGiangVienChonKhung ? "outlined" : "text"}
          onClick={() => setIsOpenXemGiangVienChonKhung(true)}
          sx={{
            color: isOpenXemGiangVienChonKhung ? "green" : "grey.500",
            borderColor: isOpenXemGiangVienChonKhung ? "green" : "grey.500",
            opacity: isOpenXemGiangVienChonKhung ? 1 : 0.6,
          }}
        >
          Danh Sách Giảng Viên Đã Đăng Ký Nghiên Cứu
        </Button>{" "}
        <Button
          variant={isOpenXemGiangVienChonKhung ? "text" : "outlined"}
          onClick={() => setIsOpenXemGiangVienChonKhung(false)}
          sx={{
            color: !isOpenXemGiangVienChonKhung ? "red" : "grey.500",
            borderColor: !isOpenXemGiangVienChonKhung ? "red" : "grey.500",
            opacity: !isOpenXemGiangVienChonKhung ? 1 : 0.6,
          }}
        >
          Danh Sách Giảng Viên Chưa Đăng Ký Nghiên Cứu
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1200px" }}>
          {isOpenXemGiangVienChonKhung ? (
            <GVTableDangky
              data={data_ListGVDaChonKhung}
              selectNamHoc={selectNamHoc}
            />
          ) : (
            <GVTableChuadangky
              data={data_ListGVChuaChonKhung}
              selectNamHoc={selectNamHoc}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default GiangvienCNTTList;
