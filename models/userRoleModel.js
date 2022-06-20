import mongoose from "mongoose";

const userRoleModelSchema = new mongoose.Schema({
  role_type: {
    type: String,
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
});

const userRole = new mongoose.model("userRole", userRoleModelSchema);

export default userRole;
