import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    default: 'Sin apellido'
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
    required: true
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