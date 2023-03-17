
function open_more_info(which){
    const member_img = which.getElementsByTagName("img")[0].src;
    const member_name = which.getElementsByTagName("p")[0].innerHTML.trim();
    const member_title = which.getElementsByClassName("member_title")[0].innerHTML.trim();
    const member_info = which.getElementsByClassName("more_info")[0].innerHTML.trim();

    // create dialog from this
    let dialog = $("#dialog");
    let bio = '<div class="member-wrap">';
    bio += '<div class="member-image">';
    bio += '<img src="' + member_img +'" title="'+ member_name +'" alt="'+ member_name +'">';
    bio += '</div>';
    bio += '<div class="member-details">';
    bio += '<p class="team-name">'+ member_name +'</p>';
    bio += '<p class="team-title">'+ member_title +'</p>';
    bio += '<p class="team-biography">'+ member_info +'</p>';
    bio += '</div></div>';


    $('#teamMemberModalLabel').text("Team Bio");
    $('#teamMemberModal .modal-body').html(bio);

    $('#teamMemberModal').modal('show');
}