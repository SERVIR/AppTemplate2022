function ajax_call(ajax_url, ajax_data) {

    if (ajax_url.substr(-1) !== "/") {
        ajax_url = ajax_url.concat("/");
    }
    //update database
    var xhr = $.ajax({
        type: "POST",
        url: ajax_url,
        dataType: "json",
        data: ajax_data
    });

    xhr.done(function (data) {

        if ("success" in data) {
            //console.log("success");
        } else {
            // console.log(xhr.responseText);
        }
    })
        .fail(function (xhr, status, error) {
            console.log(xhr.responseText);
        });

    return xhr;

}
