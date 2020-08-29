const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("mongodb");
const _ = require("lodash");

const { Resident } = require("../models/resident.model");
const formatError = require("../utils/formatError");
const auth = require("../middleware/auth");
const { getDB } = require("../app/db");

module.exports = {
        createNewResident:
                ([auth],
                async (req, res) => {
                        const info = _.pick(req.body, ["name", "houseId", "sex", "old", "career"]);

                        const { error, value } = Resident.validateResident(info);
                        if (error) return res.status(400).send(formatError(error.details[0].context.label, error.details[0].type));

                        const resident = new Resident(value);
                        await resident.createNewResident();

                        res.send(resident);
                }),

        deleteUser: async (req, res) => {
                const residentId = req.params.id;
                const isValid = isValidObjectId(residentId);
                if (!isValid) return res.status(400).json({ data: null, msg: "User with the given Id is invalid", statusCode: 400 });

                const deleteUser = await getDB()
                        .collection("resident")
                        .deleteOne({ _id: new ObjectId(residentId) });

                if (!deleteUser) return res.status(404).json({ data: null, msg: "Resident not found.", statusCode: 404 });
                res.json({ data: null, msg: "Resident is deleted.", statusCode: 201 });
        },

        updateUser: async (req, res) => {
                const info = _.pick(req.body, ["name", "houseId", "sex", "old", "career"]);
                const { error, value } = Resident.validateResident(info);
                if (error) {
                        console.log(error.details[0].type);
                        return res.status(400).send(formatError(error.details[0].context.label, error.details[0].type));
                }

                const residentId = req.body._id;

                const isValid = isValidObjectId(residentId);
                if (!isValid) return res.status(400).json({ data: null, msg: "User with the given Id is invalid", statusCode: 400 });

                const resident = new Resident(value.name, value.houseId, value.sex, value.old, value.career);
                const updateResident = await resident.updateResident(residentId, resident);

                if (!updateResident) return res.status(404).json({ data: null, msg: "Resident not found.", statusCode: 404 });

                res.json({
                        statusCode: 200,
                        data: null,
                        msg: "Update resident successful.",
                });
        },
};
