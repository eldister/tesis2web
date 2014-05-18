
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

function verGrupo(){
	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	obj["IDGRUPO"]=getUrlParameters("id","",true);

	$.ajax({
		type: 'POST',
		url : '../../api/AU_getGrupo2',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){ 
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#FECHA').val(data["FECHA"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);
			$('#RESPONSABLE').val(data["RESPONSABLE"]);
			$('#INTEGRANTES').val(data["INTEGRANTES"]);
		}
	});
}


$(document).ready(function(){

	verGrupo();

});