import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User schema.
 * Stores account credentials for authentication. Passwords are never
 * stored in plain text — they are hashed with bcrypt before saving.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "An email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "A password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // Never return the password by default in queries.
      select: false,
    },
  },
  { timestamps: true }
);

/**
 * Hash the password before saving, but only when it has been set/changed.
 * A salt is generated automatically by bcrypt.hash.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare a plain-text password against the stored hash.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
