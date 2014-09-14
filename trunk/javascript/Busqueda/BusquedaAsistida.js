var listaLecturas=[];
var seleccionEtiquetas=[];


function resetForm(){
	$("input.form-control").val("");
	$(".alert").remove();
}


function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

var test = $('#sel2Multi1');
$(test).change(function() {
    seleccionEtiquetas = ($(test).select2('data')) ;
    dameEtiquetas();
});


function dameEtiquetas(){
	//juntando los json
	var data = [];

	for (var i=0; i<seleccionEtiquetas.length; i++) {
		data.push(seleccionEtiquetas[i]["id"]);
	}
	
	console.log(data);
	console.log(JSON.stringify(data));
	return data;
}


function llenaTabla(data){

	$('#CANTIDADP').html(data["CANTIDADP"]);
	$('#CANTIDADF').html(data["CANTIDADF"]);

	for(var i=0; i < data["PUBLICACIONES"].length ; i++){
		var fila = '<tr id=fila-'+ data["PUBLICACIONES"][i][i]["IDPUBLICACION"]+'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center titulo">'+data["PUBLICACIONES"][i][i]["TITULO"]+'</td>';		
		fila += '<td class="text-center tipo">'+data["PUBLICACIONES"][i][i]["DESCRIPCION"]+'</td>';
		fila += '<td class="text-center tipo">'+data["PUBLICACIONES"][i][i]["FUENTE"]+'</td>';
		fila += '<td class="text-center idioma">'+data["PUBLICACIONES"][i][i]["IDIOMA"]+'</td>';
		//fila += '<td class="text-center autores">'+data[i]["AUTORES"]+'</td>';
		fila += '<td style="width: 23%;padding-left: 100px;">'
		//fila += '<a class="ver-publicacion table-link" href="ViewVerPublicacion.html?idpublicacion='+data["PUBLICACIONES"][i][i]["IDPUBLICACION"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		fila += '<a class="ver-publicacion table-link" IDPUBLICACION='+data["PUBLICACIONES"][i][i]["IDPUBLICACION"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</tr>';
		$('#listaPublicaciones').append(fila);		
	}	

	for(var i=0; i < data["FICHAS"].length ; i++){
		var fila = '<tr id=fila-'+ data["FICHAS"][i][i]["IDFICHABIB"]+'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center titulo">'+data["FICHAS"][i][i]["ENCABEZADO"]+'</td>';		
		//fila += '<td class="text-center tipo">'+data["FICHAS"][i][i]["TITULO_ABREVIADO"]+'</td>';
		fila += '<td class="text-center tipo">'+data["FICHAS"][i][i]["NOMBRE"]+'</td>';
		//fila += '<td class="text-center idioma">'+data["FICHAS"][i][i]["IDIOMA"]+'</td>';
		//fila += '<td class="text-center autores">'+data[i]["AUTORES"]+'</td>';
		fila += '<td style="width: 23%;padding-left: 100px;">'
		//fila += '<a class="ver-publicacion table-link" href="ViewVerFicha.html?idficha='+data["FICHAS"][i][i]["IDFICHABIB"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		fila += '<a class="ver-ficha table-link" IDFICHA='+data["FICHAS"][i][i]["IDFICHABIB"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';		
		fila += '</tr>';
		$('#listaFichas').append(fila);		
	}	

	$(document).on('click', '.ver-publicacion', verPublicacion);
	$(document).on('click', '.ver-ficha', verFicha);
}

function verPublicacion(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDPUBLICACION=this.getAttribute("IDPUBLICACION");
	var obj={};


	obj["IDUSUARIO"]=getId();
	obj["IDPUBLICACION"]=IDPUBLICACION;

	$.ajax({
		type: 'POST',
		url : '../../api/BQ_guardaHistorialP',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success:{
			
		}
	});
	window.location.href = "../Publicacion_Documental/ViewVerPublicacion.html?idpublicacion="+IDPUBLICACION;
}


function verFicha(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var IDFICHA=this.getAttribute("IDFICHA");
	var obj={};


	obj["IDUSUARIO"]=getId();
	obj["IDFICHA"]=IDFICHA;

	$.ajax({
		type: 'POST',
		url : '../../api/BQ_guardaHistorialH',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			
		}
	});
	window.location.href = "../Publicacion_Documental/ViewVerFicha.html?idficha="+IDFICHA;
}

/*
function getUrlParameters(parameter, staticURL, decode){
   var currLocation = (staticURL.length)? staticURL : window.location.search,
       parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;            
        }
   }
   
   if(!returnBool) return false;  
}*/

function realizarBusqueda(){
	
	$('#listaPublicaciones').empty();	
	$('#listaFichas').empty();
	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	//obj["criterio"]=getUrlParameters("id","",true);
	var parent= [];

	if(!validarBuscar(dameEtiquetas())) return;

	parent.push(dameEtiquetas());
	var obj2 = $.extend({},obj,parent);

	$.ajax({
		type: 'POST',
		url : '../../api/BQ_buscarPublicacionAsistida',
		dataType: "json",
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			//alert("aaaaaaaaaaaaaa");
			llenaTabla(data);
		}
	});
}

function iniciarNiceSelectBoxesBQ(){
	
	$('#sel2Multi1').select2({
		placeholder: 'Seleccione al menos una etiqueta',
		allowClear: true
	});
}

function cargarListaEtiquetas(){
	
	/*$.ajax({
		type: 'GET',
	    url:'../../api/PD_getListaTipoPublicacion',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
		   for (var i=0; i<data.length; i++) {
		     $("#TIPOPUBLICACION_SELECT").append('<option value="' + data[i].IDTIPOPUBLICACION + '">' + data[i].NOMBRE + '</option>');
		   }
	    }
	});*/

	$.ajax({
		type: 'POST',
		url : '../../api/BQ_damelistaEtiquetas',
		dataType: "json",
		//data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi1").append('<option value="' + obj[i].IDETIQUETA + '">' + obj[i].NOMBRE + '</option>');
			}

		}
	});
}

function cargaHora(){

    var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = dd+'/'+mm+'/'+yyyy;
	//$('#FECHA_CREACION').val(today);
	//document.write(today);
	return today;

}

function guardaBQ(){

	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	resetForm();
	//IDUSUARIO=getId;
	//var obj;

	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	$('#FECHA_CREACION').val(cargaHora);
	$('#tituloBoton').html("Guardar");
	$('#tituloModal').html("Guardar Busqueda");
	$('#detalleBusqueda').addClass('guardar');
	$('#detalleBusqueda').modal('show');
}

function guardaEtiquetaBQ(data){
	$('#detalleBusqueda').modal('hide');
	alert("La busqueda fue guardada correctamente");	
}

function guardarCambios(){
	var data = $(".form-control");
	var obj = {};
	
	obj["IDUSUARIO"] = getId();
	obj["NOMBRES"] = $('#NOMBRES').val();

	//obj["IDINSTITUCION"]= $('#IDINSTITUCION').val();//hardcode!
	var ruta = "";
	var callback;
	var parent= [];

	parent.push(dameEtiquetas());
	var obj2 = $.extend({},obj,parent);

	
	if($('#detalleBusqueda').hasClass("guardar")){
		ruta = "../../api/BQ_guardarBusqueda";
		callback = guardaEtiquetaBQ;
		
	}

	$.ajax({
		type: 'POST',
		url : ruta,
		dataType: "json",
		//data: obj,
		data: JSON.stringify(obj2),
		contentType: "application/json; charset=utf-8",
		success: callback
	});
}

function getUrlParameters(parameter, staticURL, decode){
   var currLocation = (staticURL.length)? staticURL : window.location.search,
       parArr = currLocation.split("?")[1].split("&"),
       returnBool = true;
   
   for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;            
        }
   }
   
   if(!returnBool) return false;  
}

function verEtiquetaBusqueda(){

	var obj = {};
	var IDBUSQUEDA=getUrlParameters("id","",true);
	obj["IDBUSQUEDA"]=IDBUSQUEDA;


	if(IDBUSQUEDA==0){

	}
	else{
		$.ajax({
			type: 'POST',
			url : '../../api/AU_getEtiquetaBQ',
			dataType: "json",
			data: JSON.stringify(obj),
			contentType: "application/json; charset=utf-8",
			success: function(data){ 
				
				//INTEGRANTES
				var integrantes = $("#sel2Multi1").select2("val");
				var lista=data["IDETIQUETA"];

		    	for (var i=0; i<lista.length; i++) {
					integrantes.push(lista[i].IDETIQUETA);
		    	}
		    	$("#sel2Multi1").select2("val", integrantes);
				seleccionEtiquetas = $("#sel2Multi1").select2("data");
			}
		});
	}
}


function armarModalBody(data){
	$.ajax({
		type: 'POST',
		url : '../../api/BQ_damelistaEtiquetasPopularIdioma',
		dataType: "json",
		//data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj){
			for (var i=0; i<obj.length; i++) {
				$("#sel2Multi1").append('<option value="' + obj[i].IDETIQUETA + '">' + obj[i].NOMBRE + '</option>');
			}

		}
	});
}


var idiomas;
function popularSelectIdiomaB(){
	$.ajax({
		type: 'POST',
	    url:'../../api/PD_getListaIdiomaB',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	     //  $('#bodyEtiquetas').empty();		   
		   idiomas=data;
		   armarModalBody(idiomas);
		 //  armarModalBody(idiomas);
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

function cargaListaEtiqueta(ididioma){

	var obj={};

	obj["IDIDIOMA"]=ididioma;

	$.ajax({

		type: 'POST',
		url : '../../api/BQ_getListaEtiquetaCombo',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj2){
			$("#sel2Multi1").empty();
			for (var i=0; i<obj2.length; i++) {
				$("#sel2Multi1").append('<option value="' + obj2[i].IDETIQUETA + '">' + obj2[i].NOMBRE + '</option>');
			}

		}
	});
}

$(document).ready(function(){
	//detectaBuscar();

	$('#CANTIDADP').html("Cantidad de publicaciones encontradas: ");
	$('#CANTIDADF').html("Cantidad de fichas encontradas: ");
	iniciarNiceSelectBoxesBQ();
	popularSelectIdiomaB();
	cambioIdiomaCombo();
	cargaListaEtiqueta(ididioma);
	//cargarListaEtiquetas();
	setTimeout(verEtiquetaBusqueda,50);
	$("#busquedaAsistida").click(realizarBusqueda);
	$("#guardaBusqueda").click(guardaBQ);
	$("#cerrar").click(resetForm);
	//realizarBusqueda();
	$("#guardar").click(guardarCambios);
	cargaHora();
	var enterpressed=false;
	var NOMBRE;
	$("#criterioBusqueda").keypress(function(event) {
		 if (event.keyCode == 13) {
		 	$('#listaPublicaciones').empty();	
			$('#listaFichas').empty();
			NOMBRE=$("#criterioBusqueda").val();
			//realizarBusqueda();
				//window.location.href = "../Administracion_Usuario_Grupo/ViewListaPublicacionPorGrupo.html?id=" + IDGRUPO;
			enterpressed=true;
		 	//alert("Se presiono enter");
		 	//window.location.href = '../Publicacion_Documental/ViewListaPublicacion.html?id='+NOMBRE;
		 	if(enterpressed) window.location.href = "../Publicacion_Documental/ViewBusquedaResultado.html?id="+NOMBRE;
		 }
		 else{
		 }
	});	
});