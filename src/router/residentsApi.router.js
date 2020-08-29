const express = require("express");
const router = express.Router();

const residentController = require("../controller/resident.controller");

//------------Resident----Api----------------------------
router.post("/api/add", residentController.createNewResident);

router.delete("/api/delete/:id", residentController.deleteUser);

router.put("/api/update", residentController.updateUser);
//-------------------------------------------------------

module.exports = router;
