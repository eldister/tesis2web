function cargaElementos(data){
	
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDTIPOPUBLICACION"] +'>';
		//var fila='<tr>';
		for(key in data[i]){
				if(key==="IDTIPOPUBLICACION"){
					fila+='<td style="display:none;">'
				}
				else
				fila += '<td class="text-center">'+data[i][key]+'</td>';
		}

		fila+= '<td style="width: 23%;padding-left: 30px;">'
		//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a  class="eliminarRequisito" data-toggle="modal" ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="modificar-tipoPublicacion table-link" idtipopublicacion='+data[i]["IDTIPOPUBLICACION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="eliminar-tipoPublicacion table-link danger" idtipopublicacion='+data[i]["IDTIPOPUBLICACION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listaTipoPublicacion').append(fila);
	}
	$(document).on('click', '.modificar-tipoPublicacion', modificarTipoPublicacion);
	$(document).on('click', '.eliminar-tipoPublicacion', eliminarTipoPublicacion);
}

function inserta(data){

	$('#detalleTipoPublicacion').modal('hide');
	var fila = '<tr id=fila-'+ data[0]["IDTIPOPUBLICACION"] +'>';
	//var fila='<tr>';
	fila +='<td style="display:none;">'
	fila += '<td class="text-center">'+data[1]["NOMBRE"]+'</td>';
	fila += '<td class="text-center">'+data[2]["DESCRIPCION"]+'</td>';

	fila+= '<td style="width: 23%;padding-left: 30px;">'
	//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';	
	fila+= '<a class="modificar-tipoPublicacion table-link" idtipopublicacion='+data[0]["IDTIPOPUBLICACION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	fila+= '<a class="eliminar-tipoPublicacion table-link danger" idtipopublicacion='+data[0]["IDTIPOPUBLICACION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	fila += '</tr>';
	$('#listaTipoPublicacion').append(fila);

	resetForm();

	$(document).on('click', '.modificar-tipoPublicacion', modificarTipoPublicacion);
	$(document).on('click', '.eliminar-tipoPublicacion', eliminarTipoPublicacion);
}

function eliminarTipoPublicacion(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("IDTIPOPUBLICACION");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getTipoPublicacion/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			//for(key in data){ 
			//	if($('#'+key).is("select"))continue;
			//	$('#'+key).html(data[key]);
			//	$('#'+key).val(data[key]);
			//}
			$('#IDTIPOPUBLICACION').val(idtipo);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);
		}
	});
	$('#NOMBRE').attr('readOnly',true);
	$('#DESCRIPCION').attr('readOnly',true);
	$('#detalleTipoPublicacion').removeClass('insertar');
	$('#detalleTipoPublicacion').removeClass('modificar');
	$('#detalleTipoPublicacion').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Tipo de Publicacion");
	$('#detalleTipoPublicacion').addClass('eliminar');
	$('#detalleTipoPublicacion').modal('show');

}

function modificarTipoPublicacion(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("IDTIPOPUBLICACION");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getTipoPublicacion/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			//for(key in data){ 
			//	if($('#'+key).is("select"))continue;
			//	$('#'+key).html(data[key]);
			//	$('#'+key).val(data[key]);
			//}
			$('#IDTIPOPUBLICACION').val(idtipo);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);
		}
	});
	$('#NOMBRE').attr('readOnly',false);
	$('#DESCRIPCION').attr('readOnly',false);
	$('#detalleTipoPublicacion').removeClass('insertar');
	$('#detalleTipoPublicacion').removeClass('modificar');
	$('#detalleTipoPublicacion').removeClass('eliminar');
	$('#tituloModal').html("Modificar Tipo de Publicacion");
	$('#detalleTipoPublicacion').addClass('modificar');
	$('#detalleTipoPublicacion').modal('show');
	
}

function resetForm(){
	$('#NOMBRE').attr('readOnly',false);
	$('#DESCRIPCION').attr('readOnly',false);
	$("input.form-control").val("");
	$(".alert").remove();
}

function modifica(data){
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDTIPOPUBLICACION"]);
	$(campos[1]).html(data["NOMBRE"]);
	$(campos[2]).html(data["DESCRIPCION"]);
	$('#detalleTipoPublicacion').modal('hide');
	resetForm();
}

function elimina(data){

	$('#detalleTipoPublicacion').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDTIPOPUBLICACION"]+'').remove();
	return false;
}


function guardarCambios(){
	var data = $(".form-control");
	var obj = {};

	obj["IDTIPOPUBLICACION"]= $('#IDTIPOPUBLICACION').val();
	var ruta = "";
	var callback;

	if($('#detalleTipoPublicacion').hasClass("eliminar")){
		ruta = "../../api/PD_eliminaTipoPublicacion";
		callback = elimina;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["DESCRIPCION"] = $('#DESCRIPCION').val();
	}

	if($('#detalleTipoPublicacion').hasClass("insertar")){
		ruta = "../../api/PD_registraTipoPublicacion";
		callback = inserta;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["DESCRIPCION"] = $('#DESCRIPCION').val();
	}

	if($('#detalleTipoPublicacion').hasClass("modificar")){
		ruta = "../../api/PD_modificaTipoPublicacion";
		callback = modifica;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["DESCRIPCION"] = $('#DESCRIPCION').val();
	}
	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		//data: obj,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: callback
	});
}

function cargaListaTipoPublicacion(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getListaTipoPublicacion',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaElementos
	});
}

function insertaCambiosFront(){
	$('#IDTIPOPUBLICACION').html("");
	$('#detalleTipoPublicacion').removeClass('insertar');
	$('#detalleTipoPublicacion').removeClass('modificar');
	$('#detalleTipoPublicacion').removeClass('eliminar');
	$('#tituloModal').html("Agregar Tipo de Publicación");
	$('#tituloBoton').html("Agregar");
	$('#detalleTipoPublicacion').addClass('insertar');
	$('#detalleTipoPublicacion').modal('show');
	$('#NOMBRE').val("");
	$('#DESCRIPCION').val("");
}

$(document).ready(function(){
	cargaListaTipoPublicacion();
	$("#guardar").click(guardarCambios);
	$("#cerrar").click(resetForm);
	$("#agregar").click(insertaCambiosFront);

});