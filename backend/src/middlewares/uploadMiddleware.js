import multer from "multer";
import path from "path";
import fs from "fs";

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
}

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|webp/;
    const allowedVideoTypes = /mp4|mov|avi/;

    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

    // Support cả 'image' (category) và 'images' (products)
    if (file.fieldname === 'image' || file.fieldname === 'images') {
        if (allowedImageTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Định dạng ảnh không hợp lệ: .${ext}. Chỉ chấp nhận: .jpg, .png, .webp`), false);
        }
    } else if (file.fieldname === 'videos') {
        if (allowedVideoTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Định dạng video không hợp lệ: .${ext}. Chỉ chấp nhận: .mp4, .mov, .avi`), false);
        }
    } else {
        // Cho phép các field khác pass qua (nếu có)
        cb(null, true);
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 15 // Tối đa 15 files (10 ảnh + 5 video)
    },
    fileFilter
});

// Export thêm specific uploads cho từng use case
export const uploadCategoryImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB cho category
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

        if (allowedTypes.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Định dạng ảnh không hợp lệ. Chỉ chấp nhận: JPG, PNG, WebP`), false);
        }
    }
});

export const uploadProductMedia = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 15
    },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = /jpeg|jpg|png|webp/;
        const allowedVideoTypes = /mp4|mov|avi/;
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

        if (file.fieldname === 'images') {
            if (allowedImageTypes.test(ext)) {
                cb(null, true);
            } else {
                cb(new Error(`Ảnh: ${ext} không hợp lệ`), false);
            }
        } else if (file.fieldname === 'videos') {
            if (allowedVideoTypes.test(ext)) {
                cb(null, true);
            } else {
                cb(new Error(`Video: ${ext} không hợp lệ`), false);
            }
        } else {
            cb(new Error('Field không hợp lệ'), false);
        }
    }
});