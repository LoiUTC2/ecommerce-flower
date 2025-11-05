export const newOrderAdminTemplate = (order) => {
    const itemsHtml = order.items.map(it => {
        const name = it.product?.name || it.product;
        return `<li>${it.quantity} x ${name} — ${Number(it.price).toLocaleString()}₫</li>`;
    }).join("");

    return `
    <div style="font-family: Arial, sans-serif; color:#111;">
      <h2>📢 Đơn hàng mới từ ${process.env.SHOP_NAME || "Shop"}</h2>
      <p><b>Mã đơn:</b> ${order._id}</p>
      <p><b>Khách hàng:</b> ${order.customerName} — ${order.customerPhone} ${order.customerEmail ? `— ${order.customerEmail}` : ""}</p>
      <p><b>Địa chỉ:</b> ${order.shippingAddress}</p>
      <p><b>Phương thức thanh toán:</b> ${order.paymentMethod}</p>
      <h4>Chi tiết sản phẩm:</h4>
      <ul>${itemsHtml}</ul>
      <p><b>Tổng tiền:</b> ${Number(order.totalAmount).toLocaleString()}₫</p>
      <p>Thời gian đặt: ${new Date(order.createdAt).toLocaleString()}</p>
      <p><a href="${process.env.ADMIN_PANEL_URL || '#'}">Mở quản trị xem chi tiết</a></p>
    </div>
  `;
};
