function cargaElementos(data){

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDPUBLICACION"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["TITULO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["MES"]+'</td>';
		fila += '<td class="text-center">'+data[i]["TIPO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["IDIOMA"]+'</td>';
		fila+= '<td class="text-center"><a class="agregar-ficha table-link" href="ViewCrearFicha.html?idpublicacion='+data[i]["IDPUBLICACION"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-file-o fa-stack-1x fa-inverse"></i></span></a></td>';
		fila+= '<td style="width: 23%;padding-left: 30px;">'
		//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a  class="eliminarRequisito" data-toggle="modal" ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="ver-publicacion table-link" href="ViewVerPublicacion.html?idpublicacion='+data[i]["IDPUBLICACION"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="modificar-publicacion table-link" href="ViewModificarPublicacion.html?idpublicacion='+data[i]["IDPUBLICACION"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="eliminar-publicacion table-link danger" idpublicacion='+data[i]["IDPUBLICACION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listaPublicacion').append(fila);
		$('#listaPublicacion').trigger("update");
	}
	$(document).on('click', '.eliminar-publicacion', eliminarPublicacion);
}

function eliminarPublicacion(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("idpublicacion");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getPublicacion/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDPUBLICACION').val(idtipo);
			$('#TITULO').val(data["TITULO"]);
			$('#TIPOPUBLICACION').val(data["TIPO"]);
			$('#IDIOMA').val(data["IDIOMA"]);
			$('#ANIOPUB').val(data["ANIO"]);
			$('#MESPUB').val(data["MES"]);
		}
	});
	$('#TITULO').attr('readOnly',true);
	$('#TIPOPUBLICACION').attr('readOnly',true);
	$('#IDIOMA').attr('readOnly',true);
	$('#ANIOPUB').attr('readOnly',true);
	$('#MESPUB').attr('readOnly',true);
	$('#detallePublicacion').removeClass('insertar');
	$('#detallePublicacion').removeClass('modificar');
	$('#detallePublicacion').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Publicacion");
	$('#tituloBoton').html("Eliminar");
	$('#detallePublicacion').addClass('eliminar');
	$('#detallePublicacion').modal('show');
}

function elimina(data){
	$('#detallePublicacion').modal('hide');	
	resetForm();
	$('#fila-'+data["IDPUBLICACION"]+'').remove();
	$('#listaPublicacion').trigger("update");
	return false;
}

function resetForm(){
	$('#TITULO').attr('readOnly',false);
	$('#TIPOPUBLICACION').attr('readOnly',false);
	$('#IDIOMA').attr('readOnly',false);
	$('#ANIOPUB').attr('readOnly',false);
	$('#MESPUB').attr('readOnly',false);
	$("input.form-control").val("");
	$(".alert").remove();
}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};

	obj["IDPUBLICACION"]= $('#IDPUBLICACION').val();
	var ruta = "";
	var callback;

	if($('#detallePublicacion').hasClass("eliminar")){
		ruta = "../../api/PD_eliminaPublicacion";
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

function cargaListaPublicacion(){
	var obj={ idMiGrupo:localStorage.idMiGrupo,
			  idUsuario:localStorage.uid
			};

	$.ajax({
		type: 'POST',
		url : '../../api/PD_getListaPublicacion',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data:JSON.stringify(obj),
		success: cargaElementos
	});
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val() });
}

$(document).ready(function(){
	cargaListaPublicacion();
	$("#guardar").click(guardarCambios);
	$("#cerrar").click(resetForm);

});