var listaLecturas=[];

function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

function llenaTabla(data){
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDPUBLICACION"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center titulo">'+data[i]["TITULO"]+'</td>';		
		fila += '<td class="text-center tipo">'+data[i]["TIPO"]+'</td>';
		fila += '<td class="text-center idioma">'+data[i]["IDIOMA"]+'</td>';
		fila += '<td class="text-center autores">'+data[i]["AUTORES"]+'</td>';
		fila += '<td class="text-center"><input id="opcion'+data[i]["IDPUBLICACION"]+'" type="radio" name="radio" value="'+data[i]["IDPUBLICACION"]+'"></td>'	
		fila += '</tr>';
		$('#listaPublicaciones').append(fila);		
	}	
}

function realizarBusqueda(){
	var obj={criterio:$('#criterioBusqueda').val()};

	
	$.ajax({
		type: 'POST',
		url : '../../api/BQ_buscarPublicacionBasico',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			llenaTabla(data);
		}
	});
}

function detectaBuscar(){
	
	/*$('#criterioBusqueda').bind("enterKey",function(e){
		//$('#listaPublicaciones').empty();	
		//$('#listaFichas').empty();	
		//realizarBusqueda();
		alert("Se presiono enter");
	});
	$('#criterioBusqueda').keyup(function(e){
		if(e.keyCode == 13)
		{
		  $(this).trigger("enterKey");
		}
	});*/

	$('#criterioBusqueda').keypress(function(event) {
		 if (event.keyCode == 13) {
		 	$('#listaPublicaciones').empty();	
			$('#listaFichas').empty();
			realizarBusqueda();
		 	alert("Se presiono enter");
		 }
	 });
}

$(document).ready(function(){
	detectaBuscar();
});