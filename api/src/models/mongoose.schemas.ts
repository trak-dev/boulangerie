import mongoose from 'mongoose';
const { Schema } = mongoose;

export const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pastriesWon: {
    type: Array,
    required: true,
  },
  triesNumber: {
    type: Number,
    required: true,
  },
});

export const pastrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  quantityWon: {
    type: Number,
    required: true,
  },
});