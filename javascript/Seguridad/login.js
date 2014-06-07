
$(document).ready(function(){

	$("#ingresar").click(ingresar);

});

function ingresar(){
	var username,password;
	username = $("#USERNAME").val();
	password = $("#PASSWORD").val();
	var obj={
		'USERNAME':username,
		'PASSWORD':password
	};


	$.ajax({
		type: 'POST',
		url : '../tesis2web/api/SE_login',
		dataType: "json",
		data:JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(data){
			if(data["respuesta"]==1){ 
				//alert("BIEN JUGADO");
				localStorage.setItem('uid',data["userid"]);
				var idActual=1;
				if(data["grupoid"]===null)
					localStorage.setItem('idMiGrupo',idActual);
				else localStorage.setItem('idMiGrupo',data["grupoid"]);
				localStorage.setItem('idGrupo',idActual);
				//uid codigo de usuario en BD
				//redirigir a pagina correspondiente

				$(location).attr('href','../tesis2web/front/Administracion_Usuario_Grupo/viewPerfil.html');
			}
			else {
				alert("Usuario o Contraseña Incorrectas");
				$(location).attr('href','../tesis2web/login.html');
   			}
		}
	});
}

//$('#logout').click(function(){
//    localStorage.clear();
//});