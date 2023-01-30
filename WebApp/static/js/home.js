//When user starts typing in the search box, this function is called. This returns the application template cards matching the text typed in the search box.
$("#searchBox").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    $(".app-card").filter(function () {
        $(this).toggle($(this).find('h6').text().toLowerCase().indexOf(value) > -1);
    });
});

