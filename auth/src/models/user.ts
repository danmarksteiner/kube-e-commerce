// Mongoose User model to govern access to the user collection and determine how we add to, access or modify the data stored within it
import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

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

// We call this instead of 'new User' anytime we want to create a user
// Used to help TS and Mongoose work together and check correct types
// Makes TS aware of the properties needed to create a User
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User };
