const { User } = require("../models/user.model");
const _ = require("lodash");

module.exports = async (req, res, next) => {
        if (!_.get(req.session, "passport.user")) return res.redirect("/home");
        req.user = await User.getClassById(req.session.passport.user._id);

        next();
};
