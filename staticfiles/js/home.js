    $("#searchBox").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".app-card").filter(function() {
            $(this).toggle($(this).find('h6').text().toLowerCase().indexOf(value) > -1)
        });
    });

