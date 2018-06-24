$(document).ready(()=>{    
    
    getMembers();
});

function getMembers(){
    var teamA_members = [];
    var teamB_members = [];
    firebase.database().ref('members_new').on('child_added',(snapshot) => {
        if(snapshot.val().member_team == "Team A"){
            teamA_members.push({key: snapshot.key, val:snapshot.val()});
        } else{
            teamB_members.push({key: snapshot.key, val:snapshot.val()});
        }
    });
    setTimeout(function(){
        console.log(teamA_members);
        setCardsTeamA(teamA_members);
        setCardsTeamB(teamB_members);
    }, 5000);
    
}

function setCardsTeamA(a_members){
    var len = a_members.length;
    console.log(len);
    for(let i=0; i<len; i++){
        var items = '<div class="item"><div class="card" style="width: 18rem;"><img class="card-img-top" src='+a_members[i]["val"]["member_image"]+' alt="Card image cap"><div class="card-body"><h5 class="card-title">'+a_members[i]["val"]["member_name"]+'</h5><h6 class="card-subtitle mb-2 text-muted">'+a_members[i]["val"]["member_designation"]+','+a_members[i]["val"]["member_team"]+'</h6><p class="card-text">'+a_members[i]["val"]["member_brief"]+'</p></div></div></div>';
        $("#teamA").append(items);
    }
    $(".owl-carousel").owlCarousel({
        loop:true,
        responsiveClass:true,
        autoPlay : 3000,
        dots : true,
        nav : true
    });
    $(".owl-prev").css("width", "2%");
    $(".owl-next").css("width", "2%");
}

function setCardsTeamB(b_members){    
    var len = b_members.length;
    console.log(len);
    for(let i=0; i<len; i++){
        var items = '<div class="item"><div class="card" style="width: 18rem;"><img class="card-img-top" src='+b_members[i]["val"]["member_image"]+' alt="Card image cap"><div class="card-body"><h5 class="card-title">'+b_members[i]["val"]["member_name"]+'</h5><h6 class="card-subtitle mb-2 text-muted">'+b_members[i]["val"]["member_designation"]+','+b_members[i]["val"]["member_team"]+'</h6><p class="card-text">'+b_members[i]["val"]["member_brief"]+'</p></div></div></div>';
        $("#teamB").append(items);
    }
    $(".owl-carousel").owlCarousel({
        loop:true,
        autoPlay : 3000,
        dots : true,
        nav : true
    });
    $(".owl-prev").css("width", "2%");
    $(".owl-next").css("width", "2%");
}
