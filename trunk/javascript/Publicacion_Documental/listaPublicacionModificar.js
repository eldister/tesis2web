var listaLecturas=[];
var seleccionGrupos;

function getUrlParameters(parameter, staticURL, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from 
                 current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
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


function getId(){
	if( localStorage.uid ){
		return IDUSUARIO = localStorage.uid;
	}
	else{
		return IDUSUARIO = 1;
	}
}


function setCamposGrupos(){
	var data2;
	$.ajax({
		type: 'GET',
	    url:'../../api/PD_getGrupoListaPublicacion/'+ idlp,
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    success: function(data) {
	    	var gruposPublicacion = $("#sel2grupo").select2("val");
			for (var i=0; i<data.length; i++) {	    		
				gruposPublicacion.push(data[i].IDGRUPO);
			}
			$("#sel2grupo").select2("val", gruposPublicacion);
			seleccionGrupos = $("#sel2grupo").select2("data");
	    	
	    },
	    //async : false	
	});

	
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
var index=0;
function llenaPublicaciones(data){

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=f-'+index+'><td class="text-center title">'+data[i]["TITULO"]+'</td>';
		fila += '<td class="text-center palcla">'+data[i]["PALABRASCLAVE"]+'</td>';
	    fila += '<td class="text-center autors">'+data[i]["AUTORES"]+'</td><td style="width: 12%;padding-left: 30px;">';
		fila +=	'<a class="modificar-lectura table-link" idpublicacion='+index+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila +=	'<a class="eliminar-lectura table-link danger" idpublicacion='+index+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila +=	'</td></tr>';
					
		var objNota;
		var listaNota=[];
		for (var j = 0; j < data[i]["NOTASLECTURA"].length; j++) {
			objNota={contenido:data[i]["NOTASLECTURA"][j]["CONTENIDO"]};
			listaNota.push(objNota);
		};

		objLectura = {index:index,
					  idpublicacion:data[i]["IDPUBLICACION"],
			          titulo:data[i]["TITULO"],
			          palabrasclave:data[i]["PALABRASCLAVE"],
			          notaslectura:listaNota,
			          observaciones:data[i]["OBSERVACIONES"],
			          autores:data[i]["AUTORES"]
			      	  };

		listaLecturas.push(objLectura);
		$('#listaLecturas').append(fila);
		index+=1;
	}
}

function cargaLecturas(){
	var obj={idlp:idlp};
	$.ajax({
		type: 'POST',
		url : '../../api/PD_getPublicacionesLista',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			$("#Tema").val(data[0]["NOMBREABR"]);
			llenaPublicaciones(data);
		}
	});
}

function borrarCampos(){
	$("#PALABRACLAVE").val('');
	$("#notasLectura").empty();
	$("#OBSERVACIONES").val('');
	$('#listaPublicaciones').empty();
	$('#criterioBusqueda').val('');
	indiceNota=1;
	indice=null;
	addNotaLectura();
}


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
		//console.log(listaLecturas);
	}
	else{

		if(!validarModificarLectura()){			
			return;
		}

		var idpub=indice[0].index;
		$("#listaLecturas tr#f-"+idpub+" td.palcla").html($("#PALABRACLAVE").val());
		
		$.each(listaLecturas, function() {
		    if (this.index === idpub) {
		        this.palabrasclave=$("#PALABRACLAVE").val();
		        var notasLectura =[];
		        var cantidadNotas= $("#notasLectura > div").length;
				for (var i = 0; i < cantidadNotas; i++) {
					var ind = i+1;
					var objNota={contenido:$("#NOTASLECTURA-"+ind+"").val()};
					notasLectura.push(objNota);
				};
		        this.notaslectura=notasLectura;
		        this.observaciones=$("#OBSERVACIONES").val();
		    }
		});		
	}

	borrarCampos();
	$('#agregarElemento').modal('hide');

}


function llenaTabla(data){
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
		$('#listaPublicaciones').empty();		
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
	var grupos=[];
	var ob;
	for (var i=0; i<seleccionGrupos.length; i++) {
		ob={id:seleccionGrupos[i]["id"]};
		grupos.push(ob);
	}

	var obj={idlp:idlp,
			 tema:$('#Tema').val(),
			 lecturas:listaLecturas,
			 grupos:grupos
		};

	if(!validarListaPublicacion(grupos,listaLecturas)){
		return;
	}

	$.ajax({
		type: 'POST',
		url : "../../api/PD_modificaListaPublicacion",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			if(data["status"]===1){
				alert("Lista modificada correctamente");
				window.location.href='ViewGestionListaPublicacion.html';
			}	
			else{
				alert("Hubo un error en el proceso, intente nuevamente");
				window.location.href='ViewGestionListaPublicacion.html';
			}		
		}
	});
}

function setCamposGruposInicial(){
	var test3 = $('#sel2grupo');
	$(test3).change(function() {
    	seleccionGrupos = ($(test3).select2('data'));
	});
}

function iniciarNiceSelectBoxes(){
	$('#sel2grupo').select2({
		placeholder: 'Seleccione un grupo',
		allowClear: true
	});
}

function cambiarTituloBoton(){
	borrarCampos();
	$('#tituloBoton').html('Agregar');
	$('#headerElemento').show();
	$('#bodyElemento').show();
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

var idlp=getUrlParameters("idlp","",true);
var indiceNota = 1;
$(document).ready(function(){
	iniciarNiceSelectBoxes();
	setCamposGruposInicial();
	cargaGrupos();
	detectaBuscar();
	cargaLecturas();
	addNotaLectura(indiceNota);	
	setTimeout(setCamposGrupos(),300);
	
	$("#guardarLectura").click(agregarFila);
	$("#guardar").click(guardarCambios);
	$("#agregar").click(cambiarTituloBoton);
	$("#agregarNota").click(addNotaLectura);
	$(document).on('click', '.modificar-lectura', modificarLectura);
	$(document).on('click', '.eliminar-lectura', eliminarLectura);
});