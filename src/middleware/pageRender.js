const _ = require("lodash");

module.exports = (req, res, next) => {
        const page = { isLogin: true };
        if (!_.get(req.session, "passport.user")) page.isLogin = false;
        req.page = page;

        next();
};
