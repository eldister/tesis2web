
function cargaListaIdioma(data){
	
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDIDIOMA"] +'>';
		for(key in data[i]){
				if(key==="IDIDIOMA"){
					fila+='<td style="display:none;">'
				}
				else
				fila += '<td class="text-center">'+data[i][key]+'</td>';
		}

		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a  class="modificar-idioma table-link" ididioma='+data[i]["IDIDIOMA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  class="eliminar-idioma table-link danger" ididioma='+data[i]["IDIDIOMA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';


		fila += '</td></tr>';
		$('#listaIdioma').append(fila);
		$('#listaIdioma').trigger("update");
	}
	$(document).on('click', '.modificar-idioma', modificarIdioma);
	$(document).on('click', '.eliminar-idioma', eliminarIdioma);
}


function modificarIdioma(){
	clearErrors();
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
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#OBSERVACION').val(data["OBSERVACION"]);
		}
	});
	$('#detalleIdioma').removeClass('insertar');
	$('#detalleIdioma').removeClass('modificar');
	$('#detalleIdioma').removeClass('eliminar');
	$('#tituloModal').html("Modificar Idioma");
	$('#tituloBoton').html("Modificar");
	$('#detalleIdioma').addClass('modificar');
	$('#detalleIdioma').modal('show');
}


function resetForm(){
	$('#OBSERVACION').prop('readOnly',false)
	$('#NOMBRE').prop('readOnly',false)
	$("input.form-control").val("");
	$(".alert").remove();
	clearErrors();
}


function inserta(data){
	clearErrors();
	$('#detalleIdioma').modal('hide');
	var fila = '<tr id=fila-'+ data[0]["IDIDIOMA"] +'>'; //TENGO EL PARCHE XD PA K DURE INFINITO
	fila+='<td style="display:none;">'
	fila += '<td class="text-center">'+data[1]["NOMBRE"]+'</td>';
	fila += '<td class="text-center">'+data[2]["OBSERVACION"]+'</td>';

	fila+= '<td style="width: 23%;padding-left: 30px;">'
	fila+= '<a class="modificar-idioma table-link" ididioma='+data[0]["IDIDIOMA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	fila+= '<a  class="eliminar-idioma table-link danger" ididioma='+data[0]["IDIDIOMA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	fila += '</tr>';
	$('#listaIdioma').append(fila);

	resetForm();

	$(document).on('click', '.modificar-idioma', modificarIdioma);
	$(document).on('click', '.eliminar-idioma', eliminarIdioma);
}

function eliminarIdioma(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDIDIOMA=this.getAttribute("IDIDIOMA");
	var obj;

	$.ajax({
		type: 'GET',
		url : '../../api/PD_getIdioma/'+ IDIDIOMA,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){

			$('#IDIDIOMA').val(IDIDIOMA);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#OBSERVACION').val(data["OBSERVACION"]);
		}
	});
	$('#NOMBRE').prop('readOnly',true);
	$('#OBSERVACION').prop('readOnly',true);
	$('#detalleIdioma').removeClass('insertar');
	$('#detalleIdioma').removeClass('modificar');
	$('#detalleIdioma').removeClass('eliminar');
	$('#tituloBoton').html("Eliminar");
	$('#tituloModal').html("Eliminar Idioma");
	$('#detalleIdioma').addClass('eliminar');
	$('#detalleIdioma').modal('show');
}

function elimina(data){
	$('#detalleIdioma').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDIDIOMA"]+'').remove();
	$('#listaIdioma').trigger("update");

	return false;
}

function modifica(data){
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDIDIOMA"]);
	$(campos[1]).html(data["NOMBRE"]);
	$(campos[2]).html(data["OBSERVACION"]);
	$('#detalleIdioma').modal('hide');
	$('#listaIdioma').trigger("update");

	resetForm();
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
		ruta = "../../api/PD_modificaIdioma";
		callback = modifica;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["OBSERVACION"] = $('#OBSERVACION').val();
	}

	if($('#detalleIdioma').hasClass("eliminar")){
		ruta = "../../api/PD_eliminaIdioma";
		callback = elimina;
		obj["NOMBRE"] = $('#NOMBRE').val();
		obj["OBSERVACION"] = $('#OBSERVACION').val();
	}

	if(!validarIdioma()) return;

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
	clearErrors();
	$('#IDIDIOMA').html("");
	$('#detalleIdioma').removeClass('insertar');
	$('#detalleIdioma').removeClass('eliminar');
	$('#detalleIdioma').removeClass('modificar');
	$('#tituloModal').html("Agregar Idioma");
	$('#tituloBoton').html("Agregar");
	$('#detalleIdioma').addClass('insertar');
	$('#detalleIdioma').modal('show');

}

function initTableSorter(){
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val()});
}

$(document).ready(function(){
	initTableSorter();	
	cargaElementos();

	$("#guardar").click(guardarCambios);

	$("#cerrar").click(resetForm);

	$("#agregar").click(insertaCambiosFront);
});