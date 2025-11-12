import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    transformation: [
    { width: 1200, height: 1200, crop: "limit" }, // resize tự động
    { quality: "auto" }, // tự động chọn quality
    { fetch_format: "auto" } // tự động chọn webp/jpg
]
});

export default cloudinary;
