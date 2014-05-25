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

function llenaTabla(data){
	for(var i=0; i < data.length ; i++){
		var fila = '<tr id=fila-'+ data[i]["IDLECTURAASIGNADA"] +'>';
		fila +='<td style="display:none;">';
		fila += '<td class="text-center">'+data[i]["TITULO"]+'</td>';
		fila += '<td class="text-center">'+data[i]["PALABRASCLAVE"]+'</td>';
		fila += '<td class="text-center">'+data[i]["AUTORES"]+'</td>';
		fila += '<td style="width: 12%;padding-left: 30px;">'
		fila +=	'<a class="ver-archivo table-link" url="'+data[i]["URL"]+'"><span class="fa-stack"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-search fa-stack-1x fa-inverse"></i></span></a>';
		fila += '</td></tr>';
		$('#listaLecturas').append(fila);
	}

	$(document).on('click', '.ver-archivo', verArchivo);
}

function verArchivo(){
	$(".selected").removeClass("selected");
	$(this).parent().parent().addClass("selected");
	var url=this.getAttribute("url");
	var newurl='../'+url;
	var myPDF = new PDFObject({
	  url: newurl,
	  id: "archPDF",
	  width: "700px",
  	  height: "900px",
	  pdfOpenParams: {
	  	toolbar: 0,
	    navpanes: 0,
	    statusbar: 0,
	    view: "FitH",
	  }
	}).embed("modalDiv");
	$('#detalleArchivo').modal("show");

}

function cargaPublicacionesxLista(){
	var obj={idlp:idlp};
	$.ajax({
		type: 'POST',
		url : '../../api/PD_getPublicacionesLista',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function (data){
			$("#tema").html(data[0]["NOMBREABR"]);
			llenaTabla(data);
		}
	});
}
var idlp;
$(document).ready(function(){
	idlp=getUrlParameters("idlp","",true);
	cargaPublicacionesxLista();

});