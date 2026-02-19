import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    totalPackagesAppointed: { 
        type: Number, 
        default: 0 
    },
    totalPackagesDelivered: { 
        type: Number, 
        default: 0 
    },
    totalUsers: { 
        type: Number, 
        default: 0 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
  },
  { timestamps: true }
);

const Stats = mongoose.model("Stats", statsSchema);

export default Stats;