// Mongoose User model to govern access to the user collection and determine how we add to, access or modify the data stored within it
import mongoose from 'mongoose';
import { Password } from '../services/password';

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
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Edit the JSON response to remove the password, _v and re-assign _id from mongoose to just id
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Middlware pre-save hook so we can securely salt, hash and save a submitted password
// Done argument needs to be manually called to support asynchronous request in mongoose
// Function keyword needed to access the document(user) being saved as 'this'
userSchema.pre('save', async function (done) {
  // Attempt to hash the password only if it's been modified - Stops double hashing if for example email is updated on a user
  if (this.isModified('password')) {
    // Get users password from document, pass to hash and assign to hashed
    const hashed = await Password.toHash(this.get('password'));
    // Update the password on the request
    this.set('password', hashed);
  }
  // Manually invoke done
  done();
});

// Custom 'build' function added to the model
// Added to statics property on the schema
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Feed schema into mongoose and create a model for accessing data
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
