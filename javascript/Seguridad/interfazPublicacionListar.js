function validarVisibilidadTabla(data){
	var result,permisover,permisoreg,permisomod,permisodel;

	result = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "1"; });
	if (result.length === 0){
		$(location).attr('href','../../front/Seguridad/errorPermiso.html');
	}else{ 
		permisover = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "2"; });
		permisoreg = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "3"; });
		permisomod = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "4"; });
		permisodel = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "5"; });

		if (permisover.length === 0) {
			$('a.ver-publicacion').attr("style","visibility: hidden");
		}
		if (permisoreg.length === 0) {
			$('#agregar').hide();			
		}
		if (permisomod.length === 0) {
			$('a.modificar-publicacion').attr("style","visibility: hidden");
		}
		if (permisodel.length === 0) {
			$('a.eliminar-publicacion').attr("style","visibility: hidden");
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