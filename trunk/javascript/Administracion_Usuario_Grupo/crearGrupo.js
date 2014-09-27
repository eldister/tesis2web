
var seleccionResponsable=[];
var seleccionMiembros=[];


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

function getGrupo(){
	if( localStorage.uid ){
	return IDGRUPO = (localStorage.idGrupo)*1;
	}
	else{
		return IDGRUPO =1;
	}
}

function guardarCambios(){
	var answer = confirm("Desea crear el grupo?")
	if (answer){
		var data = $(".form-control");
		var obj = {};
		
		obj["IDGRUPO_PADRE"]=getGrupo();
		var ruta = "";
		var callback;
		
		ruta = "../../api/AU_registraGrupo";
		obj["NOMBRES"] = $('#NOMBRES').val();
		obj["FECHA_CREACION"] = $('#FECHA_CREACION').val();
		obj["DESCRIPCION"] = $('#DESCRIPCION').val();	

		var parent= [];

		if(!validarGrupo(dameResponsable(),dameMiembros())){
			return;
		}

		parent.push(dameResponsable());
		parent.push(dameMiembros());

		var obj2 = $.extend({},obj,parent);

		console.log(obj2);
		console.log(JSON.stringify(obj2));
		$.ajax({
			type: 'POST',
			url : ruta,
			dataType: "json",
			data: JSON.stringify(obj2),
			contentType: "application/json; charset=utf-8",
			success: function (data){
				alert("El grupo se creoCorrectamente");
				window.location.href='../Administracion_Usuario_Grupo/ViewListaGrupo.html';
			}
		});
	}
	else{}
}
function borrar(){
	$("input").val("");
}

function getId(){
	if( localStorage.uid ){
	return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO =1;
	}
}

function iniciarNiceSelectBoxes(){
	
	$('#sel2Multi1').select2({
		placeholder: 'Seleccione solo un usuario',
		maximumSelectionSize: 1,
		allowClear: true
	});

	$('#sel2Multi2').select2({
		placeholder: 'Seleccione los usuarios',
		allowClear: true
	});
}

function cargarListaPersonas1(){
	/*var obj = {};
	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi1").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});*/

	var IDUSUARIO=getId();
		var obj = {};
		obj["IDUSUARIO"]=IDUSUARIO;
		//obj["IDGRUPO"]=getUrlParameters("id","",true);


		$.ajax({
			type: 'POST',
			//url : '../../api/AU_getGPersonas4',
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

function cargarListaPersonas2(){
	/*var obj = {};
	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi2").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});*/
	var IDUSUARIO=getId();
		var obj = {};
		obj["IDUSUARIO"]=IDUSUARIO;
		//obj["IDGRUPO"]=getUrlParameters("id","",true);


		$.ajax({
			type: 'POST',
			//url : '../../api/AU_getGPersonas4',
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

function cargaHora(){

	/*var dateObj = new Date();
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day  + "/" + month + "/" + year;
    $('#FECHA_CREACION').val(newdate);*/



    var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = dd+'/'+mm+'/'+yyyy;
	$('#FECHA_CREACION').val(today);
	//document.write(today);


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

$(document).ready(function(){

	iniciarNiceSelectBoxes();
	cargarComboInstitucion();
	cargarComboTipoUsuario();
	cargarListaPersonas1();
	cargarListaPersonas2();
	cargaHora();
	
	$("#guardarCambios").click(guardarCambios);
	$("#clear").click(borrar);
	$("#guardarUsuarioGrupo").click(guardarUsuarioGrupo);
	$("#cerrarGU").click(cerrarGU);
});


