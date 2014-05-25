
function cargaElementos(data){

	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["idlistapublicacion"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["nombreabr"]+'</td>';
		fila += '<td class="text-center">'+data[i]["fecharegistro"]+'</td>';		
		fila+= '<td style="width: 23%;padding-left: 30px;">'
		fila+= '<a class="ver-publicacion table-link" href="ViewVerListaPublicacion.html?idlp='+data[i]["idlistapublicacion"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search-plus fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="modificar-listapublicacion table-link" href="ViewModificarListaPublicacion.html?idlp='+data[i]["idlistapublicacion"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-pencil fa-stack-1x fa-inverse"></i></span></a>';
		fila+= '<a class="eliminar-listapublicacion table-link danger" idlp='+data[i]["idlistapublicacion"]+'><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-trash-o fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listalistaPublicacion').append(fila);
		$('#listalistaPublicacion').trigger("update");
	}
	$(document).on('click', '.eliminar-listapublicacion', eliminarListaPublicacion);
}

var idlp

function eliminarListaPublicacion(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	idlp=this.getAttribute("idlp");
	
	$('#detallelista').modal('show');
}

function elimina(data){
	$('#detallelista').modal('hide');	
	$('#fila-'+data["IDLISTAPUBLICACION"]+'').remove();
	$('#listalistaPublicacion').trigger("update");
	return false;
}

function guardarCambios(){
	var obj = {idlp:idlp};
	$.ajax({
		type: 'POST',
		url :  "../../api/PD_eliminaListaPublicacion",
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: elimina
	});
}

function cargaListaPublicacion(){
	var obj={idMiGrupo:localStorage.idMiGrupo,
			 idUsuario:localStorage.uid
			};

	$.ajax({
		type: 'POST',
		url : '../../api/PD_getListaListaPublicacion',
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(obj),
		success: cargaElementos
	});
	$("table#tabla").tablesorter({ widthFixed: true, sortList: [[0, 0]] })
       .tablesorterPager({ container: $("#pager"), size: $(".pagesize option:selected").val() });
}

$(document).ready(function(){
	cargaListaPublicacion();
	$("#guardar").click(guardarCambios);
});