<?php


	$app->post('/BQ_buscarPublicacionBasico','busquedaBasica');
	$app->post('/BQ_guardaHistorialP','guardaHistorialP');
	$app->post('/BQ_guardaHistorialH','guardaHistorialH');
	$app->post('/BQ_buscarPublicacionAsistida','busquedaAsistida');
	$app->post('/BQ_damelistaEtiquetas','dameEtiquetaBQ');
	$app->post('/BQ_BusquedaAvanzada','busquedaAvanzada');
	$app->post('/BQ_guardarBusqueda','busquedaGuardar');
	$app->post('/BQ_getListaMisBusquedas','dameMisBusquedas');
	$app->get('/BQ_eliminaMiBusqueda/:id','eliminaMiBusqueda');
	$app->post('/AU_getEtiquetaBQ','dameEtiquetasBQ');
?>