<?php

//DEFINIR CLASES MAPEADAS CON BD
class ficha {
		public $idfichabib;
		public $encabezado;
		public $titulo_abreviado;
		public $contenido;
		public $estado;
		public $idpublicacion;
		public $idtipoFicha;
		
	function __construct($idfichabib,$encabezado, $titulo_abreviado, $contenido,$estado,$idpublicacion,$idtipoFicha) {
			$this->idfichabib=$idfichabib;
			$this->encabezado = $encabezado;
			$this->titulo_abreviado = $titulo_abreviado;
			$this->contenido = $contenido;
			$this->estado = $estado;
			$this->idpublicacion = $idtipoFicha;
			$this->idtipoFicha = $idtipoFicha;
		}
	}

?>