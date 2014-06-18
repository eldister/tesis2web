function cargaElementos(data){
	
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDTIPOFICHA"] +'>';
		//var fila='<tr>';
		for(key in data[i]){
				if(key==="IDTIPOFICHA"){
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
		fila+= '<a class="modificar-tipoFicha table-link" idtipoficha='+data[i]["IDTIPOFICHA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="eliminar-tipoFicha table-link danger" idtipoficha='+data[i]["IDTIPOFICHA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listaTipoFicha').append(fila);
		$('#listaTipoFicha').trigger("update");
	}
	$(document).on('click', '.modificar-tipoFicha', modificarTipoFicha);
	$(document).on('click', '.eliminar-tipoFicha', eliminarTipoFicha);
}

function inserta(data){
	alert("El tipo de ficha fue creado correctamente");	
	clearErrors();
	$('#detalleTipoFicha').modal('hide');
	var fila = '<tr id=fila-'+ data[0]["IDTIPOFICHA"] +'>';
	//var fila='<tr>';
	fila +='<td style="display:none;">'
	fila += '<td class="text-center">'+data[1]["NOMBRE"]+'</td>';
	fila += '<td class="text-center">'+data[2]["DESCRIPCION"]+'</td>';

	fila+= '<td style="width: 23%;padding-left: 30px;">'
	//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';	
	fila+= '<a class="modificar-tipoFicha table-link" idtipoficha='+data[0]["IDTIPOFICHA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	fila+= '<a class="eliminar-tipoFicha table-link danger" idtipoficha='+data[0]["IDTIPOFICHA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	fila += '</tr>';
	$('#listaTipoFicha').append(fila);

	resetForm();

	$(document).on('click', '.modificar-tipoFicha', modificarTipoFicha);
	$(document).on('click', '.eliminar-tipoFicha', eliminarTipoFicha);
}

function eliminarTipoFicha(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("IDTIPOFICHA");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getTipoFicha/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDTIPOFICHA').val(idtipo);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);
		}
	});
	$('#NOMBRE').attr('readOnly',true);
	$('#DESCRIPCION').attr('readOnly',true);
	$('#detalleTipoFicha').removeClass('insertar');
	$('#detalleTipoFicha').removeClass('modificar');
	$('#detalleTipoFicha').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Tipo de Ficha");
	$('#detalleTipoFicha').addClass('eliminar');
	$('#detalleTipoFicha').modal('show');

}

function modificarTipoFicha(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("IDTIPOFICHA");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getTipoFicha/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDTIPOFICHA').val(idtipo);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);
		}
	});
	$('#NOMBRE').attr('readOnly',false);
	$('#DESCRIPCION').attr('readOnly',false);
	$('#detalleTipoFicha').removeClass('insertar');
	$('#detalleTipoFicha').removeClass('modificar');
	$('#detalleTipoFicha').removeClass('eliminar');
	$('#tituloModal').html("Modificar Tipo de Ficha");
	$('#detalleTipoFicha').addClass('modificar');
	$('#detalleTipoFicha').modal('show');
	
}

function resetForm(){
	$('#NOMBRE').attr('readOnly',false);
	$('#DESCRIPCION').attr('readOnly',false);
	$("input.form-control").val("");
	$(".alert").remove();
	clearErrors();
}

function modifica(data){
	alert("El tipo de ficha fue modificado correctamente");	
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDTIPOFICHA"]);
	$(campos[1]).html(data["NOMBRE"]);
	$(campos[2]).html(data["DESCRIPCION"]);
	$('#detalleTipoFicha').modal('hide');
	resetForm();
}

function elimina(data){
	alert("El tipo de ficha fue eliminado correctamente");	
	$('#detalleTipoFicha').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDTIPOFICHA"]+'').remove();
	return false;
}


function guardarCambios(){
	var data = $(".form-control");
	var obj = {};

	obj["IDTIPOFICHA"]= $('#IDTIPOFICHA').val();
	var ruta = "";
	var callback;

	if($('#detalleTipoFicha').hasClass("eliminar")){
		var answer = confirm("Desea eliminar el tipo de ficha ?")
		if (answer){
			ruta = "../../api/PD_eliminaTipoFicha";
			callback = elimina;
			obj["NOMBRE"] = $('#NOMBRE').val();
			obj["DESCRIPCION"] = $('#DESCRIPCION').val();
		}
	}

	if($('#detalleTipoFicha').hasClass("insertar")){
		var answer = confirm("Desea ingresar el tipo de ficha ?")
		if (answer){
			ruta = "../../api/PD_registraTipoFicha";
			callback = inserta;
			obj["NOMBRE"] = $('#NOMBRE').val();
			obj["DESCRIPCION"] = $('#DESCRIPCION').val();
		}
	}

	if($('#detalleTipoFicha').hasClass("modificar")){
		var answer = confirm("Desea modificar el tipo de ficha ?")
		if (answer){
			ruta = "../../api/PD_modificaTipoFicha";
			callback = modifica;
			obj["NOMBRE"] = $('#NOMBRE').val();
			obj["DESCRIPCION"] = $('#DESCRIPCION').val();
		}
	}

	if(!validarTipoFicha()) return;

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

function cargaListaTipoFicha(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getListaTipoFicha',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaElementos
	});
}

function insertaCambiosFront(){
	clearErrors();
	$('#IDTIPOFICHA').html("");
	$('#detalleTipoFicha').removeClass('insertar');
	$('#detalleTipoFicha').removeClass('modificar');
	$('#detalleTipoFicha').removeClass('eliminar');
	$('#tituloModal').html("Agregar Tipo de Ficha");
	$('#tituloBoton').html("Agregar");
	$('#detalleTipoFicha').addClass('insertar');
	$('#detalleTipoFicha').modal('show');
	$('#NOMBRE').val("");
	$('#DESCRIPCION').val("");
}

function initTableSorter(){
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val()});
}

$(document).ready(function(){
	initTableSorter();		
	cargaListaTipoFicha();
	$("#guardar").click(guardarCambios);
	$("#cerrar").click(resetForm);
	$("#agregar").click(insertaCambiosFront);

});