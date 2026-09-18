let io = null

export function setIO(socketIO) {
  io = socketIO
}

export function getIO() {
  return io
}

export function emitNewOrder(order) {
  if (io) {
    io.emit('new-order', {
      id: order.id,
      customerName: order.customerName,
      total: order.total,
      createdAt: order.createdAt
    })
  }
}

export function emitOrderStatusUpdate(order) {
  if (io) {
    io.emit('order-status-updated', {
      id: order.id,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    })
  }
}

export function emitLowStock(product) {
  if (io) {
    io.emit('low-stock', {
      productId: product.id,
      productName: product.name,
      stock: product.stock
    })
  }
}
