import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layouts/dashboard";
import ProductsPageFake from "../pages/products";
import DangKyGioChuan from "../sections/DangKyGioChuan/IndexDangKyGioChuan";
import AccountGV from "../sections/Account/AccountGV";
import Skeleton from "@mui/material/Skeleton";
const IndexDangKyDanhmuc = lazy(() =>
  import("../sections/RegisterDanhMucGioChuan/IndexDangKyDanhMuc")
);
const FileExcel = lazy(() => import("../sections/FileExcel/FileExcel"));
const DangKyDanhMuc = lazy(() =>
  import("../sections/DangKyDanhMuc/DangKyDanhMuc")
);
const IndexQuanLydanhsachGV = lazy(() =>
  import("../sections/quanlydanhsach/CNTTdangky")
);
const Dev = lazy(() => import("../sections/dev/dev"));
const ThongKe = lazy(() => import("../sections/ThongKe/ThongKe"));
const ThongKeGV = lazy(() => import("../sections/ThongKe/ThongKeGV/ThongKe"));
const ThongKeBoMon = lazy(() => import("../sections/ThongKe/ThongKeBoMon/thongKe"));
const DoiMatKhau = lazy(() => import("../sections/DoimatKhau/DoiMatKhau"));

const TrangChu = lazy(() => import("../pages/app"));
const UserPage = lazy(() => import("../pages/user"));
const LoginPage = lazy(() => import("../pages/login"));
const Page404 = lazy(() => import("../pages/page-not-found"));
const IndexQuanLyChonKhung = lazy(() =>
  import("../sections/QuanLyChonKhung/IndexQuanLyChonKhung")
);
export default function Router() {
  const routes = useRoutes([
    {
      path: "/", //Trang chủ

      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            {/* <TrangChu /> */}
            <ThongKe />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/doimatkhau",
      element: (
        <DashboardLayout>
          <Suspense
            fallback={
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ bgcolor: "grey.300" }}
              />
            }
          >
            <DoiMatKhau />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/thong-ke", //Trang chủ

      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <ThongKe />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/thong-ke-bomon",
      element: (
        <DashboardLayout>
          <Suspense
            fallback={
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ bgcolor: "grey.300" }}
              />
            }
          >
            <ThongKeBoMon />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/thong-ke-gv",
      element: (
        <DashboardLayout>
          <Suspense
            fallback={
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ bgcolor: "grey.300" }}
              />
            }
          >
            <ThongKeGV />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/giang-vien", // Danh sách giảng viên trong khoa.

      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <UserPage />
          </Suspense>
        </DashboardLayout>
      ),
    },

    {
      path: "/dang-ky-khung-gio-chuan", //: Đăng Ký mức chuẩn giờ giảng
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <DangKyGioChuan />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/dang-ky-danh-muc", // Thêm ký tự '*' vào cuối đường dẫn
      element: (
        <DashboardLayout>
          <Suspense
            fallback={
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ bgcolor: "grey.300" }}
              />
            }
          >
            <IndexDangKyDanhmuc />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/tai-khoan-giangvien/thong-tin",
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <AccountGV />
          </Suspense>
        </DashboardLayout>
      ),
    },

    {
      path: "/dang-ky-nghien-cuu",
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <IndexQuanLyChonKhung />
          </Suspense>
        </DashboardLayout>
      ),
    },

    {
      path: "/dang-ky-nghien-cuu-khoa-hoc",
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <IndexQuanLydanhsachGV />
          </Suspense>
        </DashboardLayout>
      ),
    },
    {
      path: "/dev",
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Dev />
          </Suspense>
        </DashboardLayout>
      ),
    },
    //====================================================================================================

    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/dashboard/404" replace />,
    },
  ]);

  return routes;
}