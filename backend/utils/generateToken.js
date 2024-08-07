import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, //millisecond format
    httpOnly: true, //prevent XSS atacks cross-site scripting attacks
    sameSite: "strict", //CSRF attacks cross site request forgery attacks
    secure:process.env.NODE_ENV !== "development"

  });
};

export default generateTokenAndSetCookie;