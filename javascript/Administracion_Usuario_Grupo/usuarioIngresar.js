
function regristrarUsuario(data){
	$('#NOMBRES').html(data["NOMBRES"]);
	$('#APELLIDOS').html(data["APELLIDOS"]);
	$('#CORREO_INSTITUCIONAL').html(data["CORREO_INSTITUCIONAL"]);
	$('#CORREO_ALTERNO').html(data["CORREO_ALTERNO"]);
	$('#NUMERO_CELULAR').html(data["NUMERO_CELULAR"]);
	$('#NUMERO_TEL_ALTERNO').html(data["NUMERO_TEL_ALTERNO"]);
	$('#CUENTA_SKYPE').html(data["CUENTA_SKYPE"]);
	$('#IDINSTITUCION').html(data["IDINSTITUCION"]);
	$('#MESES_TERMINAR').html(data["MESES_TERMINAR"]);
	$('#COMPROMISO').html(data["COMPROMISO"]);
	$('#IDPERMISO').html(data["IDPERMISO"]);

	$('#NOMBRES').prop('readOnly',true);
	$('#APELLIDOS').prop('readOnly',true);
	$('#CORREO_INSTITUCIONAL').prop('readOnly',true);
	$('#CORREO_ALTERNO').prop('readOnly',true);
	$('#NUMERO_CELULAR').prop('readOnly',true);
	$('#NUMERO_TEL_ALTERNO').prop('readOnly',true);
	$('#CUENTA_SKYPE').prop('readOnly',true);
	$('#IDINSTITUCION').not(":selected").attr("disabled", "disabled");
	$('#MESES_TERMINAR').prop('readOnly',true);
	$('#COMPROMISO').prop('readOnly',true);
	$('#IDPERMISO').not(":selected").attr("disabled", "disabled");
}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	obj["IDUSUARIO"]= "";
	var ruta = "";
	var callback;

	if (!validarUsuario()){
		//alert("Uno o más errores en los campos de entrada");
		return;
	}
	
	ruta = "../../api/AU_registraUsuario";
	callback = regristrarUsuario;
	obj["NOMBRES"] = $('#NOMBRES').val();
	obj["APELLIDOS"] = $('#APELLIDOS').val();
	obj["CORREO_INSTITUCIONAL"] = $('#CORREO_INSTITUCIONAL').val();
	obj["CORREO_ALTERNO"] = $('#CORREO_ALTERNO').val();
	obj["NUMERO_CELULAR"] = $('#NUMERO_CELULAR').val();
	obj["NUMERO_TEL_ALTERNO"] = $('#NUMERO_TEL_ALTERNO').val();
	obj["CUENTA_SKYPE"] = $('#CUENTA_SKYPE').val();
	obj["IDINSTITUCION"]= $('#IDINSTITUCION').val();
	obj["MESES_TERMINAR"] = $('#MESES_TERMINAR').val();
	obj["COMPROMISO"] = $('#COMPROMISO').val();
	obj["IDPERMISO"] = $('#IDPERMISO').val();	
	
	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: callback
	});
}


function cargarComboTipoUsuario(){
	$.ajax({
		type: 'GET',
		url : '../../api/AU_getTipoUsuario',
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
		type: 'GET',
		url : '../../api/AU_getInstituciones',
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

function borrar()
{   
   $("input").val("");
   clearErrors();
}

$(document).ready(function(){
	cargarComboInstitucion();
	cargarComboTipoUsuario();
	$("#NUMERO_CELULAR").mask("(999) 9999-9999");
	$("#NUMERO_TEL_ALTERNO").mask("(999) 9999-9999");
	$("#guardar").click(guardarCambios);
	$("#clear").click(borrar);
});


