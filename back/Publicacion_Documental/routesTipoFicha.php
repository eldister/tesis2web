<?php

	//DEFINIMOS LOS APIS
	$app->get('/PD_getListaTipoFicha', 'getListaTipoFicha');
	$app->get('/PD_getTipoFicha/:id','getTipoFicha');
	$app->post('/PD_registraTipoFicha','registraTipoFicha');
	$app->post('/PD_modificaTipoFicha','modificaTipoFicha');
	$app->post('/PD_eliminaTipoFicha','eliminaTipoFicha');
?>