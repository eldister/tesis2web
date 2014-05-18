<?php

	$app->post('/PD_getListaFicha','getListaFicha');
	$app->get('/PD_getFicha/:id','getFicha');
	$app->post('/PD_registraFicha','registraFicha');
	$app->post('/PD_modificaFicha','modificaFicha');
	$app->post('/PD_eliminaFicha','eliminaFicha');

	$app->get('/PD_getPublicacionDeFicha/:id','getPublicacionDeFicha');
	$app->post('/PD_registraFichaxEtiqueta','registraFichaxEtiqueta');
	$app->post('/PD_registraFichaxGrupo','registraFichaxGrupo');
	$app->get('/PD_getGrupoFicha/:id','getGrupoFicha');
	$app->get('/PD_getEtiquetaFicha/:id','getEtiquetaFicha');
	$app->post('/PD_modificaFichaxEtiqueta','modificaFichaxEtiqueta');
	$app->post('/PD_modificaFichaxGrupo','modificaFichaxGrupo');

?>