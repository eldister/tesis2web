
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

$(document).ready(function(){

	cargarComboTipoUsuario();
	cargarComboInstitucion();
	verUsuario();
	
});