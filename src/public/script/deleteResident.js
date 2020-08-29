$(document).ready(function () {
        $(".btn__delete").click(function (event) {
                event.preventDefault();
                const residentId = $(this).val().trim();
                $.ajax(`/api/resident/delete/${residentId}`, {
                        method: "DELETE",
                        success: function ({ msg }) {
                                toastr.success(msg);
                                $(`#${residentId}`).fadeOut();
                        },
                        error: function ({ responseText }) {
                                toastr.error(responseText);
                        },
                });
        });
});
