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
function llenaTabla(data){
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDLECTURAASIGNADA"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["TITULO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["PALABRASCLAVE"]+'</td>';
		fila += '<td class="text-center">'+data[i]["AUTORES"]+'</td>';
		fila += '</tr>';
		$('#listaLecturas').append(fila);
	}
}

var lecturas;

function cargaPublicacionesExtendida(){

	for(var i=0; i < lecturas.length ; i++){
		var fila= '<br><div class="list-group-item">';
		fila += '<h4 class="list-group-item-heading">'+lecturas[i]["TITULO"]+'</h4>';
		fila += '<h5 class="list-group-item-text">Palabras Clave:</h5>';
		fila += '<p class="list-group-item-text">'+lecturas[i]["PALABRASCLAVE"]+'</p>';
		fila += '<h5 class="list-group-item-text">Autores:</h5>';
		fila += '<p class="list-group-item-text">'+lecturas[i]["AUTORES"]+'</p>';
		fila += '<h5 class="list-group-item-text">Notas de Lectura:</h5>';

		for (var j = 0; j < lecturas[i]["NOTASLECTURA"].length; j++) {
			fila += '<p class="list-group-item-text">-Nota '+(j+1)+': '+lecturas[i]["NOTASLECTURA"][j]["CONTENIDO"]+'</p>';
		};
		fila += '</div>';

		$('#divExtendida').append(fila);
	}
}

function cambiaDisplay(idvista){
	if(idvista==="1"){ //compacta
		$("#listaLecturas").empty();
		$("#divExtendida").hide();
		$("#divCompacta").show();
		llenaTabla(lecturas);
	}
	else{//extendida
		$("#divExtendida").empty();
		$("#divCompacta").hide();
		$("#divExtendida").show();
		cargaPublicacionesExtendida();
	}
}

function cambioIdiomaCombo(){
	$("#tipovista").change(function(){
		cambiaDisplay($(this).val());
	});
}

function validarEnlace(){
	//if (idenlace===null) $(location).attr('href','../../front/Seguridad/errorPermiso.html');
	var obj={idenlace:idenlace};
	$.ajax({
		type: 'POST',
		url : '../tesis2web/api/PD_getPublicacionesEnlace',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			if(data.length>0){
				$("#tema").html(data[0]["NOMBREABR"]);
				idlp=data[0]["IDLISTAPUBLICACION"];
				lecturas=data;
				llenaTabla(data);				
			}
			else{
				$("#mainbox").empty();
				var fila="<h4>El enlace proporcionado es inválido, por tanto no tiene permisos para ver su contenido.</h4>";
				$("#mainbox").append(fila);
			}
		}
	});
}

var idenlace,idlp,idvista="1",lecturas;
$(document).ready(function(){
	idenlace=getUrlParameters("id","",true);
	validarEnlace();
	cambioIdiomaCombo();
	//cambiaDisplay(idvista);
	
});