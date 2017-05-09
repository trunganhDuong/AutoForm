var currentId;
var currentFileContent;
var htmlAppended;
var textAppended;

//  GET CURRENT FILE CONTENT
var getCurrentContent = function () {
    if ($(".view-code").is(":checked")) {
        currentFileContent = $('.form-detail').find('pre').text();
    }
    else {
        currentFileContent = $('.form-detail').find('div').html();
    }
}
//  DISPLAY FORM CONTENT AS TEXT
var displayText = function (data) {
    textAppended = $("<pre></pre>").text(currentFileContent).appendTo($('.form-detail').keypress(function () {
        currentFileContent = $('.form-detail').find('pre').text();
    }));
}

//  DISPLAY FORM CONTENT AS HTML
var displayHTML = function (data) {
    htmlAppended = $("<div></div>").html(currentFileContent).appendTo($('.form-detail').keypress(function () {
        currentFileContent = $('.form-detail').find('div').html();
    }));
}

//GET ALL DISTRICTS OF A CITY 
var getDistrict = function () {
    $('#district').find('option').remove();
    $('#district').append("<option selected disabled>-- Chọn quận/huyện --</option>");
    var city = $('#city').val();
    $.ajax({
        method: "GET",
        url: '/admin/location/city/name/' + city,
        success: function (city) {
            city.districts.forEach(function (item) {
                $('#district').append("<option>" + item.name + "</option>");
            });
        }

    });
};

// GET ALL ORGANIZATION OF A DISTRICT
var getOrganization = function () {
    $('#organization').find('option').remove();
    var district = $('#district').val();
    $.ajax({
        method: "GET",
        url: '/admin/organization/district/name/' + district,
        success: function (data) {
            if (!data) {
                $('#organization').append("<option>Chọn tổ chức</option>");
            }
            else {
                $('#organization').append("<option disabled selected value>" + "-- Chọn tổ chức --" + "</option>");
                data.forEach(function (item) {
                    $('#organization').append("<option>" + item.name + "</option>");
                });
            }

        }

    });
}

//DOCUMENT READY
$(document).ready(function () {

    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    
    //  CLICK ON SEARCH HEADER
    $('.search-header').click(function () {
        $('.search-content').slideToggle();
    });

    //  CLICK ON ADD HEADER
    $('.add-header').click(function () {
        $('.add-form').slideToggle();
    });

    //  GET FILENAME WHEN SELECTED
    $('#file-dir').change(function () {
        var fileName = $(this).val().split('\\').pop();
        $('.file').text(fileName);
    });

    //  CLICK ON ADD BUTTON
    $('.add-button').click(function () {
        //check if there is empty field
        if ($('#name').val() === '') {
            alert('Nhập tên biểu mẫu');
            return;
        }
        if ($('#org').val() === '') {
            alert('Chọn tổ chức/doanh nghiệp');
            return;
        }
        if ($('.file').text() === 'Choose a file') {
            alert('Chọn đường dẫn đến file');
            return;
        }
        //send request to server
        $.ajax({
            method: "POST",
            data: {
                name: $('#name').val(),
                org: $('#org').val(),
                file: $('.file').text()
            },
            statusCode: {
                204: function () {
                    alert('Thêm thành công');
                    window.location.reload();
                },
                400: function () {
                    alert('Biểu mẫu đã tồn tại');
                }
            }
        });
    });

    //  GET DISTRICT CITY WHEN DOUCUMENT IS READY
    getDistrict();
    // GET DISTRICT WHEN SELECT CITY
    $('#city').on('change', function () {
        getDistrict();
    });

    //  GET ORGANIZATION WHEN SELECT DISTRICT
    $('#district').on('change', function () {
        getOrganization();
    });
    //  CLICK ON FORM ITEM
    $('.form-item').click(function () {
        $('.form-detail').html("");
        var formId = $(this).data('form-id');
        currentId = formId;
        $.ajax({
            method: "GET",
            url: '/admin/form/' + formId,
            success: function (data) {
                currentFileContent = data;
                displayHTML(data);// DISPLAY FORM CONTENT
                $('.reverse').show();
            }
        });

        $('.save-button').show(); //SHOW BUTTONS
        $('.delete-button').show();
    });

    //  CLICK ON SAVE BUTTON
    $('.save-button').click(function () {
        var cf = confirm('Bạn muốn cập nhật biểu mẫu này?');
        if (cf == true) {
            getCurrentContent();
            $.ajax({
                method: "PUT",
                data: {
                    formId: currentId, //FORMID WHICH IS SELECTED
                    content: currentFileContent
                },
                statusCode: {
                    204: function () {
                        alert('Cập nhật thành công');
                        window.location.reload();
                    },
                    500: function () {
                        alert('Cập nhật lỗi');
                        window.location.reload();
                    }
                }
            });
        }
    });

    //  CHOOSE TO VIEW AS TEXT
    $('.view-code').change(function () {
        if ($(this).is(":checked")) {
            currentFileContent = $('.form-detail').find('div').html();
            $('.form-detail').html("");
            displayText(currentFileContent);
        }
        else {
            currentFileContent = $('.form-detail').find('pre').text();
            $('.form-detail').html("");
            displayHTML(currentFileContent);
        }
    });

    //  CLICK ON SEARCH BUTTON 
    $('.search-button').click(function () {
        var city = $('#city').val();
        var district = $('#district').val();
        var org = $('#organization').val();

        if (org) {//   IF NO ORG IS SELECTED
            if (district) { //   IF ONE DISTRICT IS SELECTED
                // FIND ALL THE ORG IN SELECTED DISTRICT
                $.ajax({
                    method: 'GET',
                    url: '/admin/organization/district/name/' + district,
                    success: function(orgs){
                        alert(orgs);
                    }
                });
            }

        }

    });

    //  CLICK ON DELETE BUTTON - DELETE FORM
    $('.delete-button').click(function () {
        var cf = confirm('Bạn muốn xóa biểu mẫu này?');
        if (cf == true) {
            $.ajax({
                method: "DELETE",
                data: {
                    formId: currentId
                },
                statusCode: {
                    204: function () {
                        alert('Xoá thành công');
                        window.location.reload();
                    },
                    400: function () {
                        alert('Xoá không thành công');

                    }
                }

            });
        }
    });

});