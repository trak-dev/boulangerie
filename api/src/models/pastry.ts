import mongoose, { Schema, Document } from 'mongoose';

export interface IPastry extends Document {
  name: string;
  image: string;
  stock: number;
  quantityWon: number;
}

const PastrySchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  quantityWon: { type: Number, required: true },
}, { collection: 'pastries' });

export default mongoose.model<IPastry>('Pastry', PastrySchema);