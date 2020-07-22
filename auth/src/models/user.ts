// Mongoose User model to govern access to the user collection and determine how we add to, access or modify the data stored within it
import mongoose from 'mongoose';

// Schema tells mongoose about all the properties a user will have
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Feed schema into mongoose and create a model for accessing data
const User = mongoose.model('User', userSchema);

export { User };
