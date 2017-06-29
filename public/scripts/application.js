function ShowHideContent() {
    console.log('ShowHideContent');
}


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


    // Example - Form focus styles

    if ($('.form').length > 0) {

        // $(".block-label").each(function () {

        //     // Add focus
        //     $(".block-label input").focus(function () {
        //         $("label[for='" + this.id + "']").addClass("add-focus");
        //     }).blur(function () {
        //         $("label").removeClass("add-focus");
        //     });

        //     // Add selected class
        //     $('input:checked').parent().addClass('selected');

        // });

        // Add/remove selected class
        $('.block-label').find('input[type=radio], input[type=checkbox]').click(function () {

console.log ('Hello world');

            $('input:not(:checked)').parent().removeClass('selected');
            $('input:checked').parent().addClass('selected');

            $('.toggle-content').hide();

            var target = $('input:checked').parent().attr('data-target');
            var $target = $('#' + target);

            $target.show();
            $target.attr('aria-expanded', true);

            if ($('input:checked').val() === 'uk') {
                var target = $('input[value=os]').parent().attr('data-target');
                var $target = $('#' + target);
                var $countryCodeDisplay = $('.js-country-code');
                var $typeAheadInput = $('.country-autocomplete');

                $target.hide();
                $target.attr('aria-expanded', false);
                $countryCodeDisplay.text('+44');
                $typeAheadInput.val("");
            }

        });


        // For pre-checked inputs, show toggled content
        var target = $('input:checked').parent().attr('data-target');
        $('#' + target).show();

    }
    
});

