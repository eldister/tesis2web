function cargaElementos(data,ididioma){
	$('#listaEtiqueta').empty();
	for(var i=0; i < data.length ; i++){
		if(ididioma===data[i]["IDIDIOMA"]){
			var fila = '<tr id=fila-'+ data[i]["IDETIQUETA"] +'>';
			fila +='<td style="display:none;">';
			fila += '<td class="text-center">'+data[i]["NOMBRE"]+'</td>';
			fila += '<td class="text-center">'+data[i]["IDIOMA"]+'</td>';
			fila+= '<td style="width: 23%;padding-left: 30px;">'
			fila+= '<a class="modificar-etiqueta table-link" idetiqueta='+data[i]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
			fila+= '<a class="eliminar-etiqueta table-link danger" idetiqueta='+data[i]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
			fila += '</td></tr>';
			$('#listaEtiqueta').append(fila);
			$('#listaEtiqueta').trigger("update");
		}
	}

	$(document).on('click', '.modificar-etiqueta', modificarEtiqueta);
	$(document).on('click', '.eliminar-etiqueta', eliminarEtiqueta);
}

function inserta(data){
	clearErrors();
	$('#detalleEtiqueta').modal('hide');
	/*for (var i = 0; i < data.length; i++) {
		var fila = '<tr id=fila-'+ data[i]["IDETIQUETA"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["NOMBRE"]+'</td>';
		fila += '<td class="text-center">'+data[i]["IDIOMA"]+'</td>';
		fila += '<td style="width: 23%;padding-left: 30px;">'
		fila += '<a class="modificar-etiqueta table-link" idetiqueta='+data[i]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila += '<a class="eliminar-etiqueta table-link danger" idetiqueta='+data[i]["IDETIQUETA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</tr>';
		$('#listaEtiqueta').append(fila);
		$('#listaEtiqueta').trigger("update");
	};*/
	cargaListaEtiqueta(ididioma);	
	resetForm();
	$(document).on('click', '.modificar-etiqueta', modificarEtiqueta);
	$(document).on('click', '.eliminar-etiqueta', eliminarEtiqueta);
}


function eliminarEtiqueta(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("idetiqueta");
	var obj;
	$('#bodyEtiquetas').empty();
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getEtiqueta/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#bodyEtiquetas').empty();

			var fila = '<h5>La eliminación de esta etiqueta implica su eliminación en todos los demás idiomas, ¿desea continuar?</h5>'
			$('#bodyEtiquetas').append(fila);
			idetiqueta = data["IDETIQUETA"];
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

var nombreEtiqueta;
var idetiqueta;
function modificarEtiqueta(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idtipo=this.getAttribute("idetiqueta");
	var obj;
	$('#bodyEtiquetas').empty();
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getEtiqueta/'+ idtipo,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			var fila ='<input type="hidden" id="IDETIQUETA" class="form-control" />';
			fila += '<span id="ididioma-'+data["IDIDIOMA"]+'">'+data["IDIOMA"]+'</span>';
			fila += '<div class="form-group"><div class="input-group"><span class="input-group-addon"><i class="fa fa-book"></i></span>';
			fila += '<input type="NOMBRE" class="form-control" id="NOMBRE-'+data["IDIDIOMA"]+'"></div></div>';
			$('#bodyEtiquetas').empty();			
			$('#bodyEtiquetas').append(fila);
			nombreEtiqueta=$('#NOMBRE-'+data["IDIDIOMA"]+'');
			$(nombreEtiqueta).val(data["NOMBRE"]);
			$('#IDETIQUETA').val(data["IDETIQUETA"]);
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
	clearErrors();
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDETIQUETA"]);
	$(campos[1]).html(data["NOMBRE"]);
	$(campos[2]).html(data["IDIOMA"]);
	$('#detalleEtiqueta').modal('hide');
	$('#listaEtiqueta').trigger("update");
	resetForm();
}

function elimina(data){
	clearErrors();
	$('#detalleEtiqueta').modal('hide');	
	resetForm();
	for (var i = 0; i < data.length; i++) {
		$('#fila-'+data[i]["IDETIQUETA"]+'').remove();
		$('#listaEtiqueta').trigger("update");
	};
}


function guardarCambios(){
	var data = $(".form-control");
	var listEtiquetas =[];
	var obj = {};

	var ruta = "";
	var callback;
	var etiquetas;


	if($('#detalleEtiqueta').hasClass("eliminar")){
		ruta = "../../api/PD_eliminaEtiqueta";
		callback = elimina;
		obj["IDETIQUETA"] =idetiqueta;

		$.ajax({
			type: 'POST',
			url : ruta,
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: callback
		});
	}

	if($('#detalleEtiqueta').hasClass("insertar")){
		ruta = "../../api/PD_registraEtiqueta";
		callback = inserta;
		for (var i=0; i<idiomas.length; i++) {
			obj = { nombre:$('#NOMBRE-'+idiomas[i].IDIDIOMA+'').val(),
					ididioma: idiomas[i].IDIDIOMA,
					idioma: idiomas[i].NOMBRE
					};
			listEtiquetas.push(obj);
		}

		if(!validarEtiqueta(idiomas)){
			return;
		}

		$.ajax({
			type: 'POST',
			url : ruta,
			dataType: "json",
			data: JSON.stringify(listEtiquetas),
			contentType: "application/json; charset=utf-8",
			success: callback
		});
	}

	if($('#detalleEtiqueta').hasClass("modificar")){
		ruta = "../../api/PD_modificaEtiqueta";
		callback = modifica;
		obj["IDETIQUETA"] = $('#IDETIQUETA').val();
		obj["NOMBRE"] = $(nombreEtiqueta).val();

		if(!validarEtiquetaInd(nombreEtiqueta)){
			return;
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
}

function cargaListaEtiqueta(ididioma){
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getListaEtiqueta',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			cargaElementos(data,ididioma);
		}
	});
}

function insertaCambiosFront(){
	clearErrors();
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

	$('#bodyEtiquetas').empty();
	armarModalBody(idiomas);
	resetForm();
}

function armarModalBody(data){

	for (var i=0; i<data.length; i++) {
		var fila ='<input type="hidden" id="IDETIQUETA" class="form-control" />';
		fila += '<span id="ididioma-'+data[i].IDIDIOMA+'">'+data[i].NOMBRE+'</span>';
		fila += '<div class="form-group"><div class="input-group"><span class="input-group-addon"><i class="fa fa-book"></i></span>';
		fila += '<input type="NOMBRE" class="form-control" id="NOMBRE-'+data[i].IDIDIOMA+'"></div></div>';
		$('#bodyEtiquetas').append(fila);
	}

}

var idiomas;
function popularSelectIdioma(){
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaIdioma',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	       $('#bodyEtiquetas').empty();		   
		   idiomas=data;
		   armarModalBody(idiomas);
		   for(obj in data){
				var opt = $("<option></option>");
				opt.val(data[obj]["IDIDIOMA"]);
				opt.html(data[obj]["NOMBRE"]);
				$("#selectIdioma").append(opt);
		    }
	    }
	});
}
var ididioma="1";
function cambioIdiomaCombo(){
	$("#selectIdioma").change(function(){
		ididioma=$(this).val();
		cargaListaEtiqueta(ididioma);
	});
}

function initTableSorter(){
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val()});
}

$(document).ready(function(){
	initTableSorter();	
	popularSelectIdioma();
	cambioIdiomaCombo();
	cargaListaEtiqueta(ididioma);
	$("#guardar").click(guardarCambios);
	$("#cerrar").click(resetForm);
	$("#agregar").click(insertaCambiosFront);
	
});