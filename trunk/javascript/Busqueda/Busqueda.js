

$(document).ready(function(){
	//detectaBuscar();

	//realizarBusqueda();

	var enterpressed=false;
	var NOMBRE;
	$("#criterioBusqueda").keypress(function(event) {
		 if (event.keyCode == 13) {
		 	$('#listaPublicaciones').empty();	
			$('#listaFichas').empty();
			NOMBRE=$("#criterioBusqueda").val();
			//realizarBusqueda();
				//window.location.href = "../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id=" + IDGRUPO;
			enterpressed=true;
		 	//alert("Se presiono enter");
		 	//window.location.href = '../Publicacion_Documental/ViewListaPublicacion.html?id='+NOMBRE;
		 	if(enterpressed) window.location.href = "../Publicacion_Documental/ViewBusquedaResultado.html?id="+NOMBRE;
		 }
		 else{
		 }
	});
	
	
	


	
});