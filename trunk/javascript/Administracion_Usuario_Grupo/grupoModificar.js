
var seleccionResponsable;
var seleccionMiembros;


function getId(){
	if( localStorage.uid ){
	return IDUSUARIO = (localStorage.uid)*1;
	}
	else{
		return IDUSUARIO =1;
	}
}

function getUrlParameters(parameter, staticURL, decode){
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

function modificarGrupo(data){
	
	window.location.href='../administracion_usuario_grupo/viewListaGrupo.html';
	//location.attr('href','../tesis2web/front/administracion_usuario_grupo/viewListaGrupo.html');
}


var test = $('#sel2Multi1');
$(test).change(function() {
    seleccionResponsable = ($(test).select2('data')) ;
    dameResponsable();
});

var test2 = $('#sel2Multi');
$(test2).change(function() {
    seleccionMiembros = ($(test2).select2('data')) ;
    dameMiembros();
});

function dameResponsable(){
	//juntando los json
	
	var data = [];

	for (var i=0; i<seleccionResponsable.length; i++) {
		data.push(seleccionResponsable[i]["id"]);
	}
	
	console.log(data);
	console.log(JSON.stringify(data));
	return data;
}

function dameMiembros(){
	//juntando los json
	var data = [];

	for (var i=0; i<seleccionMiembros.length; i++) {
		data.push(seleccionMiembros[i]["id"]);
	}
	
	console.log(data);
	console.log(JSON.stringify(data));
	return data;
}


function guardarCambios(){
	var data = $(".form-control");
	var IDUSUARIO=getId();
	var obj = {};
	
	obj["IDUSUARIO"]=IDUSUARIO;
	obj["IDGRUPO"]=getUrlParameters("id","",true);
	var ruta = "";
	var callback;
	
	ruta = "../../api/AU_modificaGrupo";
	callback = modificarGrupo;

	obj["NOMBRE"] = $('#NOMBRE').val();
	obj["FECHA"] = $('#FECHA').val();	
	obj["DESCRIPCION"] = $('#DESCRIPCION').val();	

	var parent= [];

	parent.push(dameResponsable());
	parent.push(dameMiembros());

	var obj2 = $.extend({},obj,parent);


	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: window.location.href='../administracion_usuario_grupo/viewListaGrupo.html'
	});
}


function borrar()
{   
   $("input").val("");
}

function verGrupo(){
	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	obj["IDGRUPO"]=getUrlParameters("id","",true);

	$.ajax({
		type: 'POST',
		url : '../../api/AU_getGrupo',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){ 
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#FECHA').val(data["FECHA"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);

			//INTEGRANTES
			var integrantes = $("#sel2Multi").select2("val");
			var lista=data["USUARIOS"];

	    	for (var i=0; i<lista.length; i++) {
				integrantes.push(lista[i].IDUSUARIO);
	    	}
	    	$("#sel2Multi").select2("val", integrantes);
			seleccionMiembros = $("#sel2Multi").select2("data");

			//RESPONSABLE
			var responsable = $("#sel2Multi1").select2("val");
			var lista1=data["RESPONSABLE"];

	    	for (var i=0; i<lista1.length; i++) {
				responsable.push(lista1[i].IDUSUARIO);
	    	}
	    	$("#sel2Multi1").select2("val", responsable);
			seleccionResponsable = $("#sel2Multi1").select2("data");
		}
	});
}


function cargarListaPersonas1(){
	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	obj["IDGRUPO"]=getUrlParameters("id","",true);


	$.ajax({
		type: 'POST',
		url : '../../api/AU_getGPersonas2',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRES + '</option>');
			}
		}
	});
}

function cargarListaPersonas2(){
	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	obj["IDGRUPO"]=getUrlParameters("id","",true);


	$.ajax({
		type: 'POST',
		url : '../../api/AU_getGPersonas2',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi1").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRES + '</option>');
			}
		}
	});
}

function iniciarNiceSelectBoxes(){
	$('#sel2Multi').select2({
		placeholder: 'Seleccione los usuarios',
		allowClear: true
	});

	//RESPONSABLE
	$('#sel2Multi1').select2({
		placeholder: 'Seleccione solo un usuario',
		maximumSelectionSize: 1,
		allowClear: true
	});
}

$(document).ready(function(){
	iniciarNiceSelectBoxes();
	cargarListaPersonas1();
	cargarListaPersonas2();
	//verGrupo();
	setTimeout(verGrupo,50);

	$("#modificarGrupo").click(guardarCambios);
});


