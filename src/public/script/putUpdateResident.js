$(document).ready(function () {
        $("#update-resident-form").submit(function (e) {
                e.preventDefault();

                const resident = {
                        _id: $("#id").val(),
                        name: $("#name").val(),
                        sex: $("#sex").val(),
                        old: $("#old").val(),
                        career: $("#career").val(),
                        houseId: $("#houseId").val(),
                };
                $.ajax("/api/resident/update", {
                        method: "PUT",
                        data: resident,
                        success: function (response) {
                                console.log(response);
                                console.log("444");
                                $(location).attr("href", "/resident/list");
                        },
                        error: function ({ msg }) {
                                toastr.error(msg);
                        },
                });
        });
});
  