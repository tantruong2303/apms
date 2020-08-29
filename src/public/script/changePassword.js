$(document).ready(function () {
        $("#change-password-form").submit(function (event) {
                event.preventDefault();

                const user = {
                        currentPassword: $("#password").val(),
                        newPassword: $("#new-password").val(),
                        confirm: $("#confirm").val(),
                };

                $.ajax("/api/user/changePassword", {
                        method: "POST",
                        data: user,
                        success: function (response) {
                                toastr.success(response.text);
                                $(location).attr("href", "user/logout");
                        },
                        error: function ({ responseJSON }) {
                                toastr.error(responseJSON.text);
                        },
                });
        });
});
