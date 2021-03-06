import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  age: { type: Number },
  family: { type: String },
  race: { type: String },
  food: { type: String }
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
