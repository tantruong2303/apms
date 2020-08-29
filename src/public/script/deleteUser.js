$(document).ready(function () {
        $("#delete-form").submit(function (event) {
                event.preventDefault();

                const user = {
                        confirm: $("#confirm").val(),
                        password: $("#password").val(),
                };

                $.ajax("/api/user/delete", {
                        method: "POST",
                        data: user,
                        success: function (response) {
                                $("#status").text("success.");
                                toastr.success("success.");
                                $(location).attr("href", "/user/logout");
                        },
                        error: function ({ responseText }) {
                                $("#status").text("fail.");
                                toastr.error(responseText);
                        },
                });
        });
});
