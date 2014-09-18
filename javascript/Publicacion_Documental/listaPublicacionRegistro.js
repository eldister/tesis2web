var listaLecturas=[];
var seleccionGrupos2=[];
var seleccionResponsable=[];
var seleccionMiembros=[];

function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

function cargaGrupos(){

	var obj={
			IDPADRE:localStorage.getItem('idMiGrupo'),
			IDUSUARIO: getId()
			};

	$.ajax({
		type: 'POST',
		url : '../../api/PU_getListaGrupo',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			for (var i=0; i<data.length; i++) {
				$("#sel2grupo").append('<option value="' + data[i].IDGRUPO + '">' + data[i].NOMBRE + '</option>');
			}
		}
	});
}

function dameResponsable(){
	//juntando los json
	
	var data = [];

	for (var i=0; i<seleccionResponsable.length; i++) {
		data.push(seleccionResponsable[i]["id"]);
	}	
	return data;
}

function dameMiembros(){
	//juntando los json
	var data = [];

	for (var i=0; i<seleccionMiembros.length; i++) {
		data.push(seleccionMiembros[i]["id"]);
	}	
	return data;
}


function cargarListaPersonas1(){

	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Responsable").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});
}

function cargarListaPersonas2(){

	var IDUSUARIO=getId();

	$.ajax({
		type: 'GET',
		url : '../../api/AU_getListaPersonas/'+IDUSUARIO,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Miembros").append('<option value="' + obj[i].IDUSUARIO + '">' + obj[i].NOMBRE + '</option>');
			}
		}
	});
}

function guardarGrupo(){
	var obj = {};
	
	obj["IDGRUPO_PADRE"]= localStorage.getItem('idMiGrupo');
	var ruta = "";
	var callback;
	
	ruta = "../../api/AU_registraGrupo";
	obj["NOMBRES"] = $('#NOMBRES').val();
	obj["FECHA_CREACION"] = $('#FECHA_CREACION').val();
	obj["DESCRIPCION"] = $('#DESCRIPCION').val();	

	var parent= [];

	if(!validarGrupo2(dameResponsable(),dameMiembros())){
		return;
	}

	parent.push(dameResponsable());
	parent.push(dameMiembros());

	var obj2 = $.extend({},obj,parent);

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			$('#detalleGrupo').modal('hide');
			$("#sel2grupo").append('<option value="' + data.IDGRUPO + '">' + data.NOMBRE + '</option>');
		}
	});
}

function borrarCampos(){
	$("#PALABRACLAVE").val('');
	$("#notasLectura").empty();
	$("#OBSERVACIONES").val('');
	$('#listaPublicaciones').empty();
	$('#criterioBusqueda2').val('');
	indiceNota=1;
	indice=null;
	addNotaLectura();
}

var index=0;
function agregarFila(){
	var boton = $("#tituloBoton").html();

	if(boton==="Agregar"){

		var checkedradio = $('[name="radio"]:radio:checked').val();

		if(!validarAgregarLectura(checkedradio)){			
			return;
		}

		var idpub = checkedradio;
		var titulo = $("#listaPublicaciones tr#fila-"+checkedradio+" td.titulo").html();
		var tipo = $("#listaPublicaciones tr#fila-"+checkedradio+" td.tipo").html();
		var idioma = $("#listaPublicaciones tr#fila-"+checkedradio+" td.idioma").html();
		var autores = $("#listaPublicaciones tr#fila-"+checkedradio+" td.autores").html();
		var palabrasclave = $("#PALABRACLAVE").val();
		//var notaslectura = $("#NOTASLECTURA").val();
		var observaciones = $("#OBSERVACIONES").val();

		var notasLectura =[];
		for (var i = 0; i < indiceNota-1; i++) {
			var ind = i+1;
			var objNota={contenido:$("#NOTASLECTURA-"+ind+"").val()};
			notasLectura.push(objNota);
		};

		var fila = '<tr id=f-'+index+'><td class="text-center title">'+titulo+'</td><td class="text-center palcla">'+palabrasclave+'</td>';
	    fila += '<td class="text-center autors">'+autores+'</td><td style="width: 12%;padding-left: 30px;">';
		fila +=	'<a class="modificar-lectura table-link" idpublicacion='+index+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila +=	'<a class="eliminar-lectura table-link danger" idpublicacion='+index+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila +=	'</td></tr>';

		$('#listaLecturas').append(fila);

		objLectura = {index:index,
					  idpublicacion:idpub,
			          titulo:titulo,
			          palabrasclave:palabrasclave,
			          notaslectura:notasLectura,
			          observaciones:observaciones,
			          autores:autores			       
			      	  };
	    index +=1;
		listaLecturas.push(objLectura);
		console.log(listaLecturas);
	}
	else{

		/*if(!validarModificarLectura()){			
			return;
		}*/

		var idpub=indice[0].index;
		$("#listaLecturas tr#f-"+idpub+" td.palcla").html($("#PALABRACLAVE").val());
		
		$.each(listaLecturas, function() {
		    if (this.index === idpub) {
		        this.palabrasclave=$("#PALABRACLAVE").val();
		        var notasLectura =[];
				for (var i = 0; i < $("#notasLectura > div").length; i++) {
					var ind = i+1;
					var objNota={contenido:$("#NOTASLECTURA-"+ind+"").val()};
					notasLectura.push(objNota);
				};
		        this.notaslectura=notasLectura;
		        this.observaciones=$("#OBSERVACIONES").val();
		    }
		});	
		console.log(listaLecturas);	
	}

	borrarCampos();
	$('#agregarElemento').modal('hide');

}

function llenaTabla(data){
	if(data.length>0){
		for(var i=0; i < data.length ; i++){
			var fila = '<tr id=fila-'+ data[i]["IDPUBLICACION"] +'>';
			fila +='<td style="display:none;">';
			fila += '<td class="text-center titulo">'+data[i]["TITULO"]+'</td>';		
			fila += '<td class="text-center tipo">'+data[i]["TIPO"]+'</td>';
			fila += '<td class="text-center idioma">'+data[i]["IDIOMA"]+'</td>';
			fila += '<td class="text-center autores">'+data[i]["AUTORES"]+'</td>';
			fila += '<td class="text-center"><input id="opcion'+data[i]["IDPUBLICACION"]+'" type="radio" name="radio" value="'+data[i]["IDPUBLICACION"]+'"></td>'	
			fila += '</tr>';
			$('#listaPublicaciones').append(fila);
			$('#listaPublicaciones').trigger("update");		
		}
	}
	else{
		$('#tabla').hide();
		$('#listaPublicaciones').trigger("update");
		$('#pager').hide();	
	}	
}

function realizarBusqueda(){
	var obj={criterio:$('#criterioBusqueda2').val()};

	$.ajax({
		type: 'POST',
		url : '../../api/PD_buscarPublicacion',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			llenaTabla(data);
		}
	});
}

function detectaBuscar(){
	
	$('#criterioBusqueda2').bind("enterKey",function(e){
		$('#tabla').show();
		$('#pager').show();	
		$('#listaPublicaciones').empty();
		$('#listaPublicaciones').trigger("update");
		realizarBusqueda();
	});
	$('#criterioBusqueda2').keyup(function(e){
		if(e.keyCode == 13)
		{
		  $(this).trigger("enterKey");
		}
	});
}

var indice;
function modificarLectura(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idp=this.getAttribute("idpublicacion");
	
	$('#headerElemento').hide();
	$('#bodyElemento').hide();
	$('#agregarElemento').modal('show');

	$('#tituloBoton').html('Modificar');

	indice =  $.grep(listaLecturas, function(e){ return e.index == idp; });

	$("#notasLectura").empty();
	$("#PALABRACLAVE").val(indice[0].palabrasclave);

	//$("#NOTASLECTURA").val(indice[0].notaslectura);
	for (var i = 0; i < indice[0].notaslectura.length; i++) {
		addNotaLecturaModificar(i+1,indice[0].notaslectura[i]);
	};
	indiceNota=indice[0].notaslectura.length+1;
	$("#OBSERVACIONES").val(indice[0].observaciones);
}

function eliminarLectura(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var idp=this.getAttribute("idpublicacion");

	$('#f-'+idp+'').remove();

	for(var i = listaLecturas.length - 1; i >= 0; i--) {
	    if(listaLecturas[i].index == idp) {
	       listaLecturas.splice(i, 1);
	       break;
	    }
	}
}

function guardarCambios(){

	var answer = confirm("¿Desea modificar la lista de publicación? Se enviará un correo a los miembros de los grupos seleccionados")
	if (answer){
		var grupos=[];
		var ob;
		for (var i=0; i<seleccionGrupos.length; i++) {
			ob={id:seleccionGrupos[i]["id"]};
			grupos.push(ob);
		}

		var obj={tema:$('#Tema').val(),
				 lecturas:listaLecturas,
				 grupos:grupos
			};

		if(!validarListaPublicacion(grupos,listaLecturas)){
			return;
		}

		$.ajax({
			type: 'POST',
			url : "../../api/PD_registraListaPublicacion",
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(data){
				if(data["status"]===1){
					alert("Lista agregada correctamente");
					window.location.href='ViewGestionListaPublicacion.html';
				}	
				else{
					alert("Hubo un error en el proceso, intente nuevamente");
					window.location.href='ViewGestionListaPublicacion.html';
				}		
			}
		});
	}
}

var seleccionGrupos=[];
var test3 = $('#sel2grupo');
$(test3).change(function() {
    seleccionGrupos = ($(test3).select2('data'));
});

var test4 = $('#sel2Grupo2');
$(test4).change(function() {
    seleccionGrupos2 = ($(test4).select2('data'));
});

var test5 = $('#sel2Responsable');
$(test5).change(function() {
    seleccionResponsable = ($(test5).select2('data'));
});

var test6 = $('#sel2Miembros');
$(test6).change(function() {
    seleccionMiembros = ($(test6).select2('data'));
});

function iniciarNiceSelectBoxes(){
	$('#sel2grupo').select2({
		placeholder: 'Seleccione un grupo',
		allowClear: true
	});

	$('#sel2Grupo2').select2({
		placeholder: 'Seleccione un grupo',
		allowClear: true
	});

	$('#sel2Responsable').select2({
		placeholder: 'Seleccione un responsable',
		maximumSelectionSize: 1,
		allowClear: true
	});

	$('#sel2Miembros').select2({
		placeholder: 'Seleccione miembros para el grupo',
		allowClear: true
	});

	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val() });
       $("#pager").hide();
       $('#tabla').hide();
}

function cambiarTituloBoton(){
	borrarCampos();
	clearErrors();
	$('#tituloBoton').html('Agregar');
	$('#headerElemento').show();
	$('#bodyElemento').show();
	$("#pager").hide();
    $('#tabla').hide();
}

function addNotaLecturaModificar(indice,nota){
	var fila ='<br><div class="input-group" id="nota-'+indice+'">';
	fila += '<span class="input-group-addon"><i class="fa fa-edit"></i></span>';
	fila += '<textarea type="NOTASLECTURA" class="form-control" id="NOTASLECTURA-'+indice+'" rows="2">';
	fila += nota.contenido;
	fila += '</textarea></div>';

	$('#notasLectura').append(fila);
}

function addNotaLectura(){

	var fila ='<br><div class="input-group" id="nota-'+indiceNota+'">';
	fila += '<span class="input-group-addon"><i class="fa fa-edit"></i></span>';
	fila += '<textarea type="NOTASLECTURA" class="form-control" id="NOTASLECTURA-'+indiceNota+'" rows="2"></textarea>';
	fila += '</div>';
	indiceNota+=1;
	$('#notasLectura').append(fila);
}

var indiceNota = 1;
$(document).ready(function(){
	iniciarNiceSelectBoxes();
	cargaGrupos();
	detectaBuscar();
	addNotaLectura(indiceNota);
	cargarListaPersonas1();
	cargarListaPersonas2();
	$("#guardarLectura").click(agregarFila);
	$("#guardar").click(guardarCambios);
	$("#agregar").click(cambiarTituloBoton);
	$("#agregarNota").click(addNotaLectura);
	$("#guardarGrupo").click(guardarGrupo);
	$(document).on('click', '.modificar-lectura', modificarLectura);
	$(document).on('click', '.eliminar-lectura', eliminarLectura);
});