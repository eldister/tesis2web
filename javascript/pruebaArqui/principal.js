
function guardarCambios(){
	var nombre= $('#nombre').val();
	var apellido=$('#apellido').val();
	var correo =$('#correo').val();
	var obj={
		"nombre":nombre,
		"apellido":apellido,
		"correo":correo
	};
	$.ajax({
		type: 'POST',
		url : '../slim/api/guardarDato',
		dataType: "json",
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success:function(){
			alert("Usuario creado");
		}
	});
}


$(document).ready(function(){

	$("#guardarCambios").click(guardarCambios);

});