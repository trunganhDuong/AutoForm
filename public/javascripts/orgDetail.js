var currentCityId;
var currentDistrictId;

//  GET DISTRICT OF SELECTED CITY
var getDist=function(){
    
    $.ajax({
        method:'GET',
        url:'/admin/location/city/'+currentCityId,
        success:function(city){
            displayDists(city.districts);
        }
    });
}

//  DISPLAY DISTS 
var displayDists=function(dists){
    $('#district').find('option').remove(); //  CLEAR DROPDOWN

    dists.forEach(function(dist){
        var slt=(dist._id===currentDistrictId)?"selected":"";
        var str="";

        str+='<option data-id="'+dist._id+'" '+slt+'>';
        str+=dist.name;
        str+='</option>';

        var appended=$(str);
        appended.click(function(){
            currentDistrictId=$(this).data('id');
        });

        appended.appendTo($('#district'));
    })
}


$(document).ready(function () {
    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });

    //  GET DISTS OF SELECTED CITY
    currentCityId=$('#city').find(':selected').data('id');
    currentDistrictId=$('#district').data('id');
    getDist();

    //  SELECT CITY
    $('#city').on('change',function(){
        currentCityId=$(this).find(':selected').data('id');
        getDist();
    })

    //  SELECT DISTRICT
    $('#district').on('change', function () {
        currentDistrictId=$(this).find(':selected').data('id');
    })

    $('.delete-button').click(function () {
        var cf = confirm('Bạn có chắc muốn xóa trường này?');
        if (cf == true) {
            $.ajax({
                method: 'DELETE',
                success: function () {
                    window.location.replace('/admin/organization');
                    alert('Bạn vừa xóa trường có mã: ' + $('#id').val());
                }
            });
        }

    });

    //  UPDATE DISTRICT
    $('.update-button').click(function () {
        if ($('#name').val() === "") {
            alert('Tên tổ chức không được để trống');
            return;
        }
        var cf = confirm('Bạn muốn cập nhật thông tin trường này?');
        if (cf == true) {
            $.ajax({
                method: 'PUT',
                data: {
                    name: $('#name').val(),
                    phone: $('#phone').val(),
                    districtId: currentDistrictId,
                    cityId:currentCityId
                },
                statusCode: {
                    204: function () {
                        alert('Thay đổi thành công ');
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