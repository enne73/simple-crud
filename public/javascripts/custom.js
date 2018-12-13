 (function($) {
   $('*[data-href]').on('click', function() {
     window.location = $(this).data("href");
   });

   $('form').submit(function(e) {
     $("input[type=submit]").prop('disabled', true);
     $.snackbar({
       content: '<i class="fa fa-cog fa-spin fa-fw"></i>&nbsp;operazione in corso',
       timeout: 0,
       htmlAllowed: true
     });
   });
 })(jQuery);
