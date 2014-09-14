
var seleccionResponsable=[];

var test = $('#sel2Multi1');
$(test).change(function() {
    seleccionResponsable = $(test).select2('data');
    dameResponsable();
});


function dameResponsable(){
	//juntando los json
	
	var data = [];

	for (var i=0; i<seleccionResponsable.length; i++) {
		data.push(seleccionResponsable[i]["id"]);
	}
	
	console.log(data);
	console.log(JSON.stringify(data));
	return data;
}



function cargaListaAutor(data){
	
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDAUTOR"] +'>';
		for(key in data[i]){
				if(key==="IDAUTOR"){
					fila+='<td style="display:none;">'
				}
				else if(key==="PAGINA_WEB"){
					fila+='<td style="display:none;">'
				}
				else
				fila += '<td class="text-center">'+data[i][key]+'</td>';
		}

		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a  class="ver-autor table-link " IDAUTOR='+data[i]["IDAUTOR"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  class="modificar-autor table-link " IDAUTOR='+data[i]["IDAUTOR"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a  class="eliminar-autor table-link danger" IDAUTOR='+data[i]["IDAUTOR"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';


		fila += '</td></tr>';
		$('#listaAutor').append(fila);
		$('#listaAutor').trigger("update");
	}
	$(document).on('click', '.ver-autor', verAutor);
	$(document).on('click', '.modificar-autor', modificarAutor);
	$(document).on('click', '.eliminar-autor', eliminarAutor);
}

function verAutor(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var obj = {
		"IDAUTOR": this.getAttribute("IDAUTOR")
	}
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getAutorN/'+obj["IDAUTOR"],
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#NOM_APE').val(data["NOM_APE"]);
			$('#PAGINA_WEB').val(data["PAGINA_WEB"]);
			$('#INSTITUCION').val(data["NOMBRE_INSTITUCION"]);
			$('#TRABAJO').val(data["TRABAJO"]);
		}
	});
	$('#NOMBRE').prop('readOnly',true);
	$('#NOM_APE').prop('readOnly',true);
	$('#PAGINA_WEB').prop('readOnly',true);
	$('#INSTITUCION').prop('readOnly',true);
	$('#TRABAJO').prop('readOnly',true);
	$('#detalleAutor').removeClass('insertar');
	$('#detalleAutor').removeClass('ver');
	$('#detalleAutor').removeClass('modificar');
	$('#detalleAutor').removeClass('eliminar');
	$('#tituloModal').html('Ver Autor');
	$('#guardar').hide();
	$('#detalleAutor').addClass('modificar');
	$('#detalleAutor').modal('show');
}


function modificarAutor(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var obj = {
		"IDAUTOR": this.getAttribute("IDAUTOR")
	}
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getAutorM/'+obj["IDAUTOR"],
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDAUTOR2').val(obj["IDAUTOR"]);
			$('#NOMBRE2').val(data["NOMBRE"]);
			$('#NOM_APE2').val(data["NOM_APE"]);
			$('#PAGINA_WEB2').val(data["PAGINA_WEB"]);
			//$('#INSTITUCION').val(data["INSTITUCION"]);
			$('#TRABAJO2').val(data["TRABAJO"]);


			var responsable = $("#sel2Multi1").select2("val");
			var lista1=data["IDINSTITUCION"];

	    	//for (var i=0; i<lista1.length; i++) {
				responsable.push(lista1);
	    	//}
	    	$("#sel2Multi1").select2("val", responsable);
			seleccionResponsable = $("#sel2Multi1").select2("data");

		}
	});

	$('#detalleAutor2').removeClass('insertar');
	$('#detalleAutor2').removeClass('modificar');
	$('#detalleAutor2').removeClass('eliminar');
	$('#tituloModal2').html("Modificar Autor");
	$('#tituloBoton2').html("Modificar");
	$('#detalleAutor2').addClass('modificar');
	$('#detalleAutor2').modal('show');
}


function resetForm(){
	$('#NOM_APE').prop('readOnly',false);
	$('#PAGINA_WEB').prop('readOnly',false);
	$('#INSTITUCION').prop('readOnly',false);
	$('#TRABAJO').prop('readOnly',false);
	$('#guardar').show();
	$("input.form-control").val("");
	$(".alert").remove();
	clearErrors();
}


function inserta(data){
	alert("El autor fue creado correctamente");
	clearErrors();
	$('#detalleAutor').modal('hide');
	var fila = '<tr id=fila-'+ data[0]["IDAUTOR"] +'>'; 
	fila +='<td style="display:none;">'
	fila += '<td class="text-center">'+data[1]["NOM_APE"]+'</td>';
	fila += '<td class="text-center">'+data[2]["INSTITUCION"]+'</td>';
	fila += '<td class="text-center">'+data[3]["TRABAJO"]+'</td>';

	fila+= '<td style="width: 23%;padding-left: 30px;">'
	fila+= '<a  class="ver-autor table-link " IDAUTOR='+data[0]["IDAUTOR"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a>';
	fila+= '<a class="modificar-autor table-link" IDAUTOR='+data[0]["IDAUTOR"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
	fila+= '<a  class="eliminar-autor table-link danger" IDAUTOR='+data[0]["IDAUTOR"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
	fila += '</tr>';
	$('#listaAutor').append(fila);

	resetForm();
	$(document).on('click', '.ver-autor', verAutor);
	$(document).on('click', '.modificar-autor', modificarAutor);
	$(document).on('click', '.eliminar-autor', eliminarAutor);
}

function eliminarAutor(){
	clearErrors();
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var obj = {
		"IDAUTOR": this.getAttribute("IDAUTOR")
	}
	$.ajax({
		type: 'GET',
		url : '../../api/PD_getAutorN/'+obj["IDAUTOR"],
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#IDAUTOR').val(obj["IDAUTOR"]);
			$('#NOMBRE').val(data["NOMBRE"]);
			$('#NOM_APE').val(data["NOM_APE"]);
			$('#PAGINA_WEB').val(data["PAGINA_WEB"]);
			$('#INSTITUCION').val(data["NOMBRE_INSTITUCION"]);
			$('#TRABAJO').val(data["TRABAJO"]);
		}
	});
	$('#NOMBRE').prop('readOnly',true);
	$('#NOM_APE').prop('readOnly',true);
	$('#PAGINA_WEB').prop('readOnly',true);
	$('#INSTITUCION').prop('readOnly',true);
	$('#TRABAJO').prop('readOnly',true);
	$('#detalleAutor').removeClass('insertar');
	$('#detalleAutor').removeClass('modificar');
	$('#detalleAutor').removeClass('eliminar');
	$('#tituloModal').html("Eliminar Autor");
	$('#tituloBoton').html("Eliminar");
	$('#detalleAutor').addClass('eliminar');
	$('#detalleAutor').modal('show');
}

function elimina(data){
	alert("El autor fue eliminado correctamente");	
	$('#detalleAutor').modal('hide');	
	resetForm();
	$('#fila-'+data[0]["IDAUTOR"]+'').remove();
	$('#listaAutor').trigger("update");

	return false;
}

function modifica(data){
	alert("Los datos del autor fueron modificados correctamente");
	var fila = $(".selected")[0];
	var campos = $(fila).children();
	$(campos[0]).html(data["IDAUTOR"]);
	$(campos[1]).html(data["NOM_APE"]);
	//$(campos[2]).html(data["PAGINA_WEB"]);
	$(campos[2]).html(data["INSTITUCION"]);
	$(campos[3]).html(data["TRABAJO"]);
	$('#detalleAutor').modal('hide');
	$('#listaAutor').trigger("update");

	resetForm();
}

function modificar_datos_autor(){

	var data = $(".form-control");
	var obj = {};
	
	obj["IDAUTOR"]= $('#IDAUTOR2').val();//hardcode!
	var ruta = "";

	obj["NOMBRE"] = $('#NOMBRE2').val();
	obj["NOM_APE"] = $('#NOM_APE2').val();
	obj["PAGINA_WEB"] = $('#PAGINA_WEB2').val();
	//obj["INSTITUCION"] = $('#INSTITUCION').val();
	obj["TRABAJO"] = $('#TRABAJO2').val();

	//var data = $(".form-control");
	//var obj = {};
	
	//obj["IDAUTOR"]= $('#IDAUTOR').val();//hardcode!
	//var ruta = ""

		var answer = confirm("Desea modificar los datos del autor ?")
		if (answer){

			if(!validarAutor3(dameResponsable())){
				return;
			}
			var parent= [];
			parent.push(dameResponsable());
			var obj2 = $.extend({},obj,parent);

			console.log(obj2);
			console.log(JSON.stringify(obj2));

			ruta = "../../api/PD_modificaAutor2";
			
		}

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		//data: obj,
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			$('#detalleAutor2').modal('hide');
			alert("Los datos del autor fueron modificados correctamente");
			window.location.href='../Publicacion_Documental/ViewListaAutores.html';
		}
	});

}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	obj["IDAUTOR"]= $('#IDAUTOR').val();//hardcode!
	var ruta = "";
	var callback;
	
	if($('#detalleAutor').hasClass("insertar")){
		var answer = confirm("Desea registar el autor ?")
		if (answer){
			ruta = "../../api/PD_registraAutor";
			callback = inserta;
			obj["NOM_APE"] = $('#NOM_APE').val();
			obj["PAGINA_WEB"] = $('#PAGINA_WEB').val();
			obj["INSTITUCION"] = $('#INSTITUCION').val();
			obj["TRABAJO"] = $('#TRABAJO').val();
		}
	}

	if($('#detalleAutor').hasClass("eliminar")){
		var answer = confirm("Desea eliminar al autor ?")
		if (answer){
			ruta = "../../api/PD_eliminaAutor";
			callback = elimina;
			obj["NOMBRE"] = $('#NOMBRE').val();
			obj["NOM_APE"] = $('#NOM_APE').val();
			obj["PAGINA_WEB"] = $('#PAGINA_WEB').val();
			obj["INSTITUCION"] = $('#INSTITUCION').val();
			obj["TRABAJO"] = $('#TRABAJO').val();
		}
	}

	if(!validarAutor()) return;

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
		url : '../../api/PD_getListaAutor',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: cargaListaAutor
	});
}

function insertaCambiosFront(){
	clearErrors();
	$('#IDAUTOR').html("");
	$('#detalleAutor').removeClass('insertar');
	$('#detalleAutor').removeClass('eliminar');
	$('#detalleAutor').removeClass('modificar');
	$('#tituloModal').html("Agregar Autor");
	$('#tituloBoton').html("Agregar");
	$('#detalleAutor').addClass('insertar');
	$('#detalleAutor').modal('show');

}

function initTableSorter(){
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val()});
}


function cargarListaPersonas1(){

	//var IDUSUARIO=getId();
		var obj = {};
		//obj["IDUSUARIO"]=IDUSUARIO;
		//obj["IDGRUPO"]=getUrlParameters("id","",true);


		$.ajax({
			type: 'POST',
			url : '../../api/PD_listaInstitucion',
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(obj){
				for (var i=0; i<obj.length; i++) {
					$("#sel2Multi1").append('<option value="' + obj[i].IDINSTITUCION + '">' + obj[i].NOMBRE_INSTITUCION + '</option>');
				}
			}
		});
}

function iniciarNiceSelectBoxes(){
	
	$('#sel2Multi1').select2({
		placeholder: 'Seleccione solo una institucion',
		maximumSelectionSize: 1,
		allowClear: true
	});
}

function cerrar2(){
	//$('#sel2Multi1').children().removeProp('selected');
	$('#sel2Multi1').empty();
	cargarListaPersonas1();
}

$(document).ready(function(){
	iniciarNiceSelectBoxes();
	initTableSorter();	
	cargaElementos();
	cargarListaPersonas1();

	$("#guardar").click(guardarCambios);

	$("#cerrar").click(resetForm);

	$("#agregar").click(insertaCambiosFront);

	$('#cerrar2').click(cerrar2);

	$("#guardar2").click(modificar_datos_autor);
});