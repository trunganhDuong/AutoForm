

$(document).ready(function(){
     // LOG IN
     $('.login-button').click(function(){
         if($('#email').val()===""){
             alert('Nhập email');
             return;
         }
         if($('#username').val()===""){
             alert('Nhập username');
             return;
         }
         if($('#password').val()===""){
             alert('Nhập password');
             return;
         }
     });
});