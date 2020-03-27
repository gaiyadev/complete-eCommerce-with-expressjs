
$(document).on('click', '#edit-user', function () {
     let id = $(this).attr('data-id');
     let first_name = $(this).attr('data-firstName');
     let last_name = $(this).attr('data-lastName');
     let username = $(this).attr('data-username');
     let email = $(this).attr('data-email');
     let role = $(this).attr('data-role');
     $('#id').val(id);
     $('#firstname').val(first_name);
     $('#lastname').val(last_name);
     $('#username').val(username);
     $('#useremail').val(email); role
     $('#role').val(email);
});


