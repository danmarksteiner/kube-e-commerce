// Mongoose User model to govern access to the user collection and determine how we add to, access or modify the data stored within it
import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  // Tells TS about the build method and what properties it accepts
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties a user document (single user) has
// If we have extra properties we add them here
interface UserDoc extends mongoose.Document {
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

// Custom 'build' function added to the model
// Added to statics property on the schema
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Feed schema into mongoose and create a model for accessing data
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
