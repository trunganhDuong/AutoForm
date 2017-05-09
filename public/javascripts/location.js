var currentCityId;


//  GET DIST OF CURRENT CITY
var getDists = function () {
    $.ajax({
        method: 'GET',
        url: '/admin/location/city/' + currentCityId,
        success: function (city) {
            currentCityId = city._id;
            // CITY
            $('#city-name-info').val(city.name);
            $('#of-city').val(city.name);

            // DISTRICTS
            displayDists(city.districts);
        }
    });
}

// DISPLAY DISTS ON DISTRICT LIST
var displayDists = function (dists) {
    var i = 1;
    $('.district-list').find('tbody').empty();
    dists.forEach(function (item) {
        var appended = $('<tr>' +
            '<td>' + (i++) + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.creTime + '</td>' +
            '<td>' +
            '<button type="button" class="pure-button pure-button-primary district-update-button" data-id=' + item._id + '>Cập nhật</button> &nbsp;' +
            '<button type="button" class="pure-button district-delete-button button-error" data-id=' + item._id + '>Xóa</button>' +
            '</td>' +
            '</tr>');

        //  UPDATE DISTRICT
        appended.find('.district-update-button').click(function () {
            var newName = prompt("Nhập tên mới", "Quận ");
            if (!newName) return;
            $.ajax({
                method: 'PUT',
                url: '/admin/location/district',
                data: {
                    distId: $(this).data('id'),
                    distName: newName
                },
                statusCode: {
                    204: function () {
                        alert('Cập nhật thành công');
                        getDists();
                    },
                    400: function () {
                        alert('Thông tin đã tồn tại');
                    }
                }

            });
        });
        //  DELETE DIST
        appended.find('.district-delete-button').click(function () {
            var id = $(this).data('id');
            var cf = confirm('Bạn có chắc muốn xóa?');
            if (cf == true) {
                $.ajax({
                    method: 'DELETE',
                    url: '/admin/location/district/' + currentCityId + '/' + $(this).data('id'),
                    statusCode: {
                        204: function () {
                            alert('Bạn vừa xóa mã: ' + id);
                            getDists();
                        }
                    }
                });
            }

        });

        appended.appendTo($('.district-list').find('tbody'));
    });
}

// GET ALL DISTS OF A CITY
var getDistsIn = function (city) {
    $.ajax({
        method: 'GET',
        url: '/admin/location/city/name/' + city,
        success: function (city) {
            currentCityId = city._id;
            // CITY
            $('#city-name-info').val(city.name);
            $('#of-city').val(city.name);
            // DISTRICTS
            displayDists(city.districts);
        }
    });
}

$(document).ready(function () {
    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });
    //  ADD CITY
    $('.city-add-button').click(function () {
        if ($('#city-name').val() === "") {
            alert('Tên thành phố không được trống');
            return;
        }
        $.ajax({
            method: "POST",
            data: {
                for: "city",
                name: $('#city-name').val()
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
    });

    // ADD DISTRICT
    $('.district-add-button').click(function () {
        if ($('#district-name').val() === "") {
            alert('Tên quận/huyện không được trống');
            return;
        }
        if ($('#of-city').val() === "") {
            alert('Chọn thành phố');
            return;
        }
        $.ajax({
            method: "POST",
            data: {
                for: 'district',
                name: $('#district-name').val(),
                city: $('#of-city').val()
            },
            statusCode: {
                204: function () {
                    alert('Thêm thành công ');
                    getDists();
                },
                400: function () {
                    alert('Thông tin đã tồn tại');
                }
            }
        });


    });

    // SELECT A CITY
    $('.city-item').click(function () {
        currentCityId = $(this).data('id');
        getDists();
    })

    // DELETE A CITY
    $('.delete-button').click(function () {
        if (!currentCityId) {
            alert('Chọn một thành phố để xóa');
            return;
        }
        var cf = confirm('Bạn có chắc muốn xóa?');
        if (cf == true) {
            $.ajax({
                method: 'DELETE',
                url: '/admin/location/' + currentCityId,
                statusCode: {
                    204: function () {
                        alert('Bạn vừa xóa thành phố có mã ') + currentCityId;
                        window.location.reload();
                    }
                }
            });
        }

    });

    // SELECT CITY FROM THE DROP-DOWN
    $('#of-city').on('change', function () {
        getDistsIn($(this).val());
    })
});