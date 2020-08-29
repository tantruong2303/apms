const _ = require("lodash");

module.exports = (req, res, next) => {
        if (_.get(req.session, "passport.user")) {
                res.redirect("/login");
        }

        next();
};
