var seleccionEtiquetas;
var seleccionGrupos;
var idficha=getUrlParameters("idficha", "", true);
var publicacionDeFicha;

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


function getPublicacionDeFicha(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getPublicacionDeFicha/'+ idficha,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	publicacionDeFicha = data["IDPUBLICACION"];
	    }
	});
}

function llenarDatosPublicacion(){
	var idpub=publicacionDeFicha;
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getPublicacion/'+ idpub,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	$('#TITULO').val(data["TITULO"]);
			$('#IDIOMA').val(data["IDIOMA"]);
			$('#TIPOPUBLICACION').val(data["TIPO"]);
			$('#FECHAPUB').val(data["FECHAREGISTRO"]);
	    }
	});
}

function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

function llenarCamposFicha(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getFicha/'+ idficha,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	$('#ENCABEZADO').val(data["ENCABEZADO"]);
			$('#TIPOFICHA').val(data["TIPO"]);
			$('#CONTENIDO').val(data["CONTENIDO"]);			
	    }	
	});
}

function popularGrupos(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getGrupoFicha/'+ idficha,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	var item='';
	    	for (var i = 0; i < data.length; i++) {
	    		item += '<li><i class="fa-li fa fa-check-square"></i>'+data[i]["NOMBRE"]+'</li>';
	    	};
	    	$('#listaGrupos').append(item);
	    }	
	});
}

function popularEtiquetas(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getEtiquetaFicha/'+ idficha,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	var item='';
	    	for (var i = 0; i < data.length; i++) {
	    		item += '<li><i class="fa-li fa fa-check-square"></i>'+data[i]["NOMBRE"]+'</li>';
	    	};
	    	$('#listaEtiquetas').append(item);
	    }	
	});
}

$(document).ready(function(){
	getPublicacionDeFicha();
	popularGrupos();
	popularEtiquetas();	
	llenarCamposFicha();
	setTimeout(llenarDatosPublicacion,400);

});