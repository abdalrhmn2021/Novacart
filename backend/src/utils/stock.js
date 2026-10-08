const Product = require("../models/Product");

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// A product can be ordered only if it is active and in stock. When stock is
// tracked (a number), the requested quantity cannot exceed it.
function assertAvailable(product, quantity) {
  if (product.isActive === false || product.inStock === false) {
    throw new HttpError(400, `المنتج غير متوفر حالياً: ${product.name}`);
  }
  if (typeof product.stock === "number" && quantity > product.stock) {
    throw new HttpError(
      400,
      `الكمية المتوفرة من "${product.name}" هي ${product.stock} فقط`,
    );
  }
}

// Called once an order is paid. Each decrement is a single atomic update
// guarded by `stock >= quantity`, so two payments can never push stock below 0.
async function decrementStock(items) {
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
    );

    if (result.matchedCount === 0) {
      // Either stock is not tracked for this product (null), or it ran out
      // between checkout and payment. Only the second case needs attention.
      const product = await Product.findById(item.product).select("stock name");
      if (product && typeof product.stock === "number") {
        console.warn(
          `Stock conflict: order paid for ${item.quantity} x "${product.name}" but only ${product.stock} left`,
        );
      }
      continue;
    }

    await Product.updateOne(
      { _id: item.product, stock: { $lte: 0 } },
      { $set: { inStock: false } },
    );
  }
}

module.exports = { HttpError, assertAvailable, decrementStock };
