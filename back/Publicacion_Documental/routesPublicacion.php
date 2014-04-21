<?php

	$app->get('/PD_getListaPublicacion','getListaPublicacion');
	$app->get('/PD_getPublicacion/:id','getPublicacion');
	$app->post('/PD_registraPublicacion','registraPublicacion');
	$app->post('/PD_modificaPublicacion','modificaPublicacion');
	$app->post('/PD_eliminaPublicacion','eliminaPublicacion');
	$app->post('/PD_registraPublicacionxEtiqueta','registraPublicacionxEtiqueta');
	$app->post('/PD_registraPublicacionxAutor','registraPublicacionxAutor');
	$app->get('/PD_getEtiquetaPublicacion/:id','getEtiquetaPublicacion');
	$app->get('/PD_getAutorPublicacion/:id','getAutorPublicacion');
	$app->post('/PD_modificaPublicacionxEtiqueta','modificaPublicacionxEtiqueta');
	$app->post('/PD_modificaPublicacionxAutor','modificaPublicacionxAutor');
?>