var currentFormId;
var currentFileContent;
var htmlAppended;
var textAppended;
var selectedDistrict;
var selectedOrg;

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
                var appended = $('<option data-id="' + item._id + '">' + item.name + '</option>');
                appended.appendTo($('#district'));
            });
        }

    });
};

// GET ALL ORGANIZATION OF A DISTRICT
var getOrganization = function (distId) {
    /*$('#organization').find('option').remove();
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

    });*/
    $('#organization').find('option').remove();
    $('#organization').append("<option disabled selected> --Chọn tổ chức-- </option>");
    $.ajax({
        method: "GET",
        url: '/admin/organization/district/' + distId,
        success: function (data) {
            data.forEach(function (item) {
                var appended = $('<option data-id="' + item._id + '">' + item.name + '</option>');
                appended.appendTo($('#organization'));
            });
        }

    });
}

//  DISPLAY FORMS
var displayForms = function (forms) {
    $('.form-list-detail').find('.pure-menu-list').empty();
    forms.forEach(function (form) {
        //  STRING TO APPEND
        var str = "";
        str += '<li class="pure-menu-item form-item">';
        str += '<a class="pure-menu-link" data-id="' + form._id + '">';
        str += form.name;
        str += '</a>';
        str += '</li>';

        var appended = $(str);
        appended.click(function () {
            $('.form-detail').html("");
            currentFormId = $(this).find('a').data('id');
            $.ajax({
                method: "GET",
                url: '/admin/form/' + currentFormId,
                success: function (data) {
                    currentFileContent = data;
                    displayHTML(currentFileContent);// DISPLAY FORM CONTENT
                    $('.reverse').show();
                }
            });
        })
        appended.appendTo($('.form-list-detail').find('.pure-menu-list'));

    });
}

//  SEARCH
var search = function () {
    if (!selectedDistrict) {
        alert('Chọn quận/huyện để tiếp tục');
        return;
    }
    if (!selectedOrg) {
        alert('Chọn tổ chức để tiếp tục');
        return;
    }

    //  GET ALL FORM OF THIS ORG
    $.ajax({
        method: 'GET',
        url: '/admin/form/org/' + selectedOrg,
        success: function (forms) {
            displayForms(forms);
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
        if ($('.file').text() === 'Choose a file') {
            alert('Chọn đường dẫn đến file');
            return;
        }
        //send request to server
        $.ajax({
            method: "POST",
            data: {
                name: $('#name').val(),
                org: $('#organization').val(),
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
        selectedDistrict = $(this).find(':selected').data('id');
        getOrganization(selectedDistrict);
    });

    //  SELECT ORGANIZATION 
    $('#organization').on('change', function () {
        selectedOrg = $(this).find(':selected').data('id');
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
        //  SEARCH
        search();

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