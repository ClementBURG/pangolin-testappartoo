import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const friendSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  _friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

friendSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Friend', friendSchema);
