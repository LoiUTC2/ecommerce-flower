import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false, // không trả về mật khẩu khi query
        },
        avatar: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },
        dateOfBirth: {
            type: Date,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },

        // role: quyền trong hệ thống
        role: {
            type: String,
            enum: ["user", "seller", "admin"],
            default: "user",
        },

        // dùng cho auth mở rộng
        provider: {
            type: String,
            enum: ["email", "google", "facebook"],
            default: "email",
        },

        // trạng thái tài khoản
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },

        //Xác minh email
        emailVerifyToken: {
            type: String,
            default: null,
        },
        emailVerifyExpires: {
            type: Date,
            default: null,
        },
        isEmailVerified: { type: Boolean, default: false },

        // reset password
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        // lịch sử đăng nhập
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// 🧩 Middleware: hash password trước khi lưu
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 🧩 Hàm so sánh mật khẩu
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🧩 Hàm xóa mềm
userSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
};

// 🧩 Hàm khôi phục tài khoản
userSchema.methods.restore = function () {
    this.isDeleted = false;
    this.deletedAt = null;
};

// ✅ Xuất model
const User = mongoose.model("User", userSchema);
export default User;
