$(document).ready(()=>{
    $(".container").hide();
    $("#admin_login").modal("show");
    $("#admin_auth").on("click", ()=>{
        validateAdmin();
    });   
});

function setMemberImage() {
    var filesSelected = document.getElementById("memberImage").files;
    if (filesSelected.length > 0)
    {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent)
        {
            window.member_image = fileLoadedEvent.target.result;

        };

        fileReader.readAsDataURL(fileToLoad);
    }
}

function validateAdmin(){
    if($("#user_name").val() == ""){
        alert("Please enter user name!");
        return;
    };
    if($("#password").val() == ""){
        alert("Please enter password!");
        return;
    };
    if($("#user_name").val() == "admin" && $("#password").val() == "user_password"){    
        $("#admin_login").modal("hide");
        $(".container").show();
        $("#addMember").on("click", ()=>{
            memberManage();
        });
    
        $("#team_members").dataTable();   
        getMembers();
    } else{
        alert("Invalid credentials");
    }
}
function memberManage(){
    if($("#addMember").text() == "Save Changes"){
        var change = false;
        if($("#name").val() != window.edit_details["name"]){
            change = true;
        }
        if($("#designation").val() != window.edit_details["designation"]){
            change = true;
        }
        if($("#brief").val() != window.edit_details["brief"]){
            change = true;
        }
        if($("#team").val() != window.edit_details["team"]){
            change = true;
        }
        if(change){
            firebase.database().ref("members_new/"+window.edit_details["id"]).update({ 
                member_name: $("#name").val(),
                member_designation : $("#designation").val(),
                member_brief  : $("#brief").val(),
                member_team : $("#team").val()       
            });
            $("#member_details").trigger("reset");
            $("#addMember").text("Save");
            alert("Changes added successfully!");
            getMembers();
        }else{
            alert("No changes to be made");
        }
    } else{
        var success = true;
        if($("#name").val() ==  "" || $("#designation").val() ==  "" || $("#brief").val() ==  "" || $("#name").val().trim() ==  "" || $("#designation").val().trim() ==  "" || $("#brief").val().trim() ==  ""){
            success = false;
            alert("Please fill all fields!");
        }
        if(window.member_image == undefined){
            success = false;
            alert("Please select member's image!"); 
        }
        if(success){            
            $("#addMember").prop("disabled", "true");
            firebase.database().ref().child('members_new').push().set({
                member_name : $("#name").val(),
                member_designation : $("#designation").val(),
                member_brief : $("#brief").val(),
                member_team : $("#team").val(),
                member_image : window.member_image
            });

            $("#member_details").trigger("reset");
            $("#addMember").removeAttr("disabled");
            alert("Team member added successfully!");
            getMembers();
        }
    }
}

function getMembers(){
    var teamA_members = [];
    var teamB_members = [];
    firebase.database().ref('members_new').on('child_added',(snapshot) => {
        if(snapshot.val().member_team == "teamA"){
            teamA_members.push({key: snapshot.key, val:snapshot.val()});
        } else{
            teamB_members.push({key: snapshot.key, val:snapshot.val()});
        }
    });
    setTimeout(function(){
        listMembers(teamA_members, teamB_members);
    }, 5000);
}


function listMembers(a_members, b_members){
    var data = [];
        for(let i=0; i<a_members.length; i++){
            data.push(a_members[i]);
        }
        for(let i=0; i<b_members.length; i++){
            data.push(b_members[i]);
        }
        
        var table =  $("#team_members").DataTable();
        var loop = data.length;
        table.clear();
        table.destroy();
        var edit_button = "<select onChange='edit_member(this)'><option>Choose an option</option><option value='edit'>Edit</option><option value='delete'>Delete</option></select>";
        if(loop > 0){
            for(let i=0; i<loop; i++){
                var s = i+1;
                var item = "<tr><td>"+s+"</td><td style='display:none'>"+data[i]["key"]+"</td><td>"+data[i]["val"]["member_name"]+"</td><td>"+data[i]["val"]["member_designation"]+"</td><td>"+data[i]["val"]["member_brief"]+"</td><td>"+data[i]["val"]["member_team"]+"</td><td>"+edit_button+"</td></tr>";
                $("#team_members tbody").append(item);
            }
        }
        $("#team_members").DataTable();    
}

function edit_member(self){
    var asd = self.parentElement;
    var row = asd.parentElement;
    if($(self).val() == "edit") {
        window.edit_details = {
            id : $(row).find("td").eq(1).html(),
            name : $(row).find("td").eq(2).html(),
            designation : $(row).find("td").eq(3).html(),
            brief : $(row).find("td").eq(4).html(),
            team : $(row).find("td").eq(5).html()
        }
        $("#name").val(window.edit_details["name"]);
        $("#designation").val(window.edit_details["designation"]);
        $("#brief").val(window.edit_details["brief"]);
        $("#team").val(window.edit_details["team"]);
        $("#addMember").text("Save Changes");
        $('html, body').animate({
            scrollTop: $("#scrollHere").offset().top}, 1000);
    } else if($(self).val() == "delete"){
            if(confirm("Are you sure?")){
            var id = $(row).find("td").eq(1).html();
            firebase.database().ref("members_new/"+id).remove();
            getMembers();
        } else{
            return;
        }
    }
}