import mongoose from 'mongoose';


const EventSchema = new mongoose.Schema(
    {
  title: { type: String, required: true, trim: true },

  description: { type: String, required: true, trim: true },

  category: {
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Category',
  required: true },

  date: { type: Date, required: true },

  location: { type: String, required: true, trim: true },

  capacity: { type: Number, required: true, min: 1 },

  price: { type: Number, required: true, default: 0 },

  status: { 
  type: String, 
  enum: ['draft', 'published', 'cancelled','finished', 'rescheduled'], 
  default: 'draft' },

  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },

deliveryMethod:{ 
  type: String, 
  enum: ['Retiro del local', 'Envío a domicilio'], 
  required: true,
  default: 'Retiro del local' },

deliveryDate: { 
  type: Date, 
  required: true 
},
costoEnvio: { 
  type: Number, 
  default: 0 
}
},
{
 timestamps: true,
    versionKey: false
 }
);
 // Agrega esto dentro de tu esquema de Mongoose si los usuarios eligen cómo recibir el producto/entrada


export const EventModel = mongoose.model("Event", EventSchema);