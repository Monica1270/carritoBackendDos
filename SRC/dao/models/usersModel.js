import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, 
    trim: true, 
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  lastName: {
    type: String,
    required: true, 
    trim: true, 
    minlength: [3, "El apellido debe tener al menos 3 caracteres"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 10
  },
  role: {
    type: String,
    enum: ["user", "admin","manager "],
    default: "user",
  },
},
{
    timestamps: true, // Agrega automáticamente campos createdAt y updatedAt
});

export const userModel = mongoose.model("User", userSchema);