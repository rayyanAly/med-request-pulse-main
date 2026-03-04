<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <!-- Mobile viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Login | Partnership Panel</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="<?php echo base_url(); ?>theme/css/components/normalize.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>theme/css/bootstrap/bootstrap.min.css">

    <link rel="stylesheet" href="<?php echo base_url(); ?>theme/css/styles.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>theme/css/responsive.css">
    <link rel="stylesheet" href="<?php echo base_url(); ?>theme/css/custom.css">

    <!-- Javascript -->
    <script src="<?php echo base_url(); ?>theme/js/components/jquery-3.4.1.min.js"></script>
    <script src="<?php echo base_url(); ?>theme/js/main.js"></script>

</head>

<body>

    <div class="login-view">


        <div class="login-logo">
            <img src ="<?php echo base_url();?>theme/images/logo-main.png" />
        </div>


        <h1>Welcome! <br> Login to access partnership panel</h1>

        <div class="login-form">

            <form name="login)form" id="login_form" action="<?php echo $validation_url; ?>" method="POST">
                <div class="input-control" id="username_container">
                    <span class="ico ico-lock"></span>
                    <input type="text" name="user_name" id="user_name" class="input-field" placeholder="username">
                </div>
                <div class="input-control" id="password_container">
                    <span class="ico ico-user"></span>
                    <input type="password" name="password" id="password" class="input-field" placeholder="password">
                </div>
                <input type="button" onclick="submit_form_data()" value="login" class="btn-login">
<!--                 <a href="#">forgot your password?</a>
 -->            </form>

        </div> <!-- Login Form -->

    </div> <!-- Login View -->




    <script>

            $(function() {
            
                $('#user_name').on('focus', function(){
                    $('#username_container').removeClass('error');
                });

                $('#password').on('focus', function(){
                    $('#password_container').removeClass('error');
                });

            });

        function submit_form_data() {

            var frm = $('#login_form');
            var error = false


            if($('#user_name').val().length < 3){
                $('#username_container').addClass('error');
                error = true;

            }else {
                $('#username_container').removeClass('error');

            }

             if($('#password').val().length < 3){
                $('#password_container').addClass('error');
                error = true;

            }else {
                $('#password_container').removeClass('error');

            }

            if(error){
                return;

            }

            console.log(frm.serialize());

            $.ajax({
                type: "POST",
                url: '<?php echo $validation_url; ?>',
                data: frm.serialize(),
                success: function(data) {
                    console.log(data);

                    var responseData = JSON.parse(data);

                    if(responseData.success == '1'){
                        window.location = '<?php echo $success_url;?>';

                    }else {

                        alert(responseData.error.message);

                    }
                    
                },
                error: function(data) {
                console.log(data);
                    console.log('An error occurred.');
                    console.log(data);
                },
            });

        }

    </script>



</body>

</html>