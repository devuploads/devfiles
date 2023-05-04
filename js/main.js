var clipboard = new Clipboard('.copy');

clipboard.on('success', function(e) {
    console.log(e);
});

clipboard.on('error', function(e) {
    console.log(e);
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

$(document).ready(function () {


    var url = window.location.href ,
        isAdmin = url.includes("admin");
    
    if (isAdmin) {
        $('body').addClass('admin-panel');
    }
    
});