<div class="row curve-with-shadow n-row white tabs">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
            <a aria-controls="home" aria-selected="true" class="nav-link active" data-toggle="tab" href="#home" id="home-tab" role="tab">
                Cusotmer Notifications
            </a>
        </li>
        <li class="nav-item">
            <a aria-controls="profile" aria-selected="false" class="nav-link" data-toggle="tab" href="#profile" id="profile-tab" role="tab">
                Payments
            </a>
        </li>

    </ul>
    <div class="tab-content" id="myTabContent">
        <div aria-labelledby="home-tab" class="tab-pane fade show active" id="home" role="tabpanel">
            
            <div class="row">
                <!-- <div class="col-md-12"><p><input type="checkbox" name="sms_notification" id = "sms_notification" value = "1" checked="checked" /> Enable Notifications</div> -->



            <div class="col-md-6 sms-setting-tab">
                
                    <p><input type="checkbox" id="sms_integration" name="sms_integration" value="1" />Custom API Integation</p>
                    
                    <div class="api-integration" id="api_container">

                        <div class="form-group">
                        <label for="email">
                            SMS API URL
                            <span class="required">
                                *
                            </span>
                        </label>
                        <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber" />
                        </div>

                        <div class="form-group">
                        <label for="email">
                            SMS User Name
                            <span class="required">
                                *
                            </span>
                        </label>
                            <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber" />
                        </div>


                        <div class="form-group">
                            <label for="email">
                            SMS Password
                                <span class="required">
                                    *
                                </span>
                            </label>
                            <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber" />
                        </div>



                        <div class="form-group">
                            <label for="email">
                                SMS Sender ID 
                                <span class="required">
                                    if any
                                </span>
                            </label>
                            <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber" />
                        </div>

                        <div class="form-group">
                        <input type="button" value="Update" class="btn btn-primary" />
                        </div>

                    </div>

            </div><!-- end of col-md-6-->





            <div class="col-md-6 sms-setting-tab">


                    <p>&nbsp;</p>
                    
                    <div class="api-integration" id="api_container">

                        <div class="form-group">
                            <label for="email">
                                Email Host Name
                                <span class="required">
                                    *
                                </span>
                            </label>
                            <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber" />
                        </div>


                        <div class="form-group">
                            <label for="email">
                                Email User Name
                                <span class="required">
                                    *
                                </span>
                            </label>
                            <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber"  />
                        </div>


                        <div class="form-group">
                            <label for="email">
                                Email Password
                                <span class="required">
                                    *
                                </span>
                            </label>
                            <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber" />
                        </div>


                        <div class="form-group">
                            <label for="email">
                                From Name
                                <span class="required">
                                    if any
                                </span>
                            </label>
                            <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="mumber" />
                        </div>


                        <div class="form-group">
                            <input type="button" value="Update" class="btn btn-primary" />
                        </div>


                    </div>
                    <!-- end of api integtaion -->


            </div><!-- end of col-md-6-->

        </div><!-- row end-->

            


        <form name="notifcation_setting" id="notifcation_setting" method="post">

            <div class="col-md-12 setting-listing">
                
                <table class="table table-bordered table-striped">
                      
                      <thead>
                        <tr>
                          <th scope="col" width="80%">Notification</th>
                          <th scope="col" width="10%">SMS</th>
                          <th scope="col">Email</th>
                        </tr>
                      </thead>
                    
                    <tbody>

                    <?php foreach($settings as $setting):?>        
                        <tr>
                          <td><?php echo $setting['title'];?><input type="hidden" name="ids[]" value="<?php echo $setting['id'];?>" /></td>
                          

                          <td>

                            <input type="checkbox" value="1" id="sms_checkbox_<?php echo $setting['id'];?>" name="sms[]" <?php echo (($setting['sms'] == "1" ) ? "checked" : "");?> onchange="update_sms('sms_<?php echo $setting['id'];?>', 'sms_checkbox_<?php echo $setting['id'];?>')" />
                          
                          <input type="hidden" id="sms_<?php echo $setting['id'];?>" name="smsData[]" value="<?php echo (($setting['sms'] == "1" ) ? "1" : "0");?>" />  

                          </td>
                          

                          <td>

                            <input type="checkbox" value="1" id="email_checkbox_<?php echo $setting['id'];?>" name="email[]" <?php echo (($setting['email'] == "1" ) ? "checked" : "");?> onchange="update_sms('email_<?php echo $setting['id'];?>', 'email_checkbox_<?php echo $setting['id'];?>')" />
                          
                          <input type="hidden" id="email_<?php echo $setting['id'];?>" name="emailData[]" value="<?php echo (($setting['email'] == "1" ) ? "1" : "0");?>" />  

                          </td>


                        </tr>

                    <?php endforeach;?>
                    </tbody>
                
                </table>

                <div class="form-group">
                    <input type="button" onclick="submit_settings()" value="Update" id="update_setting" class="btn btn-primary" />
                </div>

            </div> <!-- end of table div -->

        </form>






        </div> <!-- end of first tab -->

        

        <div aria-labelledby="profile-tab" class="tab-pane fade" id="profile" role="tabpanel">
            Two
        </div><!-- end of second tab -->


    </div>
</div>




<!-- modal window -->
<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="mi-modal-uploading" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="confirmation-box">
                    <div class="image-container">
                        <img class="image" src="<?php echo base_url();?>theme/images/confirmation-icon.png"/>
                    </div>
                    <h4>
                        Updating!
                    </h4>
                    <p>
                        Please wait....
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>



<script type="text/javascript">

    $(document).ready(function(){

        $('#sms_notification').on('click', function(){

            if($(this).prop("checked") == true){
                $('.sms-setting-tab').show();
            }else {
                $('.sms-setting-tab').hide();
            }

        });

        $('#sms_integration').on('click', function(){

            if($(this).prop("checked") == true){
                $('.api-integration').show();
            }else {
                $('.api-integration').hide();
            }

        });
        

    })

    function update_sms(div_name, obj_name){

        if($('#' + obj_name).is(":checked")){
            $('#' + div_name).val(1);

        }else {
            $('#' + div_name).val(0);

        }
    }

    function submit_settings(){


            $('#update_setting').val('wait...');
            $('#update_setting').prop("disabled",true);

            var frm = $('#notifcation_setting')[0];
            var formData = new FormData(frm);



                    $('#mi-modal-uploading').modal({
                                       backdrop: 'static',
                                       keyboard: false
                        });
            $.ajax({
                type: "POST",
                url: '<?php echo site_url("c=settings&m=update_setting");?>',
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                cache: false,
                timeout: 600000,
                data: formData,
                success: function(data) {

                    var responseData = JSON.parse(data);

                    if(responseData.success == '1'){
                                $('#mi-modal-uploading').modal('hide');
                                    $('#update_setting').val('Update');
                                    $('#update_setting').prop("disabled",false);


                    }else {

                        alert(responseData.error.message);

                    }


                    
                },
                error: function(data) {

                $('#update_setting').val('Update');
                $('#update_setting').prop("disabled",false);

                    console.log('An error occurred.');
                    console.log(data);
                },
            });

    }

</script>