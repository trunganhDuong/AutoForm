var currentName;

//  GET ALL STORE OF A PROFILE
var getStore = function (profId) {
    $.ajax({
        method: 'GET',
        url: '/store/profile/' + profId,
        success: function (stores) {
            displayStores(stores);
        }
    });
}

//  DISPLAY RECIEVED STORES
var displayStores = function (stores) {
    stores.forEach(function (store) {

        //  APPEND NEW STORE TO THE LIST
        var str = genAppended(store.name, store._id, store.creTime.toString());
        var appended = $(str);

        appended.find('a').click(function () {
            currentName=$(this).text();

            //  DISPLAY EXPORT BUTTON
            $('.export-button').css('visibility', 'visible');

            //  DISPLAY STORE CONTENT
            $.ajax({
                method: 'GET',
                url: '/store/content/' + $(this).data('id'),
                success: function (data) {

                    $('.detail').html(data);
                }
            });
        });
        appended.appendTo($('.list').find('table').find('tbody'));
    });
}

//  GENERATE STRING TO APPEND
var genAppended = function (name, id, date) {
    var str = "";
    str += '<tr>';
    str += '<td>';
    str += '<a class="store-item" data-id="' + id + '">';
    str += name;
    str += '</a>';
    str += '</td>';
    str += '<td>';
    str += date;
    str += '</td>';
    str += '</tr>';
    return str;
}

$(document).ready(function () {
    //  LOADER
    $body = $("body");

    $(document).on({
        ajaxStart: function () { $body.addClass("loading"); },
        ajaxStop: function () { $body.removeClass("loading"); }
    });

    //  SELECT PROFILE
    $('#profile').on('change', function () {
        getStore($(this).find(':selected').data('id'));
    })

    //  EXPORT
    $('.export-button').click(function () {
        html2canvas($('.detail'), {
            onrendered: function (canvas) {
                var img = canvas.toDataURL("image/jpg");
                var doc = new jsPDF('p', 'pt', 'a4');
                doc.addImage(img, 'JPEG', 20, 20);
                doc.save(currentName);
            }
        })
    });
});