var currentOrgId;
var currentCityId;
var currentDistId;

/*// GET ALL ORGS
var getOrgs = function () {
    $.ajax({
        method:'GET',
        url:'/admin/organization/orgs',
        success:function(orgs){
            displayOrgs(orgs);
        }
    });
}
// APPEND ORGS
var displayOrgs = function (orgs) {
    $('.org-list').find('table').find('tbody').empty();
    var i=1;
    orgs.forEach(function(item){
        var str='';
        str+='<tr>';
            str+='<td>';
            str+=(i++);
            str+='</td>';

            str+='<td>';
            str+=(i++);
            str+='</td>';
        str+='</tr>';
        var appended=$();
    });
}*/


//  GET ALL DISTS OF A CITY
var getDists = function (city) {
    $.ajax({
        method: 'GET',
        url: '/admin/location/city/name/' + city,
        success: function (city) {
            $('#district').empty();
            displayDists(city.districts);
        }
    });
}

// APPEND DIST TO THE DROPDOWN
var displayDists = function (dists) {
    $('<option disabled selected>Chọn quận/huyện</option>').appendTo($('#district'));
    dists.forEach(function (dist) {
        var appended = $('<option data-id="'+dist._id+'">'+dist.name+'</option>');
        appended.appendTo($('#district'));
    });
}
$(document).ready(function () {
    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    
    //  ADD ORG
    $('.add-button').click(function () {
        if ($('#name').val() === "") {
            alert("Tên trường không được để trống");
        }
        if ($('#district').val() === "") {
            alert("Quận/huyện không được để trống");
        }
        else {
            $.ajax({
                method: "POST",
                data: {
                    name: $('#name').val(),
                    phone: $('#phone').val(),
                    distId: currentDistId,
                    cityId:currentCityId
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

    //  SELECT CITY
    $('#city').on('change', function () {
        currentCityId=$(this).find(':selected').data('id');
        getDists($(this).val());
    })

    //  SELECT DISTRICT
    $('#district').on('change', function () {
        currentDistId=$(this).find(':selected').data('id');
    })

});