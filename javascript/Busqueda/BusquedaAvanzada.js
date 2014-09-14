var listaLecturas=[];


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
		fila += '<td class="text-center tipo">'+data["FICHAS"][i][i]["TITULO_ABREVIADO"]+'</td>';
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
}

function realizarBusqueda(){
	
	$('#listaPublicaciones').empty();	
	$('#listaFichas').empty();
	var IDUSUARIO=getId();
	var obj = {};
	obj["IDUSUARIO"]=IDUSUARIO;
	//obj["criterio"]=getUrlParameters("id","",true);
	var parent= [];

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
*/

var comboAtributosPublicacion;
function generaSelectPublicacion(){
	comboAtributosPublicacion='<div class="col-md-2"><select class="form-control" style="width:170px;" id="sepu">';
	comboAtributosPublicacion+='<option id="pu1">Titulo</option>';
	comboAtributosPublicacion+='<option id="pu2">Fuente</option>';
	comboAtributosPublicacion+='<option id="pu3">Obtenido de</option>';
	comboAtributosPublicacion+='<option id="pu4">Autor</option>';
	comboAtributosPublicacion+='<option id="pu5">Volumen</option>';
	comboAtributosPublicacion+='<option id="pu6">DOI</option>';
	comboAtributosPublicacion+='<option id="pu7">ISSN</option>';
	comboAtributosPublicacion+='<option id="pu8">Tipo de Publicacion</option>';
	comboAtributosPublicacion+='</select></div>';
}

var comboAtributosFicha;
function generaSelectFicha(){
	comboAtributosFicha='<div class="col-md-2"><select class="form-control" style="width:170px;" id="sepu">';
	comboAtributosFicha+='<option id="fi1">Nombre de Ficha</option>';
	comboAtributosFicha+='<option id="fi2">Tipo de Ficha</option>';
	comboAtributosFicha+='<option id="fi3">Contenido</option>';
	comboAtributosFicha+='</select></div>';

}


function cargaComboBoxPublicacion(){

	$('#filaVista').empty();
	fila = '<div class="row elem" id="r'+indice+'">' ;
	fila += '<div class="col-md-2"></div><div class="col-md-2"><input class="form-control" id="'+indice+'" style="width:210px;"></input></div> <div class="col-md-1 text-center">en</div> '; 
	fila += comboAtributosPublicacion;
	fila += '</div><br id="br'+indice+'">';
	$('#filaVista').append(fila);
	indice++;
}

function cargaComboBoxFicha(){
	$('#filaVista').empty();
	fila = '<div class="row elem" id="r'+indice+'">' ;
	fila += '<div class="col-md-2"></div><div class="col-md-2"><input class="form-control" id="'+indice+'" style="width:210px;"></input></div> <div class="col-md-1 text-center">en</div> '; 
	fila += comboAtributosFicha;
	fila += '</div><br id="br'+indice+'">';
	$('#filaVista').append(fila);
	indice++;
}

var flag=1;
function detectaCB(){
	$('[name="tipoB"]').change(function(){
		indice=0;
		query=[];
		var checkedradio=$('[name="tipoB"]:radio:checked').val();
		//alert(checkedradio);
		if(checkedradio=="PUBLICACION") {
			cargaComboBoxPublicacion();
			query=[];
			flag=1;	
		}
		else {
			query=[];
			cargaComboBoxFicha(); 
			flag=2;
		}			
	});
}



function agregarFila(){
	if(flag===1){
		var selectOption='<select class="form-control pull-right" style="width:100px;" id="seco"><option id="opt1">AND</option><option id="opt2">OR</option><option id="opt3">NOT</option></select>';
		var fila = '<div class="row elem" id="r'+indice+'">' ;
		fila += '<div class="col-md-2 center">'+selectOption+'</div><div class="col-md-2"><input class="form-control" id="'+indice+'" style="width:210px;">';
		fila +='</input></div> <div class="col-md-1 text-center">en</div> '; 
		fila += comboAtributosPublicacion;
		fila += '<div class="col-md-2"><a  class="eliminar-fila table-link danger" idfila="'+indice+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a></div></div><br id="br'+indice+'">';
		$('#filaVista').append(fila);
		indice++;
	}
	else{
		var selectOption='<select class="form-control pull-right" style="width:100px;" id="seco"><option id="opt1">AND</option><option id="opt2">OR</option><option id="opt3">NOT</option></select>';
		var fila = '<div class="row elem" id="r'+indice+'">' ;
		fila += '<div class="col-md-2 center">'+selectOption+'</div><div class="col-md-2"><input class="form-control" id="'+indice+'" style="width:210px;">';
		fila +='</input></div> <div class="col-md-1 text-center">en</div> '; 
		fila += comboAtributosFicha;
		fila += '<div class="col-md-2"><a  class="eliminar-fila table-link danger" idfila="'+indice+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a></div></div><br id="br'+indice+'">';
		$('#filaVista').append(fila);
		indice++;
	}

	$(document).on('click', '.eliminar-fila', eliminarFila);
}

function eliminarFila(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var fila = this.getAttribute("idfila");
	$("#r"+fila+"").remove();
	$("#br"+fila+"").remove();
	//indice-=1;
}


function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}

var query=[];
function buscar(){
	$('#listaPublicaciones').empty();
	$('#listaFichas').empty();
	query=[];
	$('div.row.elem').each(function(){
		if(this.getAttribute("id")==="r0"){
			var ind=this.getAttribute("id").charAt(1);
			var select=$(this).find("select");
			var obj={
				cond:'nop',
				campo: $("#"+ind+"").val(),
				columna: $(select).val()
			}; 			
		}
		else{
			var selectCond=$(this).find("select#seco");
			var ind=this.getAttribute("id").charAt(1);
			var select=$(this).find("select#sepu");
			var obj={
				cond:$(selectCond).val(),
				campo: $("#"+ind+"").val(),
				columna: $(select).val()
			}; 
		}
		query.push(obj);
	});
	
	//AHORA BUSCO
	var obj={};
	obj["TIPOBUSQUEDA"]=flag;
	obj["IDUSUARIO"]=getId();
	obj["BUSQUEDA"]=query;

	$.ajax({
		type: 'POST',
		url : '../../api/BQ_BusquedaAvanzada',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			var valor=data["ID"];
			//data["PUBLICACION"];
			//data["QUERYPRINCIPIO"];
			//data["CANTIDAD"];
			//alert(valor);
			llenaTabla(data);
		}
	});
}

var indice=0;
$(document).ready(function(){

	$('#CANTIDADP').html("Cantidad de publicaciones encontradas: ");
	$('#CANTIDADF').html("Cantidad de fichas encontradas: ");

	generaSelectPublicacion();
	generaSelectFicha();
	cargaComboBoxPublicacion();

	detectaCB();
	$("#nuevoElemento").click(agregarFila);
	$("#buscar").click(buscar);

});