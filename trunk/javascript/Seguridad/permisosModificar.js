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

function cambiosCheckbox(){

	//publicaciones
	$("#pub-all-cb").change(function(e) {
		if(this.checked) {
		    $("#pub-ver-cb").prop("checked",true); $("#pub-mod-cb").prop("checked",true);
		    $("#pub-del-cb").prop("checked",true); $("#pub-list-cb").prop("checked",true);
		    $("#pub-reg-cb").prop("checked",true); $("#pub-all-cb").val('off');
		}
		else{
			$("#pub-ver-cb").prop('checked',false); $("#pub-mod-cb").prop('checked',false);
		    $("#pub-del-cb").prop('checked',false); $("#pub-list-cb").prop('checked',false);
		    $("#pub-reg-cb").prop('checked',false); $("#pub-all-cb").val('on');
		}
	});
	//$("#pub-ver-cb").change(function() { if(this.checked) $("#pub-list-cb").prop("checked",true);});
	//$("#pub-mod-cb").change(function() { if(this.checked) $("#pub-list-cb").prop("checked",true);});
	//$("#pub-del-cb").change(function() { if(this.checked) $("#pub-list-cb").prop("checked",true);});

	//fichas
	$("#fib-all-cb").change(function(e) {
		if(this.checked) {
		    $("#fib-ver-cb").prop("checked",true); $("#fib-mod-cb").prop("checked",true);
		    $("#fib-del-cb").prop("checked",true); $("#fib-list-cb").prop("checked",true);
		    $("#fib-reg-cb").prop("checked",true); $("#fib-all-cb").val('off');
		}
		else{
			$("#fib-ver-cb").prop('checked',false); $("#fib-mod-cb").prop('checked',false);
		    $("#fib-del-cb").prop('checked',false); $("#fib-list-cb").prop('checked',false);
		    $("#fib-reg-cb").prop('checked',false); $("#fib-all-cb").val('on');
		}
	});
	// $("#fib-ver-cb").change(function() { if(this.checked) $("#fib-list-cb").prop("checked",true);});
	// $("#fib-mod-cb").change(function() { if(this.checked) $("#fib-list-cb").prop("checked",true);});
	// $("#fib-del-cb").change(function() { if(this.checked) $("#fib-list-cb").prop("checked",true);});

	//Usuarios
	$("#usr-all-cb").change(function(e) {
	    if(this.checked) {
		    $("#usr-ver-cb").prop("checked",true); $("#usr-mod-cb").prop("checked",true);
		    $("#usr-del-cb").prop("checked",true); $("#usr-list-cb").prop("checked",true);
		    $("#usr-reg-cb").prop("checked",true); $("#usr-all-cb").val('off');
		}
		else{
			$("#usr-ver-cb").prop('checked',false); $("#usr-mod-cb").prop('checked',false);
		    $("#usr-del-cb").prop('checked',false); $("#usr-list-cb").prop('checked',false);
		    $("#usr-reg-cb").prop('checked',false); $("#usr-all-cb").val('on');
		}
	});
	//$("#usr-ver-cb").change(function() { if(this.checked) $("#usr-list-cb").prop("checked",true);});
	//$("#usr-mod-cb").change(function() { if(this.checked) $("#usr-list-cb").prop("checked",true);});
	//$("#usr-del-cb").change(function() { if(this.checked) $("#usr-list-cb").prop("checked",true);});

	//Grupos
	$("#grp-all-cb").change(function(e) {
	    if(this.checked) {
		    $("#grp-ver-cb").prop("checked",true); $("#grp-mod-cb").prop("checked",true);
		    $("#grp-del-cb").prop("checked",true); $("#grp-list-cb").prop("checked",true);
		    $("#grp-reg-cb").prop("checked",true); $("#grp-all-cb").val('off');
		}
		else{
			$("#grp-ver-cb").prop('checked',false); $("#grp-mod-cb").prop('checked',false);
		    $("#grp-del-cb").prop('checked',false); $("#grp-list-cb").prop('checked',false);
		    $("#grp-reg-cb").prop('checked',false); $("#grp-all-cb").val('on');
		}
	});
	// $("#grp-ver-cb").change(function() { if(this.checked) $("#grp-list-cb").prop("checked",true);});
	// $("#grp-mod-cb").change(function() { if(this.checked) $("#grp-list-cb").prop("checked",true);});
	// $("#grp-del-cb").change(function() { if(this.checked) $("#grp-list-cb").prop("checked",true);});

	//Autores
	$("#aut-all-cb").change(function(e) {
	    if(this.checked) {
		    $("#aut-mod-cb").prop("checked",true);
		    $("#aut-del-cb").prop("checked",true); $("#aut-list-cb").prop("checked",true);
		    $("#aut-reg-cb").prop("checked",true); $("#aut-all-cb").val('off');
		}
		else{
			$("#aut-mod-cb").prop('checked',false);
		    $("#aut-del-cb").prop('checked',false); $("#aut-list-cb").prop('checked',false);
		    $("#aut-reg-cb").prop('checked',false); $("#aut-all-cb").val('on');
		}
	});
	//$("#aut-mod-cb").change(function() { if(this.checked) $("#aut-list-cb").prop("checked",true);});
	//s$("#aut-del-cb").change(function() { if(this.checked) $("#aut-list-cb").prop("checked",true);});

	//Idiomas
	$("#idi-all-cb").change(function(e) {
	    if(this.checked) {
		    $("#idi-mod-cb").prop("checked",true);
		    $("#idi-del-cb").prop("checked",true); $("#idi-list-cb").prop("checked",true);
		    $("#idi-reg-cb").prop("checked",true); $("#idi-all-cb").val('off');
		}
		else{
			$("#idi-mod-cb").prop('checked',false);
		    $("#idi-del-cb").prop('checked',false); $("#idi-list-cb").prop('checked',false);
		    $("#idi-reg-cb").prop('checked',false); $("#idi-all-cb").val('on');
		}
	});	
	$("#idi-mod-cb").change(function() { if(this.checked) $("#idi-list-cb").prop("checked",true);});
	$("#idi-del-cb").change(function() { if(this.checked) $("#idi-list-cb").prop("checked",true);});

	//Etiquetas
	$("#eti-all-cb").change(function(e) {
	    if(this.checked) {
		    $("#eti-mod-cb").prop("checked",true);
		    $("#eti-del-cb").prop("checked",true); $("#eti-list-cb").prop("checked",true);
		    $("#eti-reg-cb").prop("checked",true); $("#eti-all-cb").val('off');
		}
		else{
			$("#eti-mod-cb").prop('checked',false);
		    $("#eti-del-cb").prop('checked',false); $("#eti-list-cb").prop('checked',false);
		    $("#eti-reg-cb").prop('checked',false); $("#eti-all-cb").val('on');
		}
	});
	//$("#eti-mod-cb").change(function() { if(this.checked) $("#eti-list-cb").prop("checked",true);});
	//$("#eti-del-cb").change(function() { if(this.checked) $("#eti-list-cb").prop("checked",true);});

	//Maestros
	$("#mtr-all-cb").change(function(e) {
		if(this.checked) {
			$("#mtr-all-cb").val('off');
		    $("#mtr-pub-mod-cb").prop("checked",true);
		    $("#mtr-pub-del-cb").prop("checked",true); $("#mtr-pub-ver-cb").prop("checked",true);
		    $("#mtr-pub-reg-cb").prop("checked",true); 
		    $("#mtr-fib-mod-cb").prop("checked",true);
		    $("#mtr-fib-del-cb").prop("checked",true); $("#mtr-fib-ver-cb").prop("checked",true);
		    $("#mtr-fib-reg-cb").prop("checked",true); 
		    $("#mtr-inst-mod-cb").prop("checked",true);
		    $("#mtr-inst-del-cb").prop("checked",true); $("#mtr-inst-ver-cb").prop("checked",true);
		    $("#mtr-inst-reg-cb").prop("checked",true); 
		}
		else{
			$("#mtr-all-cb").val('on');
			$("#mtr-pub-mod-cb").prop('checked',false);
		    $("#mtr-pub-del-cb").prop('checked',false); $("#mtr-pub-ver-cb").prop('checked',false);
		    $("#mtr-pub-reg-cb").prop('checked',false);  
		    $("#mtr-fib-mod-cb").prop("checked",false);
		    $("#mtr-fib-del-cb").prop("checked",false); $("#mtr-fib-ver-cb").prop("checked",false);
		    $("#mtr-fib-reg-cb").prop("checked",false); 
		    $("#mtr-inst-mod-cb").prop("checked",false);
		    $("#mtr-inst-del-cb").prop("checked",false); $("#mtr-inst-ver-cb").prop("checked",false);
		    $("#mtr-inst-reg-cb").prop("checked",false);
		}
	});
	//$("#mtr-pub-mod-cb").change(function() { if(this.checked) $("#mtr-pub-ver-cb").prop("checked",true);});
	//$("#mtr-pub-del-cb").change(function() { if(this.checked) $("#mtr-pub-ver-cb").prop("checked",true);});
	//$("#mtr-fib-mod-cb").change(function() { if(this.checked) $("#mtr-fib-ver-cb").prop("checked",true);});
	//$("#mtr-fib-del-cb").change(function() { if(this.checked) $("#mtr-fib-ver-cb").prop("checked",true);});
	//$("#mtr-inst-mod-cb").change(function() { if(this.checked) $("#mtr-inst-ver-cb").prop("checked",true);});
	//$("#mtr-inst-del-cb").change(function() { if(this.checked) $("#mtr-inst-ver-cb").prop("checked",true);});

	//Generar Enlace
	$("#enl-all-cb").change(function(e) {
	    if(this.checked) {
		    $("#enl-mod-cb").prop("checked",true); $("#enl-ver-cb").prop("checked",true);
		    $("#enl-del-cb").prop("checked",true); $("#enl-list-cb").prop("checked",true);
		    $("#enl-reg-cb").prop("checked",true); $("#enl-all-cb").val('off');
		}
		else{
			$("#enl-mod-cb").prop('checked',false); $("#enl-ver-cb").prop('checked',false);
		    $("#enl-del-cb").prop('checked',false); $("#enl-list-cb").prop('checked',false);
		    $("#enl-reg-cb").prop('checked',false); $("#enl-all-cb").val('on');
		}
	});
	//$("#enl-ver-cb").change(function() { if(this.checked) $("#enl-list-cb").prop("checked",true);});
	//$("#enl-mod-cb").change(function() { if(this.checked) $("#enl-list-cb").prop("checked",true);});
	//$("#enl-del-cb").change(function() { if(this.checked) $("#enl-list-cb").prop("checked",true);});

	//Permisos
	$("#per-all-cb").change(function(e) {
	   if(this.checked) {
		    $("#per-mod-cb").prop("checked",true); $("#per-ver-cb").prop("checked",true);
		    $("#per-del-cb").prop("checked",true); $("#per-list-cb").prop("checked",true);
		    $("#per-reg-cb").prop("checked",true); $("#per-all-cb").val('off');
		}
		else{
			$("#per-mod-cb").prop('checked',false); $("#per-ver-cb").prop('checked',false);
		    $("#per-del-cb").prop('checked',false); $("#per-list-cb").prop('checked',false);
		    $("#per-reg-cb").prop('checked',false); $("#per-all-cb").val('on');
		}
	});
	//$("#per-ver-cb").change(function() { if(this.checked) $("#per-list-cb").prop("checked",true);});
	//$("#per-mod-cb").change(function() { if(this.checked) $("#per-list-cb").prop("checked",true);});
	//$("#per-del-cb").change(function() { if(this.checked) $("#per-list-cb").prop("checked",true);});
	
}

function armarPermisos(){
	var padre=[];
	var n1,n2,n3,input,checked;
	$("li.dd-item").each(function(index){
		n2=[];
		$("li.dd-item-list",this).each(function(index){
			input=$(this).find("input").first();
			if(input.prop("checked")) checked="true"; else checked="";
			n3={ id: $(this).attr("data-id"),
				 checked: checked
			}
			n2.push(n3);
		});
		if(n2.length!=0){
			n1={ id:$(this).attr("data-id"),
				 children:n2
				}
			padre.push(n1);
		}
	});
	return padre;
}

function guardarCambios(){

	var answer = confirm("Desea modificar los datos del perfil ?")
	if (answer){
		var obj={
			IDPERMISO: idper,
			NOMBRE: $('#NOMBRE').val(),
			DESCRIPCION: $('#DESCRIPCION').val(),
			PERMISOS: armarPermisos()
		};

		if(!validarPermiso()) return;

		$.ajax({
			type: 'POST',
		    url:'../../api/SE_modificarPermiso',
		    dataType: "json",
		    contentType: "application/json; charset=utf-8",
		    data: JSON.stringify(obj),
		    success: function(data) {
		    	if(data["status"]=1){
		    		alert("El permiso fue modificado Correctamente");
		    		$(location).attr('href',"viewListaPerfiles.html");
		    	}
		    }
		});
	}
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
	cambiosCheckbox();
	$("#guardar").click(guardarCambios);

});