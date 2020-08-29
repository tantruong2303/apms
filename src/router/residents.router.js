const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { Resident } = require("../models/resident.model");

//----------------------Resident----Render----------------------------------------------
router.get("/add", [auth], (req, res) => {
        res.render("addResident.ejs", { pageTitle: "Add new resident | APMS", page: req.page });
});

router.get("/list", (req, res) => {
        res.redirect("/resident/list/1");
});

router.get("/list/:page", async (req, res) => {
        const NumOfResident = await Resident.getAmountResident();
        const maxPage = Math.ceil(NumOfResident / 10);

        if (req.params.page < 1 || isNaN(req.params.page) || req.params.page > maxPage) return res.redirect("/resident/list/1");
        const residents = await Resident.getAllResident(req.params.page - 1, 10);

        res.render("listResident.ejs", { pageTitle: "Resident | APMS", page: req.page, residents });
});

router.get("/update/:id", async (req, res) => {
        const resident = await Resident.getInfoResidentById(req.params.id);
        resident._id = req.params.id;

        res.render("updateResident.ejs", { pageTitle: "Update resident | APMS", page: req.page, resident });
});
//-------------------------------------------------------

module.exports = router;
