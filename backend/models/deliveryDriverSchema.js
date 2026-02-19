import mongoose from "mongoose";

const DeliveryDriverSchema = new mongoose.Schema(
  {
    deliveryDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packagesDelivered: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
);

const DeliveryDriver = mongoose.model("DeliveryDriver", DeliveryDriverSchema);

export default DeliveryDriver;