function cargaElementos(data){

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDPERMISO"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["NOMBRE"]+'</td>';
		fila += '<td class="text-center">'+data[i]["DESCRIPCION"]+'</td>';
		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a class="ver-permiso table-link" href="ViewVerPerfil.html?idper='+data[i]["IDPERMISO"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		if(data[i]["IDPERMISO"]!="1"){//para administrador poner cuando terminen pruebas
			fila+= '<a class="modificar-permiso table-link" href="ViewModificarPerfil.html?idper='+data[i]["IDPERMISO"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
			fila+= '<a class="eliminar-permiso table-link danger" idper='+data[i]["IDPERMISO"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		}
		fila += '</td></tr>';
		$('#listaPermisos').append(fila);
		$('#listaPermisos').trigger("update");
	}
	$(document).on('click', '.eliminar-permiso', eliminarPermiso);
}

function eliminarPermiso(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	$('#mensaje').html("");
	$('#guardar').show();
	var idper=this.getAttribute("idper");

	$.ajax({
		type: 'GET',
		url : '../../api/SE_getPermiso/'+ idper,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDPERMISO').val(idper);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);
		}
	});

	$.ajax({
		type: 'GET',
		url : '../../api/SE_validarEliminacionPermiso/'+ idper,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			if(data["numUsuPermiso"]>0){
				$('#mensaje').html("El permiso seleccionado esta siendo usado en alguno de los participantes, "+ 
									"favor de cambiar el permiso a estos para poder eliminar el permiso actual");
				$('#guardar').hide();
			}
		}
	})

	$('#NOMBRE').attr('readOnly',true);
	$('#DESCRIPCION').attr('readOnly',true);
	$('#detallePermiso').removeClass('insertar');
	$('#detallePermiso').removeClass('modificar');
	$('#detallePermiso').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Permiso");
	$('#tituloBoton').html("Eliminar");
	$('#detallePermiso').addClass('eliminar');
	$('#detallePermiso').modal('show');
}

function elimina(data){
	$('#detallePermiso').modal('hide');	
	resetForm();
	$('#fila-'+data["IDPERMISO"]+'').remove();
	$('#listaPermisos').trigger("update");
	return false;
}

function resetForm(){
	$('#NOMBRE').attr('readOnly',false);
	$('#DESCRIPCION').attr('readOnly',false);
	$("input.form-control").val("");
	$(".alert").remove();
}

function guardarCambios(){

	var data = $(".form-control");
	var obj = {};

	obj["IDPERMISO"]= $('#IDPERMISO').val();
	var ruta = "";
	var callback;

	if($('#detallePermiso').hasClass("eliminar")){
		ruta = "../../api/SE_eliminarPermiso";
		callback = elimina;
	}
	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: callback
	});
}

function cargaListaPermisos(){
	$.ajax({
		type: 'GET',
		url : '../../api/SE_getListaPermiso',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaElementos
	});
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val() });
}

$(document).ready(function(){
	cargaListaPermisos();
	$("#guardar").click(guardarCambios);
	$("#cerrar").click(resetForm);

});