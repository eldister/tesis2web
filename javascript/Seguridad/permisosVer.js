var idper=getUrlParameters("idper","",true);

function getUrlParameters(parameter, staticURL, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from 
                 current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
   var currLocation = (staticURL.length)? staticURL : window.location.search,
       parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;            
        }
   }
   
   if(!returnBool) return false;  
}

function llenarInfo(data){
	var input;
	$("li.dd-item-list").each(function(index){
		input=$(this).find("input").first();
		for (var i = 0; i < data.length; i++) {
			if($(this).attr("data-id")==data[i]["IDFUNCIONALIDAD"]){
				input.attr("checked","checked");
				break;
			}
		};
		input.attr("disabled","disabled");
	});
}

function llenarCampos(){

	$.ajax({
		type: 'GET',
	    url:'../../api/SE_getPermiso/'+idper,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	$('#NOMBRE').val(data["NOMBRE"]);
	    	$('#DESCRIPCION').val(data["DESCRIPCION"]);
	    }
	});	
}

function llenarCheckbox(){
	$.ajax({
		type: 'GET',
	    url:'../../api/SE_getFuncionalidadesPermiso/'+idper,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	llenarInfo(data);
	    }
	});
}

function nestableContraerExpandir(){
	$('#nestable-menu').on('click', function(e){
		var target = $(e.target),
			action = target.data('action');
		if (action === 'expand-all') {
			$('.dd').nestable('expandAll');
		}
		if (action === 'collapse-all') {
			$('.dd').nestable('collapseAll');
		}
	});
}

$(document).ready(function(){
	nestableContraerExpandir();
	llenarCampos();
	llenarCheckbox();
});