import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
    required: true,
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
  confirm_password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: 8987,
  },
  role_id: {
    type: Number,
    required: true,
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

var counter = mongoose.model('users', userSchema);

userSchema.pre("save", async function (next) {
  if (this.isModified) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

const RegisterUser = new mongoose.model("User", userSchema);

export { RegisterUser };
