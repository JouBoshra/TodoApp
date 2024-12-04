const jwt = require("jsonwebtoken");
const config = require("./config/app");

module.exports.getJwtToken = (user) => {
  let token = jwt.sign(user.toJSON ? user.toJSON() : user, config.token.secret, {
    expiresIn: 86400, // 2 days 
  });
  return {
    success: true,
    token: "JWT " + token,
    expiresIn: 86400,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    }
  }
}
