
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
		url : '../../api/AU_getUsuario/'+IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){ 
			$('#IDUSUARIO').val(data["IDUSUARIO"]);
			$('#NOMBRES').html(data["NOMBRES"]);
			$('#NOMBRES1').val(data["NOMBRES"]);
			$('#USERNAME').val(data["USERNAME"]);
			$('#APELLIDOS').val(data["APELLIDOS"]);
			$('#CORREO_INSTITUCIONAL').val(data["CORREO_INSTITUCIONAL"]);
			$('#CORREO_ALTERNO').val(data["CORREO_ALTERNO"]);
			$('#NUMERO_CELULAR').val(data["NUMERO_CELULAR"]);
			$('#NUMERO_TEL_ALTERNO').val(data["NUMERO_TEL_ALTERNO"]);
			$('#CUENTA_SKYPE').val(data["CUENTA_SKYPE"]);
			$('#NOMBRE_INSTITUCION').val(data["NOMBRE_INSTITUCION"]);
			$('#MESES_TERMINAR').val(data["MESES_TERMINAR"]);
			$('#COMPROMISO').val(data["COMPROMISO"]);
			$('#NOMBRE').html(data["NOMBRE"]);
		}
	});

}



$(document).ready(function(){

	verUsuario();
	
});