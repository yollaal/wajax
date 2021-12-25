<?php

define('SITE_ROOT_FOLDER',__DIR__."/");


?>
<!doctype html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Wajax Example</title>


    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"   defer />



</head>
<body>
<div id="popup_list"></div>

<div class="container">

    <form id="form1"  class="" method="POST"  w-form="form1">
    <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" name="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password"  name="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <div class="checkbox">
            <label>
                <input name="checkbox" type="checkbox"> Check me out
            </label>
        </div>
        <button w-click="test/login" type="button" class="btn btn-default">Submit</button>
        <div class="return1"></div>
    </form>
</div>

<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"  ></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"  crossorigin="anonymous"></script>
<script type="text/javascript" src="../lib/wajax/wajax.js"     ></script>
<script type="text/javascript">



    function ajaxStartEvent() {

    }

    function ajaxFinalEvent() {

    }


    $(document).ready(function (e) {

        ajax.run('class/ajax.php', 'ajaxStartEvent', 'ajaxFinalEvent');

    });
</script>


</body>
</html>