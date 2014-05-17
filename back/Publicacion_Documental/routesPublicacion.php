<?php

	$app->get('/PD_getListaPublicacion','getListaPublicacion');
	$app->get('/PD_getPublicacion/:id','getPublicacion');
	$app->post('/PD_registraPublicacion','registraPublicacion');
	$app->post('/PD_modificaPublicacion','modificaPublicacion');
	$app->post('/PD_eliminaPublicacion','eliminaPublicacion');
	$app->post('/PD_eliminaArchivo','eliminaArchivo');
	$app->post('/PD_registraPublicacionxEtiqueta','registraPublicacionxEtiqueta');
	$app->post('/PD_registraPublicacionxAutor','registraPublicacionxAutor');
	$app->post('/PD_registraPublicacionxGrupo','registraPublicacionxGrupo');
	$app->get('/PD_getEtiquetaPublicacion/:id','getEtiquetaPublicacion');
	$app->get('/PD_getAutorPublicacion/:id','getAutorPublicacion');
	$app->post('/PD_modificaPublicacionxEtiqueta','modificaPublicacionxEtiqueta');
	$app->post('/PD_modificaPublicacionxAutor','modificaPublicacionxAutor');
	$app->post('/PD_modificaPublicacionxGrupo','modificaPublicacionxGrupo');
	$app->post('/PD_subirArchivos','subirArchivos');
	$app->get('/PD_getArchivosPublicacion/:id','getArchivosPublicacion');
	$app->get('/PD_getGrupoPublicacion/:id','getGrupoPublicacion');

?>