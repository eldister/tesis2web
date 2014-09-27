
var seleccionResponsable=[];
var seleccionMiembros=[];


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
	
	window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
	//location.attr('href','../tesis2web/front/administracion_usuario_grupo/viewListaGrupo.html');
}


var test = $('#sel2Multi1');
$(test).change(function() {
    seleccionResponsable = ($(test).select2('data')) ;
    dameResponsable();
});

var test2 = $('#sel2Multi2');
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

	var answer = confirm("Desea modificar los datos del grupo?")
	if (answer){
		var data = $(".form-control");
		var IDUSUARIO=getId();
		var obj = {};
		
		obj["IDUSUARIO"]=IDUSUARIO;
		obj["IDGRUPO"]=getUrlParameters("id","",true);
		var ruta = "";
		var callback;
		
		ruta = "../../api/AU_modificaGrupo";
		callback = modificarGrupo;

		obj["NOMBRE"] = $('#NOMBRES').val();
		obj["FECHA"] = $('#FECHA').val();	
		obj["DESCRIPCION"] = $('#DESCRIPCION').val();	

		var parent= [];

		if(!validarGrupo(dameResponsable(),dameMiembros())){
			return;
		}

		parent.push(dameResponsable());
		parent.push(dameMiembros());

		var obj2 = $.extend({},obj,parent);


		$.ajax({
			type: 'POST',
			url : ruta,
			dataType: "json",
			data: JSON.stringify(obj2),
			contentType: "application/json; charset=utf-8",
			success: function (data){
				alert("El grupo se modifico creoCorrectamente"); 
				window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
			}
		});
	}
	else{}
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
			$('#NOMBRES').val(data["NOMBRE"]);
			$('#FECHA').val(data["FECHA"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);

			//INTEGRANTES
			var integrantes = $("#sel2Multi2").select2("val");
			var lista=data["USUARIOS"];

	    	for (var i=0; i<lista.length; i++) {
				integrantes.push(lista[i].IDUSUARIO);
	    	}
	    	$("#sel2Multi2").select2("val", integrantes);
			seleccionMiembros = $("#sel2Multi2").select2("data");

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
		//url : '../../api/AU_getGPersonas2',
		url : '../../api/AU_getGPersonas5',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi2").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRES + '</option>');
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
		//url : '../../api/AU_getGPersonas2',
		url : '../../api/AU_getGPersonas5',
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
	$('#sel2Multi2').select2({
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

function cargarComboTipoUsuario(){
	$.ajax({
		type: 'POST',
		url : '../../api/AU_getTipoUsuarioGU',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		async:false,
		success: function(data){
			for(obj in data){
				var opt = $("<option></option>");
				opt.val(data[obj]["IDPERMISO"]);
				opt.html(data[obj]["NOMBRE"]);
				$("#IDPERMISO").append(opt);
			}
		}
	});
}

function cargarComboInstitucion(){
	$.ajax({
		type: 'POST',
		url : '../../api/AU_getInstitucionGU',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		async:false,
		success: function(data){
			for(obj in data){
				var opt = $("<option></option>");
				opt.val(data[obj]["IDINSTITUCION"]);
				opt.html(data[obj]["NOMBRE_INSTITUCION"]);
				$("#IDINSTITUCION").append(opt);
			}
		}
	});
}

function cerrarGU(){
	$('#NOMBRES_USUARIO').val("");
	$('#APELLIDOS').val("");
	$('#CORREO_INSTITUCIONAL').val("");
	//$('#INSTITUCION').val("");
	$('#CORREO_ALTERNO').val("");
	$('#NUMERO_CELULAR').val("");
	$('#NUMERO_TEL_ALTERNO').val("");
	$('#CUENTA_SKYPE').val("");
}

function guardarUsuarioGrupo(){

	var answer = confirm("Desea crear el usuario?")
	if (answer){
		var data = $(".form-control");
		
		var obj2 = {}
		
		obj["IDUSUARIO"]= "";
		var ruta = "";
		var callback;

		if (!validarUsuarioGU()){
			//alert("Uno o más errores en los campos de entrada");
			return;
		}

		// CODIGO QUE SE AGREGO

	
			ruta2 = "../../api/GU_verificaUsuarioRepetido";
			obj2["NOMBRES_USUARIO"] = $('#NOMBRES_USUARIO').val();
			obj2["APELLIDOS"] = $('#APELLIDOS').val();
			$.ajax({
				type: 'POST',
				url : ruta2,
				dataType: "json",
				data: JSON.stringify(obj2),
				contentType: "application/json; charset=utf-8",
				success: function(data2){
						//alert("mmmm");
						//for (var i=0; i<data2.length; i++) {
							if(data2[0]*1>0){
								alert("Error: El usuario ya fue ingresado anteriormente");
								//break;
								
								return 0;
							}
							else{
								gruardarUsuario();
							}
				}
			});
	}
}

function gruardarUsuario(){

	var obj = {};
	var ruta = "";
	var callback;
	
	ruta = "../../api/GU_reistrarUsuarioGrupo";
	obj["NOMBRES"] = $('#NOMBRES_USUARIO').val();
	obj["APELLIDOS"] = $('#APELLIDOS').val();
	obj["CORREO_INSTITUCIONAL"] = $('#CORREO_INSTITUCIONAL').val();
	obj["CORREO_ALTERNO"] = $('#CORREO_ALTERNO').val();	
	obj["NUMERO_CELULAR"] = $('#NUMERO_CELULAR').val();	
	obj["NUMERO_TEL_ALTERNO"] = $('#NUMERO_TEL_ALTERNO').val();	
	obj["CUENTA_SKYPE"] = $('#CUENTA_SKYPE').val();	
	obj["IDINSTITUCION"] = $('#IDINSTITUCION').val();
	obj["IDPERMISO"] = $('#IDPERMISO').val();	

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			/*alert("El autor se agrego correctamente");
			window.location.href='../Publicacion_Documental/ViewListaAutores.html';*/
			$('#detalleUsuario').modal('hide');
			//$("#sel2Multi2").append('<option value="' + data.IDUSUARIO + '">' + data.NOM_APE + '</option>');			
			//$("#sel2Multi1").append('<option value="' + data.IDUSUARIO + '">' + data.NOM_APE + '</option>');
			$("#sel2Multi1").append('<option value="' + data[0].IDUSUARIO + '">' + data[1].NOMBRESU + '</option>');
			$("#sel2Multi2").append('<option value="' + data[0].IDUSUARIO + '">' + data[1].NOMBRESU + '</option>');

		}
	});
	
	$('#NOMBRES_USUARIO').val("");
	$('#APELLIDOS').val("");
	$('#CORREO_INSTITUCIONAL').val("");
	//$('#INSTITUCION').val("");
	$('#CORREO_ALTERNO').val("");
	$('#NUMERO_CELULAR').val("");
	$('#NUMERO_TEL_ALTERNO').val("");
	$('#CUENTA_SKYPE').val("");

}

$(document).ready(function(){
	cargarComboInstitucion();
	cargarComboTipoUsuario();
	iniciarNiceSelectBoxes();
	cargarListaPersonas1();
	cargarListaPersonas2();
	//verGrupo();
	setTimeout(verGrupo,50);

	$("#modificarGrupo").click(guardarCambios);
	$("#guardarUsuarioGrupo").click(guardarUsuarioGrupo);
	$("#cerrarGU").click(cerrarGU);
});


