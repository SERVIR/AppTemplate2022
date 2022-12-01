function test() {
    console.log($('#orgId').val());

        console.log($('#orgName').val());
        let xhr = ajax_call("update-record", {
            'org_id': $('#orgId').val(),
            'org_name': $('#orgName').val(),
        });
        xhr.done(function (result) {
            if(result.updated=="true")
                alert("Updated");
            else alert("Could not udpate the orgnization");
        });

}