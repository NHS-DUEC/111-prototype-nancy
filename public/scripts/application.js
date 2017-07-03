
$(document).ready(function () {

    // visibility toggle
    (function ($) {
        $.fn.invisible = function () {
            return this.css("visibility", "hidden");
        };
        $.fn.visible = function () {
            return this.css("visibility", "visible");
        };
    })(jQuery);


    if ($('.form-group').length > 0) {

        // Add/remove selected class
        $('.block-label').find('input[type=radio], input[type=checkbox]').click(function () {

            $('input:not(:checked)').parent().removeClass('selected');
            $('input:checked').parent().addClass('selected');

            $('.toggle-content').hide();

            var target = $('input:checked').parent().attr('data-target');
            var $target = $('#' + target);

            $target.show();
            $target.attr('aria-expanded', true);


        });

        // For pre-checked inputs, show toggled content
        var target = $('input:checked').parent().attr('data-target');
        $('#' + target).show();

    }
    
});

