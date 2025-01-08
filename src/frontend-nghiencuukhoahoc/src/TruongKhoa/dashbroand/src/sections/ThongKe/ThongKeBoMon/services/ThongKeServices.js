import CookiesAxios from "../../../CookiesAxios";

// Lấy thông tin giảng viên theo tài khoản
export const fetchDataGV = async (taikhoan) => {
    try {
        const response = await CookiesAxios.get(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/admin/giangvien/only/xemprofile/${taikhoan}`
        );
        return response.data.DT; // Trả về dữ liệu giảng viên
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu GIANG VIEN:", error);
        throw error;
    }
};

// Lấy dữ liệu biểu đồ tròn
export const fetchGV_DaiDien = async (MABOMON) => {
    try {
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/thongke/xem/Lay_GV_DaiDien_Thuoc_BoMon`,
            { MABOMON }
        );
        return response.data.DT; // Trả về dữ liệu biểu đồ tròn
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

// Lấy dữ liệu biểu đồ tròn
export const fetchDataBieuDoTron = async (MABOMON, MAHKNK) => {
    try {
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/thongke/bieudotron`,
            { MABOMON, MAHKNK }
        );
        return response.data.DT; // Trả về dữ liệu biểu đồ tròn
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetchDataBieuDoTron_PhanCong = async (MABOMON, MAHKNK) => {
    try {
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/thongke/bieudotron_phancong`,
            { MABOMON, MAHKNK }
        );
        return response.data.DT; // Trả về dữ liệu biểu đồ tròn
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetchGV_BoMon = async (MABOMON, currentPage, pageSize) => {
    try {
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/thongke/giangvien`,
            { MABOMON, currentPage, pageSize }
        );
        return response.data.DT; // Trả về dữ liệu biểu đồ tròn
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetchDataNamHoc = async (taikhoan) => {
    try {
        const response = await CookiesAxios.get(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongbomon/thongke/getNamHoc_HocKiNienKhoa`
        );
        return response.data.DT; // Trả về dữ liệu giảng viên
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu GIANG VIEN:", error);
        throw error;
    }
};