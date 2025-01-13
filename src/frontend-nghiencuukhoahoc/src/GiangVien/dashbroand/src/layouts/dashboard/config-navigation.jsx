import SvgColor from "../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "Thông tin cá nhân",
    path: "/",
    icon: icon("ic_analytics"),
  },
  {
    title: "Thống kê",
    path: "/thongke",
    icon: icon("ic_analytics"),
  },
  {
    title: "Phân công của tôi",
    path: "/phan-cong-cua-toi",
    icon: icon("ic_user"),
  },
  {
    title: "Đăng ký mức chuẩn giờ giảng",
    path: "/dang-ky-khung-gio-chuan",
    icon: icon("ic_blog"),
  },
  {
    title: "Đổi mật khẩu",
    path: "/doimatkhau",
    icon: icon("ic_blog"),
  },
  // {
  //   title: "Dev",
  //   path: "/dev",
  //   icon: icon("ic_blog"),
  // },
];

export default navConfig;
