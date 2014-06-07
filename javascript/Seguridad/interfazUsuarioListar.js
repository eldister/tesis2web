function validarVisibilidadTabla(data){
	var result,permisover,permisoreg,permisomod,permisodel;

	result = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "11"; });
	if (result.length === 0){
		$(location).attr('href','../../front/Seguridad/errorPermiso.html');
	}else{ 
		permisover = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "12"; });
		permisoreg = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "13"; });
		permisomod = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "14"; });
		permisodel = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "15"; });

		if (permisover.length === 0) {
			$('a.ver-usuario').attr("style","visibility: hidden");
		}
		if (permisoreg.length === 0) {
			$('#agregar').hide();			
		}
		if (permisomod.length === 0) {
			$('a.modificar-usuario').attr("style","visibility: hidden");
		}
		if (permisodel.length === 0) {
			$('a.eliminar-usuario').attr("style","visibility: hidden");
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