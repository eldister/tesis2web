function validarVisibilidadTabla(data){
	var result,permisover,permisoreg,permisomod,permisodel;

	result = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "46"; });
	if (result.length === 0){
		$(location).attr('href','../../front/Seguridad/errorPermiso.html');
	}else{ 
		permisover = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "47"; });
		permisoreg = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "48"; });
		permisomod = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "49"; });
		permisodel = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "50"; });

		if (permisover.length === 0) {
			$('a.ver-permiso').attr("style","visibility: hidden");
		}
		if (permisoreg.length === 0) {
			$('#btn-agregar').hide();
		}
		if (permisomod.length === 0) {
			$('a.modificar-permiso').attr("style","visibility: hidden");
		}
		if (permisodel.length === 0) {
			$('a.eliminar-permiso').attr("style","visibility: hidden");
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