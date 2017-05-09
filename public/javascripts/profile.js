var detail = [];
var currentProfId;

//  RESET PROPERTIES LIST
var resetPropList = function () {
    $('.property-list').find('.prop-item').removeClass('disable');
}

//  CLEAR CONTENT AREA
var clearContent = function () {
    $('.content').find('.pure-form').find('fieldset').find('.pure-control-group').remove();
}



//  DISPLAY THE PROPERTIES FROM SERVER
var displayProperties = function (props) {
    props.forEach(function (prop) {
        $.ajax({
            method: 'GET',
            url: '/admin/field/json/' + prop.fieldId,
            success: function (field) {

                // DISBLE EXISTING PROP
                $('#' + field.sName).addClass('disable');

                // APPEND NEW PROP
                var str = genAppended(field._id, field.sName, field.name);
                var appended = $(str);
                appended.find('input').val(prop.value);
                appended.appendTo($('.content').find('.pure-form').find('fieldset'));
            }
        });
    });
}



//  APPEND PROPERTIES TO CONTENT
var genAppended = function (id, sname, text) {
    // STRING REPRESETING THE APPENDED ELEMENT
    var str = '';
    str += '<div id="div-' + sname + '" class="pure-control-group">';
    str += '<label>';
    str += text;
    str += '</label>';
    str += '<input data-id="' + id + '" id="' + sname + '">';
    str += '</input>';
    str += '</div>';

    return str;
}

//  GATHER ALL PROPERTIES
var gatherProps = function () {
    // CLEAR DETAIL ARRAY
    detail = [];

    $('.content').find('.pure-form').find('fieldset').children('.pure-control-group').each(function () {
        var input = $(this).find('input');
        var temp = {
            fieldId: input.data('id'),
            value: input.val()
        }
        detail.push(temp);
    });

    sendDetail();
}

//  SEND DETAIL TO SERVER
var sendDetail = function () {
    $.ajax({
        method: 'PUT',
        data: {
            profId: currentProfId,
            profName: $('.info').text(),
            detail: JSON.stringify(detail)
        },
        statusCode: {
            204: function () {
                alert('Cập nhật thành công');
                window.location.reload();
            },
            400: function () {
                alert('Cập nhật lỗi');
            }
        }

    });
}

//  DISPLAY BUTTONS
var displayButtons=function(){
    $('.save-button').css('visibility',"visible");
    $('.cancel-button').css('visibility',"visible");
}


$(document).ready(function () {

    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    
    // DISPLAY CURRENT PROFILE
    if (currentProfId) {

    }
    //  ADD NEW PROFILE
    $('.add-button').click(function () {
        var name = $('#profile-name').val();
        if (!name) {
            alert('Nhập tên profile');
            return;
        }

        $.ajax({
            method: "POST",
            url: '/profile',
            data: {
                profName: $('#profile-name').val()
            },
            statusCode: {
                204: function () {
                    alert('Thêm thành công');
                    window.location.reload();
                },
                400: function () {
                    alert('Tên profile đã sử dụng');
                }
            }
        });
    });

    // CLICK ON THE PROP ITEM
    $('.prop-item').click(function () {
        if (!currentProfId) {// IF USER HAS NOT CHOSEN A PROFILE
            alert('Chọn một profile để cập nhật trường dữ liệu');
            return;
        }

        if ($(this).hasClass('disable')) {// IF THIS PROP IS ALREADY IN USE
            $('.content').find('#div-' + $(this).data('sname')).remove();
            $(this).removeClass('disable');
        }
        else {
            // APPEND TO THE CONTENT
            var appended = $(genAppended($(this).data('id'), $(this).data('sname'), $(this).find('a').text()));
            appended.appendTo($('.content').find('.pure-form').find('fieldset'));

            // DISABLE THIS ELEMENT
            $(this).addClass("disable");
        }

        displayButtons();
    });

    //  SELECT A PROFILE
    $('.prof-item').click(function () {
        var profName = $(this).find('a').text();
        currentProfId = $(this).find('a').data('id');
        //  RESET PROPERTIES LIST
        resetPropList();

        //  CLEAT CONTENT
        clearContent();

        // MAKE DELETE BUTTON APPEARED
        $('.delete-button').css('visibility', 'visible');

        //  DISPLAY PROFILE NAME
        $('.pro-name').text(profName);

        //  GET PROFILE FROM SERVER
        $.ajax({
            method: 'GET',
            url: '/profile/' + currentProfId,
            success: function (prof) {
                displayProperties(prof.detail);
            }
        });


    });

    //  SAVE PROFILE
    $('.save-button').click(function () {
        gatherProps();
    });
    //  CANCEL ALL CHANGES
    $('.cancel-button').click(function () {

    });

    //  DELETE PROFILE
    $('.delete-button').click(function () {
        var cf = confirm('Bạn chắc muốn xóa profile này?');
        if (cf == true) {
            $.ajax({
                method: 'DELETE',
                url: '/profile/' + currentProfId,
                statusCode: {
                    204: function () {
                        alert('Xóa thành công');
                        window.location.reload();
                    },
                    400: function () {
                        alert('Xóa lỗi');
                    }
                }
            });
        }
    });

    //  CHANGE PROFILE NAME
    $('.info').on('keypress',function(){
        displayButtons();
    });
});