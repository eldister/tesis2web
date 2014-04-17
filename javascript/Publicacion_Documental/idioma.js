
function cargaListaIdioma(data){
	
	for(var i=0; i < data.length ; i++){
		var fila = "<tr>";
		for(key in data[i]){
				if(key==="IDIDIOMA"){
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
		fila+= '<a class="modificar-idioma" ididioma='+data[i]["IDIDIOMA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';

		fila += '</td></tr>';
		$('#listaIdioma').append(fila);
	}
	$(document).on('click', '.modificar-idioma', modificarIdioma);
	//$(document).on('click', '.eliminar-requisito', eliminarRequisito);
}


function modificarIdioma(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var obj = {
		"IDIDIOMA": this.getAttribute("IDIDIOMA")
	}
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getIdioma/'+obj["IDIDIOMA"],
		dataType: "json",
		//data: obj,
		//data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			for(key in data){
				if($('#'+key).is("select"))continue;
				$('#'+key).html(data[key]);
				$('#'+key).val(data[key]);
			}
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#OBSERVACION').val(data["OBSERVACION"]);
		}
	});
	$('#detalleIdioma').removeClass('insertar');
	$('#detalleIdioma').removeClass('modificar');
	$('#tituloModal').html("Modificar Idioma");
	$('#tituloBoton').html("Modificar");
	$('#detalleIdioma').addClass('modificar');
	$('#detalleIdioma').modal('show');
}


function resetForm(){
	$("input.form-control").val("");
	$(".alert").remove();
}

function modifica(data){
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDIDIOMA"]);
	$(campos[1]).html(data["NOMBRE"]);
	$(campos[2]).html(data["OBSERVACION"]);
	$('#detalleIdioma').modal('hide');
	resetForm();
}

function inserta(data){
	$('#detalleIdioma').modal('hide');
	// var fila = "<tr>";
	// for(key in data){
	// 	fila += "<td>"+data[key]+"</td>";
	// }
	// fila+= '<td style="width: 23%;padding-left: 30px;">'
	// 	//fila+= '<a class="table-link" href="ViewModificarIdioma.html?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	// 	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal?ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	// 	//fila+= '<a class="table-link danger" data-toggle="modal" href="#myModal"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	// 	//fila+= '<a  class="eliminarRequisito" data-toggle="modal" ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	// fila+= '<a class="modificar-idioma" ididioma='+data[i]["IDIDIOMA"]+'""><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	// fila += '</tr>';
	// $('#listaIdioma').append(fila);

	resetForm();

	$(document).on('click', '.modificar-idioma', modificarIdioma);
}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	obj["IDIDIOMA"]= IDIDIOMA.value;//hardcode!
	var ruta = "";
	var callback;
	
	if($('#detalleIdioma').hasClass("insertar")){
		ruta = "../../api/PD_registraIdioma";
		callback = inserta;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["OBSERVACION"] = $('#OBSERVACION').val();
	}

	if($('#detalleIdioma').hasClass("modificar")){
		ruta = "../../api/AL_modificaIdioma";
		callback = modifica;
		obj["NOMBRE"] = $('#NOMBRE').val();
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

function cargaElementos(){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getListaIdioma',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaListaIdioma
	});
}

function insertaCambiosFront(){
	$('#IDIDIOMA').html("");
	$('#detalleIdioma').removeClass('insertar');
	$('#detalleIdioma').removeClass('modificar');
	$('#tituloModal').html("Agregar Idioma");
	$('#tituloBoton').html("Agregar");
	$('#detalleIdioma').addClass('insertar');
	$('#detalleIdioma').modal('show');
}

$(document).ready(function(){

	cargaElementos();

	$("#guardar").click(guardarCambios);

	$("#cerrar").click(resetForm);

	$("#agregar").click(insertaCambiosFront);
});