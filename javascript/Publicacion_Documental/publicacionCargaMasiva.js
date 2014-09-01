var myDropzone;
Dropzone.options.subidaArchivos = {
  init: function() {
    myDropzone = this;
  }
};

function configurarDropzone(){
	Dropzone.autoDiscover=false;
	$('#subidaArchivos').dropzone({
	    url: '../../api/PD_subirArchivoTexto',
	    maxFilesize: 100,
	    paramName: 'file',
	    addRemoveLinks: true,
	    autoProcessQueue: false,
	    uploadMultiple:false,
	    maxFiles:1,
	    parallelUploads:10000,
	    acceptedFiles:'text/plain',
	    dictRemoveFile:'Remover archivo'
	});

}

var myDropzone2, cantidadArchivosSubir;

Dropzone.options.subidaArchivosPDF = {
  init: function() {
    myDropzone2 = this;
  }
};

function configurarDropzone2(){
	Dropzone.autoDiscover=false;
	$('#subidaArchivosPDF').dropzone({
	    url: '../../api/PD_subirArchivosPDF',
	    maxFilesize: 100,
	    paramName: 'file',
	    addRemoveLinks: true,
	    autoProcessQueue: false,
	    uploadMultiple:true,
	    maxFiles:cantidadArchivosSubir,
	    parallelUploads:10000,
	    acceptedFiles:'application/pdf',
	    dictRemoveFile:'Remover archivo'
	});

}

function guardarArchivos(){	
	
	myDropzone.on("sending", function(file, xhr, formData) {
	 
	});
	myDropzone.processQueue();

	myDropzone.on("success",function(file,response){
		//armar tabla 
		$('#dropzone').attr("style","display:none");
		$('#texto1').attr("style","display:none");
		$('#texto2').attr("style","display:none");
		$('#buttons1').attr("style","display:none");
		$('#archivoSubir').attr("style","display");
		$('#texto3').attr("style","display");
		$('#texto4').attr("style","display");
		$('#dropzone2').attr("style","display");
		$('#buttons2').attr("style","display");

		data=JSON.parse(response);

		cantidadArchivosSubir=data.length;

		configurarDropzone2();

		$('#numArchSubir').html(data.length);
		
		for(var i=0; i < data.length ; i++){
			fila = '<li class="list-group-item">'+data[i]+'</li>';	
			$('#listaArchivos').append(fila);
		}

	});
}

function guardarTxt(){
	guardarArchivos();
}

function guardarPDFs(){
	myDropzone2.on("sendingmultiple", function(file, xhr, formData) {
	 
	});
	myDropzone2.processQueue();

	myDropzone2.on("successmultiple",function(file,response){
		alert("Archivos anexados correctamente");
		window.location.href='ViewListaPublicacion.html';		
	});
}

$(document).ready(function(){

	configurarDropzone();

	

	$("#guardarTxt").click(guardarTxt);

	$("#guardarPDFs").click(guardarPDFs);
});