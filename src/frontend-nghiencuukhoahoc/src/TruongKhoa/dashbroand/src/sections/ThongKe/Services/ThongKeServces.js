import CookiesAxios from "../../CookiesAxios";

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

export const fetchLay_GVKhoa = async (MAGV) => {
    try {
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/thongke/xem/Lay_GVKhoa`,
            { MAGV }
        );
        return response.data.DT; // Trả về dữ liệu giảng viên
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu GIANG VIEN:", error);
        throw error;
    }
};

export const fetch_Lay_BoMon_Thuoc_KhoaChuan = async (MAGV) => {
    try {
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/thongke/xem/Lay_BoMon_Thuoc_KhoaChuan`,
            { MAGV }
        );
        return response.data.DT;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

// Lấy dữ liệu biểu đồ tròn
export const fetch_Lay_NamHoc_HocKyNienKhoaController = async (MAGV) => {
    try {
        const response = await CookiesAxios.get(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/thongke/xem/Lay_NamHoc_HocKyNienKhoa`
        );
        return response.data.DT;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetch_Lay_BieuDo_GioDay_KhungChuan = async (MAGV) => {
    try {
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/thongke/xem/Lay_BieuDo_GioDay_KhungChuan`,
            { MAGV }
        );
        return response.data.DT; // Trả về dữ liệu biểu đồ tròn
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const fetch_Lay_BieuDo_Theo_BoMon_NamHoc = async (MABOMON, MAHKNK) => {
    try {
        console.log("MABOMON:  ", MABOMON)
        console.log("MAHKNK:  ", MAHKNK)
        const response = await CookiesAxios.post(
            `${process.env.REACT_APP_URL_SERVER}/api/v1/truongkhoa/thongke/xem/Lay_BieuDo_Theo_BoMon_NamHoc`,
            { MABOMON, MAHKNK }
        );
        return response.data.DT; // Trả về dữ liệu biểu đồ tròn
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};