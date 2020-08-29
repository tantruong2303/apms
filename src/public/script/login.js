$(document).ready(function () {
        $("#login-form").submit(function (event) {
                event.preventDefault();

                const user = {
                        username: $("#username").val(),
                        password: $("#password").val(),
                };

                $.ajax("/api/user/login", {
                        method: "POST",
                        data: user,
                        success: function (response) {
                                toastr.success(response.text);
                                $(location).attr("href", "/home");
                        },
                        error: function ({ responseJSON }) {
                                toastr.error(responseJSON.text);
                        },
                });
        });
});
