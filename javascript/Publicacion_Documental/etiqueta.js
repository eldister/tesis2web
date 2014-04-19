function cargaElementos(data){
	var temp,data2;
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDETIQUETA"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["NOMBRE"]+'</td>';
		fila += '<td class="text-center">'+data[i]["IDIOMA"]+'</td>';
		fila += '<td class="text-center">'+data[i]["OBSERVACION"]+'</td>';
		fila+= '<td style="width: 23%;padding-left: 30px;">'
		//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		//fila+= '<a  class="eliminarRequisito" data-toggle="modal" ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="modificar-etiqueta table-link" idetiqueta='+data[i]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="eliminar-etiqueta table-link danger" idetiqueta='+data[i]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listaEtiqueta').append(fila);
		$('table#tabla').trigger("update");
	}
	$(document).on('click', '.modificar-etiqueta', modificarEtiqueta);
	$(document).on('click', '.eliminar-etiqueta', eliminarEtiqueta);
}

function inserta(data){
	$('#detalleEtiqueta').modal('hide');
	var fila = '<tr id=fila-'+ data[0]["IDETIQUETA"] +'>';
	fila +='<td style="display:none;">';
	fila += '<td class="text-center">'+data[1]["NOMBRE"]+'</td>';
	fila += '<td class="text-center">'+data[2]["IDIOMA"]+'</td>';
	fila += '<td class="text-center">'+data[3]["OBSERVACION"]+'</td>';
	fila += '<td style="width: 23%;padding-left: 30px;">'
	//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';	
	fila += '<a class="modificar-etiqueta table-link" idetiqueta='+data[0]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	fila += '<a class="eliminar-etiqueta table-link danger" idetiqueta='+data[0]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	fila += '</tr>';
	$('#listaEtiqueta').append(fila);
	$('table#tabla').trigger("update");
	resetForm();
	$(document).on('click', '.modificar-etiqueta', modificarEtiqueta);
	$(document).on('click', '.eliminar-etiqueta', eliminarEtiqueta);
}


function eliminarEtiqueta(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("idetiqueta");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getEtiqueta/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDETIQUETA').val(idtipo);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#IDIOMA').val(data["IDIOMA"]);
			$('#OBSERVACION').val(data["OBSERVACION"]);
		}
	});
	$('#NOMBRE').attr('readOnly',true);
	$('#OBSERVACION').attr('readOnly',true);
	$('#IDIOMA').attr('readOnly',true);
	$('#select_div').hide();
	$('#detalleEtiqueta').removeClass('insertar');
	$('#detalleEtiqueta').removeClass('modificar');
	$('#detalleEtiqueta').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Etiqueta");
	$('#tituloBoton').html("Eliminar");
	$('#detalleEtiqueta').addClass('eliminar');
	$('#detalleEtiqueta').modal('show');
	$('#label_idioma').show();

}


function modificarEtiqueta(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("idetiqueta");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getEtiqueta/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDETIQUETA').val(idtipo);
			$('#NOMBRE').val(data["NOMBRE"]);
			//$('#IDIOMA').val(data["IDIOMA"]);
			$('#IDIOMA_SELECT').val(data["IDIDIOMA"]);
			$('#OBSERVACION').val(data["OBSERVACION"]);
		}
	});
	$('#NOMBRE').attr('readOnly',false);
	$('#OBSERVACION').attr('readOnly',false);
	$('#IDIOMA').attr('readOnly',false);
	$('#label_idioma').hide();
	$('#select_div').show();
	$('#detalleEtiqueta').removeClass('insertar');
	$('#detalleEtiqueta').removeClass('modificar');
	$('#detalleEtiqueta').removeClass('eliminar');
	$('#tituloModal').html("Modificar Etiqueta");
	$('#tituloBoton').html("Modificar");
	$('#detalleEtiqueta').addClass('modificar');
	$('#detalleEtiqueta').modal('show');
}

function resetForm(){
	$('#NOMBRE').attr('readOnly',false);
	$('#OBSERVACION').attr('readOnly',false);
	$('#IDIOMA').attr('readOnly',false);
	$("input.form-control").val("");
	$(".alert").remove();
}

function modifica(data){
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDETIQUETA"]);
	$(campos[1]).html(data["NOMBRE"]);
	$(campos[2]).html(data["IDIOMA"]);
	$(campos[3]).html(data["OBSERVACION"]);
	$('#detalleEtiqueta').modal('hide');
	$('table#tabla').trigger("update");
	resetForm();
}

function elimina(data){
	$('#detalleEtiqueta').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDETIQUETA"]+'').remove();
	$('table#tabla').trigger("update");
	return false;
}


function guardarCambios(){
	var data = $(".form-control");
	var obj = {};

	obj["IDETIQUETA"]= $('#IDETIQUETA').val();
	var ruta = "";
	var callback;

	if($('#detalleEtiqueta').hasClass("eliminar")){
		ruta = "../../api/PD_eliminaEtiqueta";
		callback = elimina;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["OBSERVACION"] = $('#OBSERVACION').val();
	}

	if($('#detalleEtiqueta').hasClass("insertar")){
		ruta = "../../api/PD_registraEtiqueta";
		callback = inserta;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["IDIDIOMA"] =$('#IDIOMA_SELECT').val();
		obj["IDIOMA"]=$('#IDIOMA_SELECT option:selected').text();
		obj["OBSERVACION"] = $('#OBSERVACION').val();
	}

	if($('#detalleEtiqueta').hasClass("modificar")){
		ruta = "../../api/PD_modificaEtiqueta";
		callback = modifica;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["IDIDIOMA"] =$('#IDIOMA_SELECT').val();
		obj["IDIOMA"]=$('#IDIOMA_SELECT option:selected').text();
		obj["OBSERVACION"] = $('#OBSERVACION').val();
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

function cargaListaEtiqueta(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getListaEtiqueta',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaElementos
	});
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val() });
}

function insertaCambiosFront(){
	$('#IDETIQUETA').html("");
	$('#detalleEtiqueta').removeClass('insertar');
	$('#detalleEtiqueta').removeClass('modificar');
	$('#detalleEtiqueta').removeClass('eliminar');
	$('#tituloModal').html("Agregar Etiqueta");
	$('#tituloBoton').html("Agregar");
	$('#detalleEtiqueta').addClass('insertar');
	$('#detalleEtiqueta').modal('show');
	$('#NOMBRE').val("");
	$('#OBSERVACION').val("");
	$('#label_idioma').hide();
	$('#select_div').show();
	$('#IDIOMA_SELECT').val("Seleccione el Idioma");
	resetForm();
}

function popularSelectIdioma(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaIdioma',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
		   for (var i=0; i<data.length; i++) {
		     $("#IDIOMA_SELECT").append('<option value="' + data[i].IDIDIOMA + '">' + data[i].NOMBRE + '</option>');
		   }
	    }
	});
}

$(document).ready(function(){
	cargaListaEtiqueta();
	popularSelectIdioma();
	$("#guardar").click(guardarCambios);
	$("#cerrar").click(resetForm);
	$("#agregar").click(insertaCambiosFront);
	

});