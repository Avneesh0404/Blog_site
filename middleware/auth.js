const { validtoken } = require("../services/auth");
function checkauth(cookiename) {
  return (req, res, next) => {
    const cookievalue = req.cookies[cookiename];
    if (!cookievalue) {
      return next();
    }
    try {
      const payload = validtoken(cookievalue);
      req.user = payload;
    } catch (error) {
      console.log(error);
    }
    return next();
  };
}

module.exports = { checkauth };
