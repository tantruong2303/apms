$(document).ready(function () {
        $("#register-form").submit(function (event) {
                event.preventDefault();

                const user = {
                        username: $("#username").val(),
                        password: $("#password").val(),
                        confirm: $("#confirm").val(),
                };

                $.ajax("/api/user/register", {
                        method: "POST",
                        data: user,
                        success: function (response) {
                                toastr.success(response.text);
                                $(location).attr("href", "/user/login");
                        },
                        error: function ({ responseJSON }) {
                                toastr.error(responseJSON.text);
                        },
                });
        });
});
