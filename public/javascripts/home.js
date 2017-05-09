var currentFormId;

// DISPLAY FORM CONTENT
var displayForm = function (text) {
    $('.form-detail').html("");
    $('.form-detail').html(text);
}

// DISPLAY FILL BUTTON
var displayFillButton = function () {
    $('.fill-button').css('visibility', 'visible');
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

// GET ALL ORGANIZATION OF A DISTRICT
var getOrganization = function (distId) {
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

// DOCUMENT READY
$(document).ready(function () {
    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    //  GET DISTRICT CITY WHEN DOUCUMENT IS READY
    getDistrict();

    // EXPAND SEARCH HEADER
    $('.search-header').click(function () {
        $('.search-content').slideToggle();
    });

    //  SELECT A FORM
    $('.form-item').click(function () {
        $.ajax({
            method: 'GET',
            url: '/admin/form/' + $(this).find('a').data('id'),
            success: function (form) {
                displayForm(form);
                displayFillButton();
            }
        });
    });



    // GET DISTRICT WHEN SELECT CITY
    $('#city').on('change', function () {
        getDistrict();
    });

    // GET ORGS WHEN SELECT DISTRICT
    $('#district').on('change', function () {
        var distId = $(this).find(':selected').data('id');
        getOrganization(distId);
    })

});