<?php

class test extends ajax_server
{
    function __construct()
    {
        parent::__construct();
    }

    #filter parametresinden gelen username ve password ile users tablosunda kullanıcıyı bulur ve panele yönlendirir.
    public function login()
    {
        $this->ajax->console( [
            $this->filter,
        ]);
    }

    public function __destruct()
    {

    }

}