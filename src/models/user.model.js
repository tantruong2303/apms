const Joi = require("@hapi/joi");
const { ObjectId } = require("mongodb");

const { getDB } = require("../app/db");
const { compareHashingString, hashingString } = require("../helper/bcrypt.helper");
const { logger } = require("../app/logger");

class User {
        _id;
        isAdmin = false;
        googleId;
        facebookId;
        constructor({ username, password = "" }) {
                this._username = username;
                this._password = password;
        }
        //------------------------Setter--Getter--------------------
        get _getUserDB() {
                return {
                        username: this.username,
                        password: this.password,
                        isAdmin: this.isAdmin,
                        googleId: this.googleId,
                        facebookId: this.facebookId,
                };
        }

        set _username(value) {
                this.username = value.toLowerCase();
        }

        get _username() {
                return this.username.toUpperCase();
        }

        set _password(value) {
                this.password = value;
        }
        //-------------static-method-------------------------------------------
        static async isUnique(field, value) {
                const isUnique = await this.getByField(field, value);
                if (!isUnique) return true;

                return false;
        }

        static async loginUser({ username, password }) {
                const isExist = await this.getByField("username", username);
                if (!isExist) return null;

                const isCorrect = await compareHashingString(password, isExist.password);
                if (!isCorrect) return null;

                return this.getClassById(isExist._id);
        }

        //------------------------------------------------------------------------
        //-----------------------------validator-------------------------------
        static validator(field) {
                switch (field) {
                        case "username":
                                return Joi.string()
                                        .min(5)
                                        .regex(/^[a-zA-Z0-9]/)
                                        .max(50)
                                        .required();
                        case "password":
                                return Joi.string()
                                        .min(5)
                                        .max(255)
                                        .regex(/^[a-zA-Z0-9]/)
                                        .required();
                }
        }

        static validateLogin(param) {
                const schema = Joi.object({
                        username: this.validator("username"),
                        password: this.validator("password"),
                });
                return schema.validate(param);
        }

        static validateRegister(param) {
                const schema = Joi.object({
                        username: this.validator("username"),
                        password: this.validator("password"),
                        confirm: this.validator("password").valid(Joi.ref("password")),
                });
                return schema.validate(param);
        }

        static validateChangePassword(param) {
                const schema = Joi.object({
                        currentPassword: this.validator("password"),
                        newPassword: this.validator("password"),
                        confirm: this.validator("password").valid(Joi.ref("newPassword")),
                });
                return schema.validate(param);
        }

        static validateDelete(param) {
                const schema = Joi.object({
                        password: this.validator("password"),
                        confirm: this.validator("password").valid(Joi.ref("password")),
                });
                return schema.validate(param);
        }

        //-----------------------Repository--method-----------------------------
        static async getClassById(_id) {
                const userInDB = await this.getByField("_id", new ObjectId(_id));
                if (!userInDB) return null;

                //get user instance
                const user = new User(userInDB);
                user._id = userInDB._id;
                user.isAdmin = userInDB.isAdmin;
                user.googleId = userInDB.googleId;
                user.facebookId = userInDB.facebookId;

                return user;
        }

        static async getByField(field, value) {
                return await getDB()
                        .collection("user")
                        .findOne({ [`${field}`]: value });
        }

        async updateByField(field, value) {
                const user = await getDB()
                        .collection("user")
                        .updateOne({ _id: new ObjectId(this._id) }, { $set: { [`${field}`]: value } });
                if (!user) {
                        logger.error("Server error during updating user");
                        return null;
                }

                return user;
        }

        async createNewUser() {
                const user = this._getUserDB;
                user.password = await hashingString(user.password, 10);

                const userDB = await getDB().collection("user").insertOne(user);
                if (!userDB) return logger.error("Server error, Can't insert new User");

                return userDB;
        }

        async createNewUserBySocial({ id }, socialField) {
                this[socialField] = id;

                const userDB = await this.createNewUser();
                //need to fix
                return await getDB().collection("user").findOne({ googleId: userDB.insertedId });
        }

        //------------------------------------------------------------------

        //---------------------Class-method-----------------------------------------
        async selfDestruction({ password }) {
                const isCorrect = await compareHashingString(password, this.password);
                if (!isCorrect) return null;

                return await getDB()
                        .collection("user")
                        .deleteOne({ _id: new ObjectId(this._id) });
        }

        async changePassword({ currentPassword, newPassword }) {
                const isCorrect = await compareHashingString(currentPassword, this.password);
                if (!isCorrect) return null;

                const newHashingPassword = await hashingString(newPassword, 10);
                return await this.updateByField("password", newHashingPassword);
        }
        //-----------------------------------------------------------------------
}

module.exports.User = User;
