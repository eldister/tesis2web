
<?php

	//DEFINIMOS LOS APIS
	$app->get('/PD_getListaTipoPublicacion', 'getListaTipoPublicacion');
	$app->get('/PD_getTipoPublicacion/:id','getTipoPublicacion');
	$app->post('/PD_registraTipoPublicacion','registraTipoPublicacion');
	$app->post('/PD_modificaTipoPublicacion','modificaTipoPublicacion');
	$app->post('/PD_eliminaTipoPublicacion','eliminaTipoPublicacion');
?>