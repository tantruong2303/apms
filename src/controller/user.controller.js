const _ = require("lodash");

const { User } = require("../models/user.model");
const auth = require("../middleware/auth");
const formatError = require("../utils/formatError");

module.exports = {
        register: async (req, res) => {
                const info = _.pick(req.body, ["username", "password", "confirm"]);

                const { error, value } = User.validateRegister(info);

                if (error)
                        return res.status(400).json({
                                status: 400,
                                data: null,
                                msg: formatError(error.details[0].context.label, error.details[0].type),
                        });

                const isUnique = await User.isUnique("username", value.username);
                if (!isUnique)
                        return res.status(400).json({
                                status: 400,
                                data: null,
                                msg: "Username is taken.",
                        });

                const newUser = new User(_.pick(value, ["username", "password"]));
                await newUser.createNewUser();

                res.status(200).json({
                        status: 200,
                        data: null,
                        msg: "Register successful.",
                });
        },

        login: async (req, res) => {
                const info = _.pick(req.body, ["username", "password"]);

                const { error, value } = User.validateLogin(info);
                if (error)
                        return res.status(400).json({
                                status: 400,
                                data: null,
                                text: formatError(error.details[0].context.label, error.details[0].type),
                        });

                const user = await User.loginUser(value);
                if (!user)
                        return res.status(400).json({
                                status: 400,
                                data: null,
                                text: "username or password is not correct.",
                        });

                req.session.passport = {user};
                res.status(200).json({
                        status: 200,
                        data: null,
                        text: "Login successful.",
                });
        },

        changePassword: [
                auth,
                async (req, res) => {
                        const info = _.pick(req.body, ["currentPassword", "newPassword", "confirm"]);

                        const { error, value } = User.validateChangePassword(info);
                        if (error)
                                return res.status(400).json({
                                        status: 400,
                                        data: null,
                                        text: formatError(error.details[0].context.label, error.details[0].type),
                                });

                        if (!req.user.changePassword(value))
                                return res.status(400).json({
                                        status: 400,
                                        data: null,
                                        text: "username or current-password is not correct.",
                                });

                        res.status(200).json({
                                status: 200,
                                data: null,
                                text: "Change password successful.",
                        });
                },
        ],

        deleteUser: [
                auth,
                async (req, res) => {
                        const info = _.pick(req.body, ["password", "confirm"]);

                        const { error, value } = User.validateDelete(info);
                        if (error)
                                return res.status(400).json({
                                        status: 400,
                                        data: null,
                                        text: formatError(error.details[0].context.label, error.details[0].type),
                                });

                        const isDone = await req.user.selfDestruction(value);
                        if (!isDone)
                                return res.status(400).json({
                                        status: 400,
                                        data: null,
                                        text: "Password is not correct.",
                                });

                        res.status(200).json({
                                status: 200,
                                data: null,
                                text: "Delete successful.",
                        });
                },
        ],
};
