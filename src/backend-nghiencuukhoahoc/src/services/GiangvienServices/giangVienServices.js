const pool = require("../../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const getPhanCongGV_MAGV = async (MAGV) => {
    try {
        const [results1, fields] = await pool.execute(
            `
        SELECT gv.MAGV, bpc.*, ctpc.*, mh.*, l.* FROM giangvien gv
        JOIN bangphancong bpc ON bpc.MAGV = gv.MAGV
        JOIN hockynienkhoa hknk ON bpc.MAHKNK = hknk.MAHKNK
        JOIN chitietphancong ctpc ON ctpc.MAPHANCONG = bpc.MAPHANCONG
        JOIN monhoc mh ON mh.MAMONHOC = ctpc.MAMONHOC
        JOIN lop l ON l.MALOP = ctpc.MALOP
        WHERE gv.MAGV = ?
        `,
            [MAGV]
        );

        return {
            EM: "Xem thông tin tất cả tên khung giờ chuẩn theo tên chức danh thành công",
            EC: 1,
            DT: results1,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "lỗi services getPhanCongGV_MAGV",
            EC: -1,
            DT: [],
        };
    }
};

//hàm hash mật khẩu
const hashPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
};

const doiMatKhau_GV = async (TENDANGNHAP, MATKHAU_CU, MATKHAU_MOI) => {
    try {
        // Lấy thông tin tài khoản từ database
        const [taikhoan] = await pool.execute(
            `
            SELECT * 
            FROM taikhoan
            WHERE TENDANGNHAP = ?
            `,
            [TENDANGNHAP]
        );

        if (taikhoan.length === 0) {
            return {
                EM: "Tài khoản không tồn tại",
                EC: 0,
                DT: [],
            };
        }

        const user = taikhoan[0];

        // Trường hợp tài khoản không có mật khẩu (lần đầu thiết lập)
        if (!user.MATKHAU) {
            const hashedPassword = await bcrypt.hash(MATKHAU_MOI, 10);
            await pool.execute(
                `
                UPDATE taikhoan
                SET MATKHAU = ?
                WHERE TENDANGNHAP = ?
                `,
                [hashedPassword, TENDANGNHAP]
            );

            return {
                EM: "Thêm mật khẩu thành công",
                EC: 1,
                DT: [],
            };
        }

        // So sánh mật khẩu cũ với mật khẩu trong database
        const isCorrectPass = await bcrypt.compare(MATKHAU_CU, user.MATKHAU);
        if (!isCorrectPass) {
            return {
                EM: "Đổi mật khẩu thất bại, mật khẩu cũ không đúng!",
                EC: 0,
                DT: [],
            };
        }

        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(MATKHAU_MOI, 10);

        // Cập nhật mật khẩu mới vào database
        await pool.execute(
            `
            UPDATE taikhoan
            SET MATKHAU = ?
            WHERE TENDANGNHAP = ?
            `,
            [hashedNewPassword, TENDANGNHAP]
        );

        return {
            EM: "Đổi mật khẩu thành công",
            EC: 1,
            DT: [],
        };
    } catch (error) {
        console.error("Lỗi trong doiMatKhau_GV:", error);
        return {
            EM: "Lỗi hệ thống khi đổi mật khẩu",
            EC: -1,
            DT: [],
        };
    }
};

const sendEmail = async (email, subject, token) => {
    const emailContent = `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #333333; text-align: center;">Đặt lại mật khẩu</h2>
                    <p style="color: #555555; font-size: 16px;">Chào bạn,</p>
                    <p style="color: #555555; font-size: 16px;">
                        Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Để tiếp tục, vui lòng sử dụng mã bảo mật dưới đây:
                    </p>
                    <div style="background-color: #e0e0e0; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;">
                        Mã bảo mật: <span style="color: #333333;">${token}</span>
                    </div>
                    <p style="color: #555555; font-size: 16px;">
                        Mã bảo mật này sẽ hết hạn trong 15 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể bỏ qua email này.
                    </p>
                    <p style="color: #555555; font-size: 16px;">
                        Cảm ơn bạn,<br>
                        <strong>Đội ngũ hỗ trợ của chúng tôi</strong>
                    </p>
                    <hr style="border: 1px solid #cccccc;">
                    <p style="color: #888888; font-size: 12px; text-align: center;">
                        Nếu bạn gặp vấn đề, vui lòng liên hệ với chúng tôi qua email hỗ trợ.
                    </p>
                </div>
            </body>
        </html>
    `;

    try {
        // Cấu hình transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Hoặc dịch vụ email khác như Outlook, Yahoo
            auth: {
                user: "baoquoczero@gmail.com", // Email của bạn
                pass: "ueba tsfu nmkp glho", // App Password từ Gmail
            },
        });

        // Gửi email
        await transporter.sendMail({
            from: "baoquoczero@gmail.com",
            to: email,
            subject: subject,
            html: emailContent,  // Nội dung email là HTML
        });

        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const quenMatKhau_GV = async (TENDANGNHAP) => {
    try {
        // Lấy thông tin tài khoản từ database
        const [taikhoan] = await pool.execute(
            `
            SELECT * 
            FROM taikhoan
            WHERE TENDANGNHAP = ?
            `,
            [TENDANGNHAP]
        );

        if (taikhoan.length === 0) {
            return {
                EM: "Tài khoản không tồn tại",
                EC: 0,
                DT: [],
            };
        }

        // Tạo mã bảo mật (token)
        const token = uuidv4();

        await sendEmail(
            TENDANGNHAP,
            "Đặt lại mật khẩu",
            token  // Chuyển token vào nội dung email
        );

        return {
            EM: "Gửi mã bảo mật thành công. Vui lòng kiểm tra email của bạn.",
            EC: 1,
            DT: token,
        };
    } catch (error) {
        console.error("Lỗi trong quenMatKhau_GV:", error);
        return {
            EM: "Lỗi hệ thống khi xử lý quên mật khẩu",
            EC: -1,
            DT: [],
        };
    }
};

const resetPassword = async (TENDANGNHAP, MATKHAU_MOI) => {
    try {
        // Lấy thông tin tài khoản từ database
        const [taikhoan] = await pool.execute(
            `
                    SELECT * 
                    FROM taikhoan
                    WHERE TENDANGNHAP = ?
                    `,
            [TENDANGNHAP]
        );

        if (taikhoan.length === 0) {
            return {
                EM: "Tài khoản không tồn tại",
                EC: 0,
                DT: [],
            };
        }

        const hashedPassword = await bcrypt.hash(MATKHAU_MOI, 10);
        await pool.execute(
            `
            UPDATE taikhoan
            SET MATKHAU = ?
            WHERE TENDANGNHAP = ?
            `,
            [hashedPassword, TENDANGNHAP]
        );

        return {
            EM: "Đặt lại mật khẩu thành công!",
            EC: 1,
            DT: []
        };
    } catch (error) {
        console.error("Lỗi trong resetPassword:", error);
        return {
            EM: "Lỗi hệ thống resetPassword.",
            EC: -1,
            DT: []
        };
    }
};

module.exports = {
    getPhanCongGV_MAGV,
    doiMatKhau_GV,
    quenMatKhau_GV,
    resetPassword
};