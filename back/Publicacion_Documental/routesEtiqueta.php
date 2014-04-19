<?php

	$app->get('/PD_getListaEtiqueta','getListaEtiqueta');
	$app->get('/PD_getEtiqueta/:id','getEtiqueta');
	$app->post('/PD_registraEtiqueta','registraEtiqueta');
	$app->post('/PD_modificaEtiqueta','modificaEtiqueta');
	$app->post('/PD_eliminaEtiqueta','eliminaEtiqueta');
	
?>