

$(document).ready(function () {

    //  DISPLAY MODAL
    $('.change').click(function(){
        $('.change-modal').css('display','block');
    })
    //  HIDE THE MODAL
    $('.cancel-button').click(function(){
        $('#newPassword').val('');
        $('#oldPassword').val('');
        $('.change-modal').css('display','none');
    });

    //  CHANGE PASSWORD
    $('.change-button').click(function(){
        if($('#password').val()===''){
            alert('Không thay đổi mật khẩu facebook/google');
            return;
        }
        if($('#oldPassword').val()===''){
            alert('Nhập mật khẩu cũ');
            return;
        }
        if($('#newPassword').val()===''){
            alert('Nhập mật khẩu mới');
            return;
        }

        if($('#confirmPassword').val()===''){
            alert('Xác nhận mật khẩu');
            return;
        }
        if($('#newPassword').val()!==$('#confirmPassword').val()){
            alert('Xác nhận mật khẩu không khớp');
            return;
        }
        $.ajax({
            method:'PUT',
            data:{
                old:$('#oldPassword').val(),
                new:$('#newPassword').val()
            },
            statusCode:{
                204:function(){
                    alert('Thay đổi thành công');
                    window.location.replace('/logout');
                },
                400:function(){
                    window.location.reload();
                }
            }
        });

    });
});