import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: false,
  },
  mobile: {
    type: String,
    validate: {
      validator: function (v) {
        return /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/.test(v);
      },
      message: "Please enter a valid mobile number",
    },
    required: [true, "Mobile Number is required"],
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  userRole: {
    type: String,
    required: true,
    default: "USER",
  },
  last_updated: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  is_user_active: {
    type: Boolean,
    required: true,
    default: true,
  },
  is_user_verified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this.id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.error(error);
  }
};

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   }
// });
userSchema.pre('save', async function(next) {
  try {
  // check method of registration
  const user = this;
  if (!user.isModified('password')) next();
  // generate salt
  const salt = await bcrypt.genSalt(10);
  // hash the password
  const hashedPassword = await bcrypt.hash(this.password, salt);
  // replace plain text password with hashed password
  this.password = hashedPassword;
  next();
  } catch (error) {
  return next(error);
  }
  });
const VidishaBazaarUser = new mongoose.model("User", userSchema);

export { VidishaBazaarUser };
