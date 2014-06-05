
function validarVisibilidadPanelIzquierdo(data){
	var result1,result2;

	//publicaciones
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "1"; });
	if (result1.length === 0) $("#ver-publicacion").hide(); else $("#ver-publicacion").show();
	result2 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "3"; });
	if (result2.length === 0) $("#reg-publicacion").hide(); else $("#reg-publicacion").show();
	if (result1.length === 0 && result2.length === 0) $("#publicacion").hide(); else $("#publicacion").show();

	//fichas
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "6"; });
	if (result1.length === 0) {$("#ver-ficha").hide(); $("#fichas").hide();} else {$("#ver-ficha").show(); $("#fichas").show();}

	//usuarios
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "11"; });
	if (result1.length === 0) $("#ver-usuario").hide(); else $("#ver-usuario").show();
	result2 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "13"; });
	if (result2.length === 0) $("#reg-usuario").hide(); else $("#reg-usuario").show();
	if (result1.length === 0 && result2.length === 0) $("#usuarios").hide(); else $("#usuarios").show();

	//grupos
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "16"; });
	if (result1.length === 0) $("#ver-grupo").hide(); else $("#ver-grupo").show();
	result2 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "18"; });
	if (result2.length === 0) $("#reg-grupo").hide(); else $("#reg-grupo").show();
	if (result1.length === 0 && result2.length === 0) $("#grupos").hide(); else $("#grupos").show();

	//autores
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "21"; });
	if (result1.length === 0) {$("#ver-autor").hide(); $("#autores").hide();} else {$("#ver-autor").show(); $("#autores").show();}

	//idiomas
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "25"; });
	if (result1.length === 0) {$("#ver-idioma").hide(); $("#idiomas").hide();} else {$("#ver-idioma").show(); $("#idiomas").show();}

	//etiquetas
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "29"; });
	if (result1.length === 0) {$("#ver-etiqueta").hide(); $("#etiquetas").hide();} else {$("#ver-etiqueta").show(); $("#etiquetas").show();}

	//tipopublicacion
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "33"; });
	if (result1.length === 0) {$("#ver-tipopub").hide(); } else {$("#ver-tipopub").show();}

	//tipoficha
	result2 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "37"; });
	if (result2.length === 0) {$("#ver-tipofi").hide(); } else {$("#ver-tipofi").show();}

	//institucion
	result3 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "41"; });
	if (result3.length === 0) {$("#ver-institucion").hide(); } else {$("#ver-institucion").show();}

	if (result1.length === 0 && result2.length === 0 && result3.length === 0) $("#maestros").hide(); else $("#maestros").show();

	//enlace
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "45"; });
	if (result1.length === 0) $("#ver-enlace").hide(); else $("#ver-enlace").show();
	result2 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "47"; });
	if (result2.length === 0) $("#reg-enlace").hide(); else $("#reg-enlace").show();
	if (result1.length === 0 && result2.length === 0) $("#enlaces").hide(); else $("#enlaces").show();

	//permiso
	result1 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "50"; });
	if (result1.length === 0) $("#ver-permiso").hide(); else $("#ver-permiso").show();
	result2 = $.grep(data, function(e){ return e.IDFUNCIONALIDAD === "52"; });
	if (result2.length === 0) $("#reg-permiso").hide(); else $("#reg-permiso").show();
	if (result1.length === 0 && result2.length === 0) $("#permiso").hide(); else $("#permiso").show();

}


function verificarPermisosVisibilidad(){
	$.ajax({
		type: 'GET',
		url : '../../api/SE_getFuncionalidadUsuario/'+ localStorage.getItem('uid'),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			validarVisibilidadPanelIzquierdo(data);
		}
	});
}

function llenarNombreUsuario(){
	$.ajax({
		type: 'GET',
		url : '../../api/AU_getUsuario3/'+ localStorage.getItem('uid'),
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$("span.hidden-xs").html(data["NOMBRES"]+' '+data["APELLIDOS"]);
		}
	});
}

function verificarUsuarioLogueado(){
	if(localStorage.getItem('uid')===null)
		$(location).attr('href','../../login.html');
}

$(document).ready(function(){

	//IMPORTANTE
	verificarUsuarioLogueado();
	verificarPermisosVisibilidad();
	llenarNombreUsuario();

	$('#poweroff').click(function(){
    	localStorage.clear();
    	$(location).attr('href','../../login.html');
	});

	$('#salir').click(function(){
    	localStorage.clear();
    	$(location).attr('href','../../login.html');
	});
});