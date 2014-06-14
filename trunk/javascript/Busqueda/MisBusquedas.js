
function cargaListaBusqueda(data){
	
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDBUSQUEDA"] +'>';
		for(key in data[i]){
				if(key==="IDBUSQUEDA"){
					fila+='<td style="display:none;">'
				}
				else
				fila += '<td class="text-center">'+data[i][key]+'</td>';
		}

		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a  class="ver-busqueda table-link " IDBUSQUEDA='+data[i]["IDBUSQUEDA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  class="eliminar-busqueda table-link danger" IDBUSQUEDA='+data[i]["IDBUSQUEDA"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';


		fila += '</td></tr>';
		$('#listaBusqueda').append(fila);
	}
	$(document).on('click', '.ver-busqueda', verBusqueda);
	$(document).on('click', '.eliminar-busqueda', eliminarBusqueda);
}

function eliminarBusqueda(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDBUSQUEDA=this.getAttribute("IDBUSQUEDA");
	var obj={};
	obj["IDBUSQUEDA"]= IDBUSQUEDA;

	var answer = confirm("Desea eliminar la busqueda?")
	if (answer){

		$.ajax({
			type: 'GET',
			url : '../../api/BQ_eliminaMiBusqueda/'+obj["IDBUSQUEDA"],
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			success: function(data){
				window.location.href='../Busqueda/ViewMisBusquedas.html';
				$('#fila-'+IDBUSQUEDA+'').remove();
				alert("La busqueda se elimino correctamente");
			}
		});
	}
}

function verBusqueda(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDBUSQUEDA=this.getAttribute("IDBUSQUEDA");
	var obj={};
	obj["IDBUSQUEDA"]= IDBUSQUEDA;

	window.location.href = "../Publicacion_Documental/ViewBusquedaAsistida.html?id=" + IDBUSQUEDA;
}

/*function modificarInstitucion(){
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
}


function inserta(data){

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



function elimina(data){
	$('#detalleInstitucion').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDINSTITUCION"]+'').remove();
	return false;
}

function modifica(data){
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
		ruta = "../../api/AU_registraInstitucion";
		callback = inserta;
		obj["NOMBRE_INSTITUCION"] = $('#NOMBRE_INSTITUCION').val();
		obj["DESCRIPCION"] = $('#DESCRIPCION').val();
	}

	if($('#detalleInstitucion').hasClass("modificar")){
		ruta = "../../api/AU_modificaInstitucion";
		callback = modifica;
		obj["NOMBRE_INSTITUCION"] = $('#NOMBRE_INSTITUCION').val();
		obj["DESCRIPCION"] = $('#DESCRIPCION').val();
	}

	if($('#detalleInstitucion').hasClass("eliminar")){
		ruta = "../../api/AU_eliminaInstitucion";
		callback = elimina;
		obj["NOMBRE_INSTITUCION"] = $('#NOMBRE_INSTITUCION').val();
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


function insertaCambiosFront(){
	$('#IDINSTITUCION').html("");
	$('#detalleInstitucion').removeClass('insertar');
	$('#detalleInstitucion').removeClass('eliminar');
	$('#detalleInstitucion').removeClass('modificar');
	$('#tituloModal').html("Agregar Institucion");
	$('#tituloBoton').html("Agregar");
	$('#detalleInstitucion').addClass('insertar');
	$('#detalleInstitucion').modal('show');

}*/

function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

function cargaElementos(){

	var obj = {};
	
	obj["IDUSUARIO"] = getId();

	$.ajax({
		type: 'POST',
		url : '../../api/BQ_getListaMisBusquedas',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: cargaListaBusqueda
	});
}



$(document).ready(function(){

	cargaElementos();

	//$("#guardar").click(guardarCambios);

	//$("#cerrar").click(resetForm);

	//$("#agregar").click(insertaCambiosFront);
});