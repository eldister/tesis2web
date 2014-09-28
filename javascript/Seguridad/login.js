function getUrlParameters(parameter, staticURL, decode){
   /*
    Function: getUrlParameters
    Description: Get the value of URL parameters either from 
                 current URL or static URL
    Author: Tirumal
    URL: www.code-tricks.com
   */
   currLocation = (staticURL.length)? staticURL : window.location.search;
   if(currLocation=="") return false;

   var parArr = currLocation.split("?")[1].split("&"),
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

var idtipologin,currLocation;
$(document).ready(function(){
	idtipologin=getUrlParameters("a","",true);
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
					//localStorage.setItem('idGrupoPadre',idActual);
				else localStorage.setItem('idMiGrupo',data["grupoid"]);
				localStorage.setItem('idGrupo',idActual);
				//uid codigo de usuario en BD
				//redirigir a pagina correspondiente
				if(idtipologin!=false) $(location).attr('href','../tesis2web/front/Publicacion_Documental/ViewGestionListaPublicacion.html');
				else $(location).attr('href','../tesis2web/front/Administracion_Usuario_Grupo/viewPerfil.html');
			}
			else {
				alert("Usuario o Contraseña Incorrectas");
				if(idtipologin!=false) $(location).attr('href','../tesis2web/login.html?a=lp');
				else $(location).attr('href','../tesis2web/login.html');
   			}
		}
	});
}

//$('#logout').click(function(){
//    localStorage.clear();
//});