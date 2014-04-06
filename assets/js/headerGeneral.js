$(document).ready(function(){ 
        $.get("../../headerGeneral.html", function(data) {
                $("#headerGeneral").html(data);
        });
}); 