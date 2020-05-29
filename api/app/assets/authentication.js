import jwt from 'jsonwebtoken';

class Authentication {
  static genAuth(user) {
    const JWTToken = jwt.sign({
        username: user.username,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      });

    return {
      user: user,
      jwt: JWTToken,
      expiresIn: process.env.JWT_EXPIRATION,
    };
  }
}

export default Authentication;
