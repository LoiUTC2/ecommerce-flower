import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // giá tại thời điểm đặt hàng
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true },
        customerPhone: { type: String, required: true },
        customerEmail: { type: String },
        shippingAddress: { type: String, required: true },
        note: { type: String },

        items: [orderItemSchema],

        totalAmount: { type: Number, required: true },

        paymentMethod: {
            type: String,
            enum: ["cod", "stripe", "vnpay", "momo"],
            default: "cod",
        },

        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid", "failed"],
            default: "unpaid",
        },

        transactionId: { type: String },

        status: {
            type: String,
            enum: ["pending", "confirmed", "delivering", "completed", "cancelled"],
            default: "pending",
        },

        // isPaid: { type: Boolean, default: false },
        // paidAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
