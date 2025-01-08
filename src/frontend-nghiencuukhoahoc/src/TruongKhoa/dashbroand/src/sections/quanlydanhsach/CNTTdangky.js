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
  Grid,
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
  const [ListBomon, setListBomon] = useState(null);
  const [selectBomon, setSelectBomon] = useState(null);
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

    const fetchBomonList = async () => {
      try {
        const response_Bomon = await CookiesAxios.get(
          `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/allbomon`
        );
        console.log("check response_NamHoc", response_Bomon.data);
        if (response_Bomon.data.EC === 1) {
          setListBomon(response_Bomon.data.DT);
          setSelectBomon(response_Bomon.data.DT[0].TENBOMON);
        }
      } catch (error) {
        console.error("Error fetching NamHoc data:", error);
      }
    };

    fetchNamHocList();
    fetchBomonList();
  }, []);
  useEffect(() => {
    if (selectNamHoc && selectBomon) {
      fetchGiangVienList(selectNamHoc, selectBomon);
      fetchListGiangVienChuaChonKhung(selectNamHoc, selectBomon);
    }
  }, [selectNamHoc, selectBomon]);

  useEffect(() => {
    if (
      data_ListGVChuaChonKhung.length === 0 &&
      isOpenXemGiangVienChonKhung === false
    ) {
      fetchListGiangVienChuaChonKhung(selectNamHoc, selectBomon);
    }
  }, [isOpenXemGiangVienChonKhung]);

  const fetchListGiangVienChuaChonKhung = async (selectNamHoc, selectBomon) => {
    try {
      const response = await CookiesAxios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/danhsachgiangvienchuadangkynkhktheobomon`,
        {
          TENNAMHOC: selectNamHoc,
          TENBOMON: selectBomon,
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
  const fetchGiangVienList = async (selectNamHoc, selectBomon) => {
    try {
      const response = await CookiesAxios.post(
        `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/danhsachgiangviendangkynkhktheobomon`,
        { TENNAMHOC: selectNamHoc, TENBOMON: selectBomon }
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
      <Box sx={{ maxWidth: { md: 600, xs: "100%" } }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth className="profile-email-input">
              <InputLabel id="select-label-trang-thai" shrink={!!selectNamHoc}>
                Năm học
              </InputLabel>
              <Select
                labelId="select-label-trang-thai"
                id="trang-thai-select"
                name="TENCHUCDANH"
                label="Năm học"
                value={selectNamHoc}
                onChange={(e) => setSelectNamHoc(e.target.value)}
                variant="outlined"
                disabled={isDisableNamHoc}
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
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth className="profile-email-input">
              <InputLabel id="select-label-bomon" shrink={!!selectBomon}>
                Bộ môn
              </InputLabel>
              <Select
                labelId="select-label-bomon"
                id="bomon-select"
                value={selectBomon}
                onChange={(e) => setSelectBomon(e.target.value)}
                variant="outlined"
                disabled={isDisableNamHoc || !selectNamHoc} // Disabled if no NamHoc selected
              >
                {ListBomon && ListBomon.length > 0 ? (
                  ListBomon.map((bomon, index) => (
                    <MenuItem key={index} value={bomon.TENBOMON}>
                      {bomon.TENBOMON}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    Không có bộ môn nào
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
              selectBomon={selectBomon}
            />
          ) : (
            <GVTableChuadangky
              data={data_ListGVChuaChonKhung}
              selectNamHoc={selectNamHoc}
              selectBomon={selectBomon}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default GiangvienCNTTList;
