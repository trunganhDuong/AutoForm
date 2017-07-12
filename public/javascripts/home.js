var currentFormId;
var currentProfId;
var currentFormContent;
var selectedDistrict;
var selectedOrg
var detail = [];

// CONVERT PROFILE DETAIL
var convertProfile = function (profDetail) {
    $.each(profDetail, function (index, item) {
        getSname(item['fieldId'], item['value']);
    });
}

//  GET SNAME
var getSname = function (fieldId, value) {
    $.ajax({
        method: 'GET',
        url: '/admin/field/json/' + fieldId,
        success: function (field) {
            var obj = {
                sname: field.sName,
                value: value
            };
            detail.push(obj);
        }
    });
}

//  GET AND FILL ORGNAME
var fillOrg = function () {
    $.ajax({
        method: 'GET',
        url: '/admin/form/org/id/' + currentFormId,
        success: function (orgId) {
            $.ajax({
                method: 'GET',
                url: '/admin/organization/json/' + orgId,
                success: function (org) {
                    //  FILL ORG NAME
                    currentFormContent = currentFormContent.replace("<!--orgName-->", org.name);
                    displayForm(currentFormContent);

                    //  DISPLAY BUTTONS
                    $('.export-button').css('visibility', 'visible');
                    $('.edit-button').css('visibility', 'visible');


                    //  SAVE HISTORY
                    saveHistory();
                }
            });
        }
    });
}

//  FILE FORM
var fill = function () {
    detail.forEach(function (item) {
        var old = "<!--" + item['sname'] + "-->";
        var last = item['value'];
        if (item.sname === 'ho' || item.sname === 'ten_dem' || item.sname === 'ten')
            last += " ";
        currentFormContent = currentFormContent.replace(old, last);
    });
}

//  DISPLAY FORM CONTENT
var displayForm = function (html) {
    currentFormContent = html;
    $('.form-detail').html("");
    $('.form-detail').html(html);
}

//  DISPLAY FILL BUTTON
var displayButtons = function () {
    $('.fill-button').css('visibility', 'visible');
    $('.print-button').css('visibility', 'visible');

}

//  GET ALL DISTRICTS OF A CITY 
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

//  GET ALL ORGANIZATION OF A DISTRICT
var getOrganization = function (distId) {
    $('#organization').find('option').remove();
    $('#organization').append("<option disabled selected> -- Chọn tổ chức -- </option>");
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

//  GET PROFILE DETAIL
var getProfDetail = function (callback) {
    $.ajax({
        method: 'GET',
        url: '/profile/' + currentProfId,
        success: function (prof) {
            callback(prof);
        }
    });
}

//  SAVE HISTORY
var saveHistory = function () {

}

//  DISPLAY SEARCH RESULT
var displayResult = function (list) {
    list.forEach(function (item) {
        var str = "";
        var dtid = "data-id=" + item._id;
        str += '<li class="pure-menu-item form-item">';
        str += '<a class="pure-menu-link"' + dtid + '>';
        str += item.name;
        str += '</a>';
        str += '</li>';

        var appended = $(str);
        appended.appendTo($('.form-list-detail').find('.pure-menu-list'));
    });

}

//  DISPLAY FORMS
var displayForms = function (forms) {
    $('.form-list-detail').find('.pure-menu-list').empty();
    forms.forEach(function (form) {
        //  STRING TO APPEND
        var str = "";
        str += '<li class="pure-menu-item form-item tooltip ">';
        str += '<a class="pure-menu-link " data-id="' + form._id + '">';
        str += form.name;
        str += '</a>';
        str +=' <span class="tooltiptext">'+form.name+'</span>';
        str += '</li>';

        var appended = $(str);
        appended.click(function () {
            $('.form-detail').html("");
            currentFormId = $(this).find('a').data('id');
            $.ajax({
                method: 'GET',
                url: '/admin/form/' + currentFormId,
                success: function (form) {
                    displayForm(form);
                    displayButtons();
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

//  DOCUMENT READY
$(document).ready(function () {
    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });

    //  CHECK IF PROF ALREADY CHOSEN
    if ($('#profile').val() !== "-- Chọn profile --") {
        currentProfId = $('#profile').find(':selected').data('id');
    }

    //  GET DISTRICT CITY WHEN DOUCUMENT IS READY
    getDistrict();

    // EXPAND SEARCH HEADER
    $('.search-header').click(function () {
        $('.search-content').slideToggle();
    });

    //  SELECT A FORM
    $('.form-item').click(function () {
        currentFormId = $(this).find('a').data('id');
        $.ajax({
            method: 'GET',
            url: '/admin/form/' + currentFormId,
            success: function (form) {
                displayForm(form);
                displayButtons();
            }
        });
    });

    // GET DISTRICT WHEN SELECT CITY
    $('#city').on('change', function () {
        getDistrict();
    });

    // GET ORGS WHEN SELECT DISTRICT
    $('#district').on('change', function () {
        selectedDistrict = $(this).find(':selected').data('id');
        getOrganization(selectedDistrict);
    })

    //  SELECTED ORG
    $('#organization').on('change', function () {
        selectedOrg = $(this).find(':selected').data('id');
    })

    //  SELECT A PROFILE
    $('#profile').on('change', function () {
        currentProfId = $(this).find(':selected').data('id');
        getProfDetail(function (prof) {
            convertProfile(prof.detail);
        });
    });

    //  FILL FORM
    $('.fill-button').click(function () {
        if (!currentProfId) {
            alert('Chọn profile để điền');
            return;
        }
        fill();
        fillOrg();


    });

    //  DISPLAY EXPORT MODAL
    $('.export-button').click(function () {
        $('.print-modal').css('display', 'block');
    });

    //  CANCEL EXPORT FILE
    $('.cancel-export-button').click(function () {
        $('.print-modal').css('display', 'none');
        $('#file-name').text() = "";
    });

    //  EXPORT FILE
    $('.print-modal').find('.export-button').click(function () {
        if ($('#file-name').val() === '') {
            alert('Nhập tên file');
            return;
        }
        if ($('#format').val() === 'PDF') {//   GENERATE PDF FILE
            html2canvas($('.form-detail'), {
                onrendered: function (canvas) {
                    var img = canvas.toDataURL("image/jpg");
                    var doc = new jsPDF('p', 'pt', 'a4');
                    doc.addImage(img, 'JPEG', 20, 20);
                    doc.save($('#file-name').val());


                }
            })
        }
        else {
            $('.form-detail').wordExport($('#file-name').val());
        }

        $('#file-name').text() = "";

    });

    //  CLICK ON SEARCH BUTTON
    $('.search-button').click(function () {
        search();
    });

    //  STORE FILE
    $('.store-button').click(function () {
        if ($('#file-name').val() === '') {
            alert('Nhập tên file');
            return;
        }
        if ($('#format').val() === 'PDF') {//   GENERATE PDF FILE
            html2canvas($('.form-detail'), {
                onrendered: function (canvas) {
                    var img = canvas.toDataURL("image/jpg");
                    var doc = new jsPDF('p', 'pt', 'a4');
                    doc.addImage(img, 'JPEG', 20, 20);

                    var string = doc.output('blob');

                    $.ajax({
                        method: 'POST',
                        url: '/store',
                        data: {
                            name: $('#file-name').val(),
                            formId: currentFormId,
                            profId: currentProfId,
                            content: $('.form-detail').html()
                        },
                        success: function () {
                            alert('Lưu trữ thành công');
                        }
                    });
                }
            })

        }
        else {
            $('.form-detail').wordExport($('#file-name').val());
        }

        $('#file-name').text() = "";
    })

});