<?php

//DEFINIR CLASES MAPEADAS CON BD
class etiqueta {
		public $idetiqueta;
		public $nombre;
		public $observacion;
		public $estado;
		public $ididioma;
		
	function __construct($idetiqueta,$nombre, $observacion, $estado,$ididioma) {
			$this->idetiqueta=$idetiqueta;
			$this->nombre = $nombre;
			$this->observacion = $observacion;
			$this->estado = $estado;
			$this->ididioma = $ididioma;
		}
	}

?>