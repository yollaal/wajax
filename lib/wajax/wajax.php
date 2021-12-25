<?php




class wajax {


    public $w_character_code ='UTF-8';
    public $filter;
    public $w_is_get_params=false;
    public $w_path;
    public $w_data;
    public $no_ajax;
    public $api;

    function __construct()
    {

        $this->get_post_params();

    }



    static function get_request_params()
    {


        if(count($_REQUEST) > 0){
            $D = $_REQUEST;
        }

        if(count($ARRAY) > 0){
            foreach($ARRAY as $key => $value){
                $D[$key] = $value;
            }
        }

        $JSON_DATA = json_decode(file_get_contents('php://input'), 1);
        if(count($JSON_DATA) > 0){
            foreach($JSON_DATA as $key => $value){
                $D[$key] = $value;
            }
        }

        if($D['json']){
            $DATA = json_decode($D['json'], 1);
            if(count($DATA) > 0){
                foreach($DATA as $key => $value){
                    $D[$key] = $value;
                }
            }
        }

        if(count($D) > 0){
            foreach($D as $key => $value){
                $D[$key] = !is_array($value) ? trim($value) : $value;
            }
        }


        $D = wajax::trim_array($D);

        return $D;

    }


    public function get_post_params($ARRAY=[])
    {



        if(!$this->w_is_get_params){


            $D = wajax::get_request_params();



            $this->filter = $D['filter'];
            $this->data = $D['data'];
            $this->all = $D['all'];
            $this->get = $D;
            $this->w_is_get_params = true;


        }



        return $this->filter;

    }

    static function trim_array($arrObjData)
    {
        if(is_array($arrObjData)){
            foreach($arrObjData as $index => $value){
                if(is_array($value)){
                    $S[$index] = wajax::trim_array($value);
                }else{
                    $S[trim($index)] = trim($value);
                }
            }
        }
        return $S;
    }


    public function set_char_code($data){

        $this->w_character_code = $data;
    }



    public function alert($data){

        $this->wdata['action'][]['alert'][] = $data;
    }

    public function assign($tag, $content){

        $this->html($tag,$content);
    }



    public function append($tag, $content){
        $this->wdata['action'][]['append'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }


    public function prepend($tag, $content){
        $this->wdata['action'][]['prepend'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }


    public function before($tag, $content){
        $this->wdata['action'][]['before'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }

    public function after($tag, $content){
        $this->wdata['action'][]['after'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }


    public function insertAfter($tag, $content){
        $this->wdata['action'][]['insertAfter'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }

    public function insertBefore($tag, $content){
        $this->wdata['action'][]['insertBefore'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }

    public function remove($tag ){
        $this->wdata['action'][]['remove'][] = $tag;
    }

    public function val($tag, $content ){
        $this->wdata['action'][]['val'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }

    public function html($tag, $content ){
        $this->wdata['action'][]['html'][] = array(
            'tag'=>$tag,
            'content'=>$content,
        );
    }

    public function script($data){

        $this->wdata['action'][]['script'][] = $data;

    }

    public function console_clear($data){

        $this->wdata['action'][]['console_clear'][] = 1;
        if($data)$this->wdata['action'][]['console'][] = $data;


    }

    public function console($data){

        $this->wdata['action'][]['console'][] = $data;

    }

    public function redirect($data){

        $this->wdata['action'][]['redirect'][] = $data;
    }
    public function excel($filename,$data){

        $this->wdata['action'][]['excel'][] = ['filename'=>$filename,'data'=>base64_encode($data)];
    }

    public function confirm( $message,$script)
    {
        $this->wdata['action'][]['confirm'][] = ['message'=>$message,'script'=>$script];
    }

    public function confirmSwallDelete( $message,$script)
    {
        $this->wdata['action'][]['confirm_swall'][] = [
            'title'=>"",
            'message'=>$message,
            'script'=>$script,
            'type'=>"error"
        ];
    }


    public function confirmSwall( $title,$message,$script)
    {
        $this->wdata['action'][]['confirm_swall'][] = [
            'title'=>$title,
            'message'=>$message,
            'script'=>$script
        ];
    }





    public function _exit(){

        global $no_ajax;

        if($this->no_ajax OR $no_ajax){
            return $this->w_data;
        }else{
            header('Content-type: application/json; charset='.$this->w_character_code);
            $this->wdata['status']=true;
            print json_encode($this->wdata);
            exit;
        }
    }


    public function __destruct()
    {

        $this->_exit();

    }
}


function wajax_run($path,$char_code="UTF-8")
{

    $REQUEST = wajax::get_request_params();

    $page = $REQUEST['page'];
    $action = $REQUEST['action'];

    $function_file_path = $path."/".$page."/ajax.".$page.".php";

    if(!is_file($function_file_path)){
        header('Content-type: application/json; charset='.$char_code);
        $array['status'] = false;
        $array['message'] = $function_file_path." - Dosyası Bulunamadı";
        print json_encode($array,1);
        exit;
    }

    include $function_file_path;



    if(!method_exists($page, $action)){
        $errStr =
            '--------------------------------------------------------'."\n".
            'Bilinmeyen Modül "'.$page.'.'.$action.'"" ...!'."\n".
            '--------------------------------------------------------';
        header('Content-type: application/json; charset='.$char_code);
        $array['status'] = false;
        $array['message'] = $errStr;
        print json_encode($array,1);
        exit;

    }else{
        $modul = new $page($_REQUEST);
        $modul->$action();
        $modul->w_character_code=$char_code;
        $modul->w_path=$path;
    }
    return;
}

 