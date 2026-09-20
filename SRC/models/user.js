import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "El apellido debe tener al menos 3 caracteres"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
},
  password: {
    type: String,
    required: true,
    minlength: 10
  },
  role: {
    type: String,
    enum: ["user", "admin", "organizer"],
    default: "user"
}
},
{
    timestamps: true
}
);

export default mongoose.model("User", userSchema);