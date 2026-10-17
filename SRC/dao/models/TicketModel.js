import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Coincide con tu ref en organizer
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Coincide con tu modelo Event
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed",
    },
    reservationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TicketModel = mongoose.model("Ticket", TicketSchema);
