class UserModel {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.dob = user.dob;
    this.mobil = user.mobile;
    this.email = user.email;
    this.is_user_active = user.is_user_active;
    this.is_user_verified = user.is_user_verified;
    this.token = user.tokens[user.tokens.length - 1];
  }
}

export default UserModel;
