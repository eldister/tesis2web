
function regristrarUsuario(data){
	$('#NOMBRES').html(data["NOMBRES"]);
	$('#APELLIDOS').html(data["APELLIDOS"]);
	$('#CORREO_INSTITUCIONAL').html(data["CORREO_INSTITUCIONAL"]);
	$('#CORREO_ALTERNO').html(data["CORREO_ALTERNO"]);
	$('#NUMERO_CELULAR').html(data["NUMERO_CELULAR"]);
	$('#NUMERO_TEL_ALTERNO').html(data["NUMERO_TEL_ALTERNO"]);
	$('#CUENTA_SKYPE').html(data["CUENTA_SKYPE"]);
	$('#INSTITUCION').html(data["INSTITUCION"]);
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
	$('#INSTITUCION').prop('readOnly',true);
	$('#MESES_TERMINAR').prop('readOnly',true);
	$('#COMPROMISO').prop('readOnly',true);
	$('#IDPERMISO').prop('readOnly',true);
	//resetForm();
}


function resetForm(){

}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	obj["IDUSUARIO"]= "";
	var ruta = "";
	var callback;
	
	ruta = "../../api/AU_registraUsuario";
	callback = regristrarUsuario;
	obj["NOMBRES"] = $('#NOMBRES').val();
	obj["APELLIDOS"] = $('#APELLIDOS').val();
	obj["CORREO_INSTITUCIONAL"] = $('#CORREO_INSTITUCIONAL').val();
	obj["CORREO_ALTERNO"] = $('#CORREO_ALTERNO').val();
	obj["NUMERO_CELULAR"] = $('#NUMERO_CELULAR').val();
	obj["NUMERO_TEL_ALTERNO"] = $('#NUMERO_TEL_ALTERNO').val();
	obj["CUENTA_SKYPE"] = $('#CUENTA_SKYPE').val();
	//obj["INSTITUCION"] = $('#INSTITUCION').val();
	obj["INSTITUCION"]= "CATO";
	obj["MESES_TERMINAR"] = $('#MESES_TERMINAR').val();
	obj["COMPROMISO"] = $('#COMPROMISO').val();
	obj["IDPERMISO"] = $('#IDPERMISO').val();	
	

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		//data: obj,
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

function borrar()
{   
   $("input").val("");
}

$(document).ready(function(){
	cargarComboTipoUsuario();
	$("#guardar").click(guardarCambios);
	$("#clear").click(borrar);
});