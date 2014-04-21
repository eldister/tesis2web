<?php

//DEFINIR CLASES MAPEADAS CON BD
class publicacion {
		public $idpublicacion;
		public $titulo;
		public $fuente;
		public $obtenido;
		public $anio;
		public $mes;
		public $paginas;
		public $volumen;
		public $doi;
		public $issn;
		public $estado;
		public $fechaRegistro;
		public $ididioma;
		public $idtipopublicacion;
		
	function __construct($idpublicacion,$titulo, $fuente, $obtenido,$anio,$mes,
						$paginas,$volumen,$doi,$issn,$estado,$fechaRegistro,$ididioma,$idtipopublicacion) 
	{
			$this->idpublicacion=$idpublicacion;
			$this->titulo = $titulo;
			$this->fuente = $fuente;
			$this->obtenido = $obtenido;
			$this->anio = $anio;
			$this->mes=$mes;
			$this->paginas = $paginas;
			$this->volumen = $volumen;
			$this->doi = $doi;
			$this->issn = $issn;
			$this->estado=$estado;
			$this->fechaRegistro = $fechaRegistro;
			$this->ididioma = $ididioma;
			$this->idtipopublicacion = $idtipopublicacion;			
	}
}

?>