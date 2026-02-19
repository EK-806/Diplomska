import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    senderFirstName: { 
        type: String, 
        required: true 
    },
    senderLastName: { 
        type: String, 
        required: true 
    },
    senderEmail: { 
        type: String, 
        required: true 
    },
    senderPhone: { 
        type: String,
        required: true 
    },
    packageType: { 
        type: String, 
        required: true 
    },
    packageWeight: { 
        type: Number, 
        required: true 
    },
    receiverFirstName: { 
        type: String, 
        required: true 
    },
    receiverLastName: { 
        type: String, 
        required: true 
    },
    receiverEmail: { 
        type: String, 
        required: true 
    },
    receiverPhone: { 
        type: String, 
        required: true 
    },
    deliveryAddress: { 
        type: String, 
        required: true 
    },
    deliveryLat: { 
        type: Number 
    },
    deliveryLng: { 
        type: Number 
    },
    cost: { 
        type: Number, 
        required: true 
    },
    requestedDeliveryDate: { 
        type: Date, 
        required: true 
    },
    approximateDeliveryDate: { 
        type: Date 
    },
    appointedDate: { 
        type: Date, 
        default: Date.now 
    },
    deliveryDriverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Pending", "On The Way", "Delivered", "Returned", "Cancelled"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    paymentId: { 
        type: String 
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;