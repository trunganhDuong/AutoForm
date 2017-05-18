var currentFormId;
var currentProfId;
var currentFormContent;
var detail = [];

// CONVERT PROFILE DETAIL
var convertProfile = function (profDetail) {
    $.each(profDetail,function(index,item){
        getSname(item['fieldId'],item['value']);
    });
}


//  GET SNAME
var getSname = function (fieldId,value) {
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
var fillOrg=function(){
    $.ajax({
        method:'GET',
        url:'/admin/form/org/id/'+currentFormId,
        success:function(orgId){
            $.ajax({
                method:'GET',
                url:'/admin/organization/json/'+orgId,
                success: function(org){
                    //  FILL ORG NAME
                    currentFormContent=currentFormContent.replace("<!--orgName-->",org.name);
                    displayForm(currentFormContent);
                }
            });
        }
    });
}

//  FILE FORM
var fill = function () {
    detail.forEach(function (item) {
        var old = "<!--" + item['sname'] + "-->";
        currentFormContent = currentFormContent.replace(old, item['value']);
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

//  DOCUMENT READY
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
        var distId = $(this).find(':selected').data('id');
        getOrganization(distId);
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

});