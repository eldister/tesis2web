
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

function getId(){
	if( localStorage.uid ){
	return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO =1;
	}
}


function verUsuario(){
	//var IDUSUARIO=getUrlParameters("id","",true);
	var IDUSUARIO=getId();
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getUsuario2/'+IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){ 
			$('#IDUSUARIO').val(data[0]["IDUSUARIO"]);
			$('#NOMBRES1').val(data[1]["NOMBRES"]);
			$('#NOMBRES').html(data[1]["NOMBRES"]);
			$('#APELLIDOS').val(data[2]["APELLIDOS"]);
			$('#CORREO_INSTITUCIONAL').val(data[3]["CORREO_INSTITUCIONAL"]);
			$('#CORREO_ALTERNO').val(data[4]["CORREO_ALTERNO"]);
			$('#NUMERO_CELULAR').val(data[5]["NUMERO_CELULAR"]);
			$('#NUMERO_TEL_ALTERNO').val(data[6]["NUMERO_TEL_ALTERNO"]);
			$('#CUENTA_SKYPE').val(data[7]["CUENTA_SKYPE"]);
			$('#IDINSTITUCION').val(data[8]["IDINSTITUCION"]);
			$('#MESES_TERMINAR').val(data[9]["MESES_TERMINAR"]);
			$('#COMPROMISO').val(data[10]["COMPROMISO"]);
			$('#IDPERMISO').val(data[11]["IDPERMISO"]);
			$('#IDPERMISO').not(":selected").attr("disabled", "disabled");
			$('#USERNAME').val(data[12]["USERNAME"]);
			$('#NOMBRE').html(data[13]["NOMBRE"]);
			$('#PASSWORD').val(data[14]["PASSWORD"]);
		}
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

function modificarUsuario(data){
	$('#NOMBRES1').html(data["NOMBRES"]);
	$('#APELLIDOS').html(data["APELLIDOS"]);
	$('#CORREO_INSTITUCIONAL').html(data["CORREO_INSTITUCIONAL"]);
	$('#CORREO_ALTERNO').html(data["CORREO_ALTERNO"]);
	$('#NUMERO_CELULAR').html(data["NUMERO_CELULAR"]);
	$('#NUMERO_TEL_ALTERNO').html(data["NUMERO_TEL_ALTERNO"]);
	$('#CUENTA_SKYPE').html(data["CUENTA_SKYPE"]);
	$('#IDINSTITUCION').val(data["IDINSTITUCION"]);
	$('#MESES_TERMINAR').html(data["MESES_TERMINAR"]);
	$('#COMPROMISO').html(data["COMPROMISO"]);
	$('#IDPERMISO').val(data["IDPERMISO"]);
	$('#USERNAME').html(data["USERNAME"]);
	$('#PASSWORD').html(data["PASSWORD"]);

	$('#NOMBRES1').prop('readOnly',true);
	$('#NOMBRES1').prop('readOnly',true);
	$('#APELLIDOS').prop('readOnly',true);
	$('#PASSWORD').prop('readOnly',true);
	$('#CORREO_INSTITUCIONAL').prop('readOnly',true);
	$('#CORREO_ALTERNO').prop('readOnly',true);
	$('#NUMERO_CELULAR').prop('readOnly',true);
	$('#NUMERO_TEL_ALTERNO').prop('readOnly',true);
	$('#CUENTA_SKYPE').prop('readOnly',true);
	//$('#IDINSTITUCION').prop('readOnly',true);
	$('#IDINSTITUCION').not(":selected").attr("disabled", "disabled");
	$('#MESES_TERMINAR').prop('readOnly',true);
	$('#COMPROMISO').prop('readOnly',true);
	$('#USERNAME').prop('readOnly',true);
	//$('#IDPERMISO').prop('readOnly',true);
	$('#IDPERMISO').not(":selected").attr("disabled", "disabled");
}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	//obj["IDUSUARIO"]=this.getAttribute("IDUSUARIO");
	obj["IDUSUARIO"]=getId();
	var ruta = "";
	var callback;
	
	ruta = "../../api/AU_modificaUsuario2";
	callback = modificarUsuario;
	obj["NOMBRES"] = $('#NOMBRES1').val();
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
	obj["USERNAME"] = $('#USERNAME').val();
	obj["PASSWORD"] = $('#PASSWORD').val();

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: callback
	});
}

$(document).ready(function(){

	cargarComboTipoUsuario();
	cargarComboInstitucion();
	verUsuario();
	
	$("#modificarUsuario").click(guardarCambios);
});