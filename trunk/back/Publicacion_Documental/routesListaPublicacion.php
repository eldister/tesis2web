<?php

	$app->post('/PD_getListaListaPublicacion','getListaListaPublicacion'); //con las lecturas asignadas
	$app->post('/PD_registraListaPublicacion','registraListaPublicacion');
	$app->post('/PD_buscarPublicacion','buscarPublicacion');
	$app->post('/PD_getPublicacionesLista','getPublicacionesLista');
	$app->get('/PD_getGrupoListaPublicacion/:id','getGrupoListaPublicacion');	
	$app->post('/PD_modificaListaPublicacion','modificaListaPublicacion');
	$app->post('/PD_eliminaListaPublicacion','eliminaListaPublicacion');
	$app->post('/PD_getPublicacionesEnlace','getPublicacionesEnlace');	
?>