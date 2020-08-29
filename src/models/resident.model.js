const Joi = require("@hapi/joi");
const { ObjectID } = require("mongodb");

const { getDB } = require("../app/db");
const { logger } = require("../app/logger");

module.exports.Resident = class Resident {
        constructor({ name, houseId, sex, old, career }) {
                this._name = name;
                this.houseId = houseId;
                this._sex = sex;
                this._old = old;
                this._career = career;
        }
        //---------------Setter----Getter------------

        set _name(value) {
                this.name = value.toLowerCase();
        }

        get _name() {
                return this.name
                        .split(" ")
                        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                        .join(" ");
        }

        set _sex(value) {
                this.sex = value ? true : false;
        }

        //true = male , false = female
        get _sex() {
                return this.sex ? "Male" : "Female";
        }

        set _old(value) {
                this.old = Math.round(value);
        }

        get _old() {
                return this.old;
        }

        set _career(value) {
                this.career = value.toLowerCase();
        }

        get _career() {
                return this.career
                        .split(" ")
                        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                        .join(" ");
        }

        get _houseId() {
                return this.houseId;
        }

        get _info() {
                return {
                        _id: this._id,
                        name: this._name,
                        sex: this._sex,
                        old: this._old,
                        houseId: this._houseId,
                        career: this._career,
                };
        }

        get _getResidentDB() {
                return {
                        name: this.name,
                        houseId: this.houseId,
                        sex: this.sex,
                        old: this.old,
                        career: this.career,
                };
        }

        //-----------------------------------------------------

        //-----------------Validator---------------------------
        //Main validator
        static validator(field) {
                switch (field) {
                        case "name":
                                Joi.string()
                                        .regex(/^[a-zA-Z0-9]/)
                                        .required();

                        case "houseId":
                                Joi.number().integer().required();
                        case "sex":
                                Joi.boolean().required();
                        case "old":
                                Joi.number().integer().min(1).max(150).required();
                        case "career":
                                Joi.string().required();

                        default:
                                logger.warn("Validator must be valid field");
                }
        }

        static validateResident(param) {
                const schema = Joi.object({
                        name: this.validator("name"),
                        houseId: this.validateResident("houseId"),
                        sex: this.validator("sex"),
                        old: this.validator("old"),
                        career: this.validator("career"),
                });
                return schema.validate(param);
        }
        //-----------------------------------------------------

        //-----------------------Repository--method-----------
        static async getAmountResident() {
                return await getDB().collection("resident").countDocuments();
        }

        static async getAllResident(currentPage, pageSizes = 10) {
                const residents = await getDB()
                        .collection("resident")
                        .find()
                        .skip(currentPage * pageSizes)
                        .limit(pageSizes)
                        .sort({ name: 1 })
                        .toArray();

                const formatResident = residents.map((item) => {
                        const user = new Resident(item);
                        user._id = item._id;
                        return user._info;
                });

                return formatResident;
        }

        async createNewResident() {
                const resident = await getDB().collection("resident").insertOne(this._getResidentDB);
                if (!resident) return logger.error("Server error, Can't insert new Resident");

                return resident;
        }

        static async getInfoResidentById(_id) {
                const resident = await getDB()
                        .collection("resident")
                        .findOne({ _id: new ObjectID(_id) });
                const user = new Resident(resident);

                return user._info;
        }

        async updateResident(_id, { ...rest }) {
                const result = await getDB()
                        .collection("resident")
                        .updateOne({ _id: new ObjectID(_id) }, { $set: { ...rest } });

                return result;
        }
        //-----------------------------------------------------

        //--------------------Class method--------------------------
        //------------
        //-----------------------------------------------------
};
