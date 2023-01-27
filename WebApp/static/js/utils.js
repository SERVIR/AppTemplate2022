function ajax_call(ajax_url, ajax_data) {
    if (ajax_url.substr(-1) !== "/") {
        ajax_url = ajax_url.concat("/");
    }
    const csrftoken = getCookie('csrftoken');
    //update database
    var xhr = $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
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

function set_parent(control, element) {
    var htmlObject = control.getContainer();
    var newParent = document.getElementById(element);
    newParent.appendChild(htmlObject);
}

/**
 * Checks to see if the cookie is set
 * @param name
 * @returns {null}
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
