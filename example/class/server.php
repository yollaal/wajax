<?php


require_once("../../lib/wajax/wajax.php");

class ajax_server
{


    public $no_ajax;

    function __construct()
    {



        $ajax = new wajax();
        $this->ajax = $ajax;

        $this->filter = $this->ajax->filter;
        $this->data = $this->ajax->data;
        $this->get = $this->ajax->get;
        $this->all = $this->ajax->all ;
        $this->tanim = $this->ajax->tanim ;


    }

    public function __destruct()
    {


    }

}




