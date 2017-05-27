$(document).ready(function () {
    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    $('.add-button').click(function () {
        if ($('#name').val() === "") {
            alert("Tên trường không được để trống");
        } if ($('#sname').val() === "") {
            alert("Mã trường không được để trống");
        }
        else {
            $.ajax({
                method: "POST",
                data: {
                    name: $('#name').val(),
                    sname: $('#sname').val(),
                    order:$('#order').val()
                },
                statusCode: {
                    204: function () {
                        alert('Thêm thành công ');
                        window.location.reload();
                    },
                    400: function () {
                        alert('Thông tin đã tồn tại');
                    }
                }
            });
        }


    });
});