$(document).ready(function() {
    $('.toggle_plans').on('click tap', function(e) {
       e.preventDefault();
       
       var vm = $(this),
           target = $('#'+vm.data('toggle')),
           plans = $('.plans-list'),
           header = $('.plan-header'),
           title = vm.html();
           
       vm.addClass('active');
       target.css('display', 'flex');
       header.html(title);
       $('.toggle_plans').not(vm).removeClass('active');
       plans.not(target).css('display', 'none');
    });
});