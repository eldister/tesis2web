
function cargaListaInstitucion(data){
	
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDINSTITUCION"] +'>';
		for(key in data[i]){
				if(key==="IDINSTITUCION"){
					fila+='<td style="display:none;">'
				}
				else
				fila += '<td class="text-center">'+data[i][key]+'</td>';
		}

		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a  class="modificar-institucion table-link " IDINSTITUCION='+data[i]["IDINSTITUCION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  class="eliminar-institucion table-link danger" IDINSTITUCION='+data[i]["IDINSTITUCION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';


		fila += '</td></tr>';
		$('#listaInstitucion').append(fila);
		$('#listaInstitucion').trigger("update");		
	}
	$(document).on('click', '.modificar-institucion', modificarInstitucion);
	$(document).on('click', '.eliminar-institucion', eliminarInstitucion);
}

function modificarInstitucion(){


		clearErrors();
		$(".selected").removeClass("selected");
		$(this).parent().parent().addClass("selected");
		var obj = {
			"IDINSTITUCION": this.getAttribute("IDINSTITUCION")
		}
		$.ajax({
			type: 'GET',
			url : '../../api/AU_getInstitucion/'+obj["IDINSTITUCION"],
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			success: function(data){
				$('#IDINSTITUCION').val(obj["IDINSTITUCION"]);
				$('#NOMBRE_INSTITUCION').val(data["NOMBRE_INSTITUCION"]);
				$('#DESCRIPCION').val(data["DESCRIPCION"]);
			}
		});
		$('#detalleInstitucion').removeClass('insertar');
		$('#detalleInstitucion').removeClass('modificar');
		$('#detalleInstitucion').removeClass('eliminar');
		$('#tituloModal').html("Modificar Institucion");
		$('#tituloBoton').html("Modificar");
		$('#detalleInstitucion').addClass('modificar');
		$('#detalleInstitucion').modal('show');
	
}


function resetForm(){
	$('#NOMBRE_INSTITUCION').prop('readOnly',false);
	$('#DESCRIPCION').prop('readOnly',false);
	$("input.form-control").val("");
	$(".alert").remove();
	clearErrors();
}


function inserta(data){
		alert("La institucion fue ingresa correctamente");
		clearErrors();
		$('#detalleInstitucion').modal('hide');
		var fila = '<tr id=fila-'+ data[0]["IDINSTITUCION"] +'>'; 
		fila +='<td style="display:none;">'
		fila += '<td class="text-center">'+data[1]["NOMBRE_INSTITUCION"]+'</td>';
		fila += '<td class="text-center">'+data[2]["DESCRIPCION"]+'</td>';

		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a class="modificar-institucion table-link" IDINSTITUCION='+data[0]["IDINSTITUCION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  class="eliminar-institucion table-link danger" IDINSTITUCION='+data[0]["IDINSTITUCION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</tr>';
		$('#listaInstitucion').append(fila);

		resetForm();
		$(document).on('click', '.modificar-institucion', modificarInstitucion);
		$(document).on('click', '.eliminar-institucion', eliminarInstitucion);
	
}

function eliminarInstitucion(){


	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var obj = {
		"IDINSTITUCION": this.getAttribute("IDINSTITUCION")
	}
	$.ajax({
		type: 'GET',
		url : '../../api/AU_getInstitucion/'+obj["IDINSTITUCION"],
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDINSTITUCION').val(obj["IDINSTITUCION"]);
			$('#NOMBRE_INSTITUCION').val(data["NOMBRE_INSTITUCION"]);
			$('#DESCRIPCION').val(data["DESCRIPCION"]);
		}
	});
	$('#NOMBRE_INSTITUCION').prop('readOnly',true);
	$('#DESCRIPCION').prop('readOnly',true);
	$('#detalleInstitucion').removeClass('insertar');
	$('#detalleInstitucion').removeClass('modificar');
	$('#detalleInstitucion').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Institucion");
	$('#tituloBoton').html("Eliminar");
	$('#detalleInstitucion').addClass('eliminar');
	$('#detalleInstitucion').modal('show');
}

function elimina(data){
	alert("La institucion fue eliminada correctamente");
	$('#detalleInstitucion').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDINSTITUCION"]+'').remove();
	return false;
}

function modifica(data){
	alert("La institucion fue modificada correctamente");
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDINSTITUCION"]);
	$(campos[1]).html(data["NOMBRE_INSTITUCION"]);
	$(campos[2]).html(data["DESCRIPCION"]);
	$('#detalleInstitucion').modal('hide');
	resetForm();
}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	obj["IDINSTITUCION"]= $('#IDINSTITUCION').val();//hardcode!
	var ruta = "";
	var callback;
	
	if($('#detalleInstitucion').hasClass("insertar")){
		var answer = confirm("Desea agregar la institucion?")
		if (answer){
			ruta = "../../api/AU_registraInstitucion";
			callback = inserta;
			obj["NOMBRE_INSTITUCION"] = $('#NOMBRE_INSTITUCION').val();
			obj["DESCRIPCION"] = $('#DESCRIPCION').val();
		}
	}

	if($('#detalleInstitucion').hasClass("modificar")){
		var answer = confirm("Desea modificar la institucion?")
		if (answer){
			ruta = "../../api/AU_modificaInstitucion";
			callback = modifica;
			obj["NOMBRE_INSTITUCION"] = $('#NOMBRE_INSTITUCION').val();
			obj["DESCRIPCION"] = $('#DESCRIPCION').val();
		}
	}

	if($('#detalleInstitucion').hasClass("eliminar")){
		var answer = confirm("Desea eliminar la institucion?")
		if (answer){
			ruta = "../../api/AU_eliminaInstitucion";
			callback = elimina;
			obj["NOMBRE_INSTITUCION"] = $('#NOMBRE_INSTITUCION').val();
			obj["DESCRIPCION"] = $('#DESCRIPCION').val();
		}
	}

	if(!validarInstitucion()) return;

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
		url : '../../api/AU_getListaInstitucion',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaListaInstitucion
	});
}

function insertaCambiosFront(){
	$('#IDINSTITUCION').html("");
	$('#detalleInstitucion').removeClass('insertar');
	$('#detalleInstitucion').removeClass('eliminar');
	$('#detalleInstitucion').removeClass('modificar');
	$('#tituloModal').html("Agregar Institucion");
	$('#tituloBoton').html("Agregar");
	$('#detalleInstitucion').addClass('insertar');
	$('#detalleInstitucion').modal('show');

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