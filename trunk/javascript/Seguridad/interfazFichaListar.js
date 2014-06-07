function validarVisibilidadTabla(data){
	var result,permisover,permisoreg,permisomod,permisodel;

	result = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "6"; });
	if (result.length === 0){
		$(location).attr('href','../../front/Seguridad/errorPermiso.html');
	}else{ 
		permisover = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "7"; });
		//permisoreg = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "8"; });
		permisomod = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "9"; });
		permisodel = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "10"; });

		if (permisover.length === 0) {
			$('a.ver-ficha').attr("style","visibility: hidden");
		}
		//if (permisoreg.length === 0) {
		//	$('#agregar').hide();			
		//}
		if (permisomod.length === 0) {
			$('a.modificar-ficha').attr("style","visibility: hidden");
		}
		if (permisodel.length === 0) {
			$('a.eliminar-ficha').attr("style","visibility: hidden");
		}
	}	
}


function verificarPermisos(){
	$.ajax({
		type: 'GET',
		url : '../../api/SE_getFuncionalidadUsuario/'+ localStorage.getItem('uid'),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			validarVisibilidadTabla(data);
		}
	});
}

$(document).ready(function(){

	verificarPermisos();

});