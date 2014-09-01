document.write('<section id="col-left"><div class="collapse navbar-collapse navbar-ex1-collapse" id="sidebar-nav">');	
document.write('		<ul class="nav nav-pills nav-stacked">');
document.write('			<li id="principal" class="active"><a href="../Administracion_Usuario_Grupo/viewPerfil.html" onmouseover="expandDropdown(this)">');
document.write('				<i class="fa fa-home"></i><span>Principal</span></a></li>');
document.write('			<li id="publicacion"><a href="../Publicacion_Documental/ViewListaPublicacion.html" onmouseover="expandDropdown(this)"  class="dropdown-toggle"><i class="fa fa-book"></i><span>Publicaciones</span><i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-publicacion"><a href="../Publicacion_Documental/ViewListaPublicacion.html">Ver Publicaciones</a></li>');
document.write('					<li id="reg-publicacion"><a href="../Publicacion_Documental/ViewCrearPublicacion.html">Registrar Publicación</a></li>');
document.write('					<li id="reg-publicacion-txt"><a href="../Publicacion_Documental/ViewCargaMasivaPublicacion.html">Registrar a partir de archivo de texto</a></li></ul>');
document.write('			</li>');
document.write('			<li id="fichas"><a href="../Publicacion_Documental/ViewListaFicha.html" onmouseover="expandDropdown(this)" class="dropdown-toggle"><i class="fa fa-file-text"></i><span>F. Bibliográficas</span><i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-ficha"><a href="../Publicacion_Documental/ViewListaFicha.html">Ver Fichas</a></li>');
document.write('				</ul>');
document.write('			</li>');
document.write('			<li id="usuarios"><a href="../Administracion_Usuario_Grupo/ViewListaUsuario.html" onmouseover="expandDropdown(this)" class="dropdown-toggle"><i class="fa fa-users"></i><span>Usuarios</span>');
document.write('					<i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-usuario"><a href="../Administracion_Usuario_Grupo/ViewListaUsuario.html">Ver Usuarios</a></li>');
document.write('					<li id="reg-usuario"><a href="../Administracion_Usuario_Grupo/ViewCrearUsuario.html">Registrar Usuarios</a></li></ul>');
document.write('			</li>');
document.write('			<li id="grupos"><a href="../Administracion_Usuario_Grupo/ViewListaGrupo.html" onmouseover="expandDropdown(this)" class="dropdown-toggle"><i class="fa fa-comments"></i><span>Grupos</span>');
document.write('					<i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-grupo"><a href="../Administracion_Usuario_Grupo/ViewListaGrupo.html">Ver Grupos</a></li>');
document.write('					<li id="reg-grupo"><a href="../Administracion_Usuario_Grupo/ViewCrearGrupo.html">Crear Grupo</a></li></ul>');
document.write('			</li>');
document.write('			<li id="autores"><a href="../Publicacion_Documental/ViewListaAutores.html" class="dropdown-toggle"><i class="fa fa-pencil-square-o"></i><span>Autores</span><i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-autor"><a href="../Publicacion_Documental/ViewListaAutores.html">Ver Autores</a></li>');
document.write('				</ul>');
document.write('			</li>');
document.write('			<li id="idiomas"><a href="../Publicacion_Documental/ViewListaIdioma.html" class="dropdown-toggle"><i class="fa fa-globe"></i><span>Idiomas</span>');
document.write('					<i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-idioma"><a href="../Publicacion_Documental/ViewListaIdioma.html">Ver Idiomas</a></li>');
document.write('				</ul>');
document.write('			</li>');
document.write('			<li id="etiquetas"><a href="../Publicacion_Documental/ViewListaEtiqueta.html" class="dropdown-toggle"><i class="fa fa-star"></i><span>Etiquetas</span>');
document.write('					<i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-etiqueta"><a href="../Publicacion_Documental/ViewListaEtiqueta.html">Ver Etiquetas</a></li></ul>');
document.write('			</li>');
document.write('			<li id="maestros"><a href="../Publicacion_Documental/ViewListaTipoPublicacion.html" onmouseover="expandDropdown(this)" class="dropdown-toggle"><i class="fa fa-files-o"></i><span>Maestros</span>');
document.write('					<i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('				<ul class="submenu">');
document.write('					<li id="ver-tipopub"><a href="../Publicacion_Documental/ViewListaTipoPublicacion.html">Ver Tipo de Publicaciones</a></li>');
document.write('					<li id="ver-tipofi"><a href="../Publicacion_Documental/ViewListaTipoFicha.html">Ver Tipo de Fichas Bibliograficas</a></li>');
document.write('					<li id="ver-institucion"><a href="../Administracion_Usuario_Grupo/ViewListaInstitucion.html">Ver Instituciones</a></li></ul>');
document.write('			</li>');
document.write('			<li id="enlaces"><a href="../Publicacion_Documental/ViewGestionListaPublicacion.html" onmouseover="expandDropdown(this)" class="dropdown-toggle"><i class="fa fa-link"></i>');
document.write('					<span>Listas de Publicación</span><i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('					<ul class="submenu">');
document.write('					<li id="ver-enlace"><a href="../Publicacion_Documental/ViewGestionListaPublicacion.html">Ver Enlaces con lecturas asignadas</a></li>');
document.write('					<li id="reg-enlace"><a href="../Publicacion_Documental/ViewCrearListaPublicacion.html">Crear enlace con lecturas asignadas</a></li></ul>');
document.write('			</li>');
document.write('			<li id="permiso"><a href="../Seguridad/ViewListaPerfiles.html" onmouseover="expandDropdown(this)" class="dropdown-toggle"><i class="fa fa-key"></i><span>Permisos</span>');
document.write('					<i class="fa fa-chevron-circle-down drop-icon"></i></a>');
document.write('					<ul class="submenu">');
document.write('					<li id="ver-permiso"><a href="../Seguridad/ViewListaPerfiles.html">Ver Permisos</a></li>');
document.write('					<li id="reg-permiso"><a href="../Seguridad/ViewCrearPerfil.html">Crear Permiso</a></li></ul>');
document.write('			</li>');
document.write('		</ul>');
document.write('	</div>');
document.write('</section>');