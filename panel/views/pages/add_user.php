<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            <?php echo (($edit_mode) ? "Update User" : "Add New User");?>
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <?php if ($edit_mode):?>
        <button class=" btn cancel-button-no-border" id="delete_user_button" name="delete_user_button">
            Delete
        </button>
    <?php endif;?>
    </div>
</div>



<div class="row curve-with-shadow-no-padding n-row white">
    
    
            <div class="col-md-12 order-detail-labels">
                <p><strong>Account Informations</strong></p>
            </div>
            <div class="divider" ></div>

            <div class="col-md-12 add-user-form">
                
                    <form method="post" name="create_user" id="create_user">

                        <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-1 col-form-label">Full Name*</label>
                            <div class="col-sm-11">
                              <input type="text" class="form-control" id="full_name" maxlength="50" name="full_name" value="<?php echo (($edit_mode) ? $user_details['full_name'] : '');?>">
                            </div>
                          </div>

                          <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-1 col-form-label">Email*</label>
                            <div class="col-sm-11">
                              <input type="email" class="form-control" id="email" name="email" maxlength="50" value="<?php echo (($edit_mode) ? $user_details['email'] : '');?>" />
                            </div>
                          </div>


                          <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-1 col-form-label">Phone*</label>
                            <div class="col-sm-11">
                              <input type="number" class="form-control" id="phone" name="phone" value="<?php echo (($edit_mode) ? $user_details['phone'] : '');?>" />
                            </div>
                          </div>
<!-- 
                          <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-1 col-form-label">User Name*</label>
                            <div class="col-sm-11">
                              <input type="text" class="form-control" id="username" name="username" maxlength="50" value="<?php echo (($edit_mode) ? $user_details['user_name'] : '');?>" />
                            </div>
                          </div> -->


                          <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-1 col-form-label">Password*</label>
                            <div class="col-sm-11">
                              <input type="password" class="form-control" id="password" name="password" maxlength="50" value="<?php echo (($edit_mode) ? $user_details['password'] : '');?>" />
                            </div>
                          </div>


                          <div class="form-group row">
                            <label for="inputEmail3" class="col-sm-1 col-form-label">Position</label>
                            <div class="col-sm-11">
                              <select name="position" id="position" class="form-control">
                                  <option value="admin" <?php echo (($edit_mode && $user_details['partner_user_type_id'] == "admin") ? "selected" : '');?>>Admin</option>
                                  <option value="manager" <?php echo (($edit_mode && $user_details['partner_user_type_id'] == "manager") ? "selected" : '');?>>Manager</option>
                                  <option value="user" <?php echo (($edit_mode && $user_details['partner_user_type_id'] == "user") ? "selected" : '');?>>User</option>
                              </select>

                              <?php if($edit_mode):?>
                                <input type="hidden" name="id" id="id" value = "<?php echo $user_details['partner_user_external_id'];?>" />
                              <?php endif;?>
                            </div>
                          </div>


                          

                    </form>

<div class="row submit-container">
                            <div class="col-md-1"></div>
                                <div class="col-md-11">
                                <button onclick="submit_form()" class="btn btn-primary" id="submit_button">Submit</button>
                                <button id="cancel_button" class="btn btn-secondary">Cancel</button>
                            </div>
                          </div>
            </div>

</div>





<!-- modal window -->
<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="mi-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="confirmation-box">
                    <div class="image-container">
                        <img class="image" src="<?php echo base_url();?>theme/images/confirmation-icon.png"/>
                    </div>
                    <h4>
                        Thank You!
                    </h4>
                    <p>
                        User Created Successfully!
                    </p>
                    <button class="continue-button" id="continue_button" name="continue_button">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- cacnel modal window -->
<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="cancel-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="confirmation-box">
                    <div class="image-container">
                        <img class="image" src="<?php echo base_url();?>theme/images/error-icon.png"/>
                    </div>
                    <h4>
                        Are you sure?
                    </h4>
                    <p>
                        Do you really want to delete this user? The process cannot be undone.
                    </p>
                    <div class="buttons">
                        <button class="delete-button" id="delete_button" name="delete_button">
                            Delete
                        </button>

                        <button class="can-button" id="can_button" name="can_button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



<script type="text/javascript">
    $(function(){


        $(".toggle-password").click(function() {

          $(this).toggleClass("fa-eye fa-eye-slash");
          var input = $($(this).attr("toggle"));
          if (input.attr("type") == "password") {
            input.attr("type", "text");
          } else {
            input.attr("type", "password");
          }
        });



        $('#full_name').on('focus', function() {
            $(this).removeClass('error');
        });
        $('#email').on('focus', function() {
            $(this).removeClass('error');
        });
        $('#phone').on('focus', function() {
            $(this).removeClass('error');
        });
        $('#password').on('focus', function() {
            $(this).removeClass('error');
        });

        $('#username').on('focus', function() {
            $(this).removeClass('error');
        });

        $('#cancel_button').on('click', function(){
            window.location = '<?php echo $success_url;?>';
        });



        $('#delete_user_button').on('click',function(){
        $('#cancel-modal').modal({
                    backdrop: 'static',
                    keyboard: false
                });

    });


    $('#delete_button').on('click',function(){
        $('#cancel-modal').modal('hide');
        


           $.ajax({
                type: "POST",
                url: '<?php echo $submission_url; ?>',
                timeout: 600000,
                data: $('#create_user').serialize()+ "&action=delete",
                success: function(data) {

                    var responseData = JSON.parse(data);

                    if (responseData.success == '1') {
                            window.location = '<?php echo $success_url;?>';

                    } else {

                        alert(responseData.error.message);

                    }


                    
                },
                error: function(data) {

                $('#submit_button').val('Submit');
                $('#submit_button').prop("disabled",false);

                    console.log('An error occurred.');
                    console.log(data);
                },
            });






    })


    $('#can_button').on('click',function(){
        $('#cancel-modal').modal('hide');

    });





    });



    function submit_form(){

        var error = false;
        if ($('#full_name').val().length < 3) {
            $('#full_name').addClass('error');
            error = true;
        } else {
            $('#full_name').removeClass('error');
        }



/*        if ($('#username').val().length < 3) {
            $('#username').addClass('error');
            error = true;
        } else {
            $('#username').removeClass('error');
        }
        */
        
        if ($('#email').val().length < 3 || !validateEmail($('#email').val())){
            $('#email').addClass('error');
            error = true;
        } else {
            $('#email').removeClass('error');
        }

        if ($('#phone').val().length < 8){
            $('#phone').addClass('error');
            error = true;
        } else {
            $('#phone').removeClass('error');
        }


        if ($('#password').val().length < 3){
            $('#password').addClass('error');
            error = true;
        } else {
            $('#password').removeClass('error');
        }

        $('#continue_button').on('click', function(){
                $('#mi-modal').modal('hide');
                window.location = '<?php echo $success_url;?>';

            })


        if (error) {
            return;
        }
        $('#submit_button').val('wait...');
        $('#submit_button').prop("disabled", true);


        var frm = $('#create_user');
        //var formData = new FormData(frm);
                
                $.ajax({
                type: "POST",
                url: '<?php echo $submission_url; ?>',
                timeout: 600000,
                data: $('#create_user').serialize() + "&action=delete",
                success: function(data) {

                    console.log(data);
                    var responseData = JSON.parse(data);

                    if (responseData.success == '1') {
                        $('#mi-modal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });

                    } else {

                        alert(responseData.error.message);

                    }


                    
                },
                error: function(data) {

                $('#submit_button').val('Submit');
                $('#submit_button').prop("disabled",false);

                    console.log('An error occurred.');
                    console.log(data);
                },
            });

    }


    //Helper functions 
    function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    }


</script>
