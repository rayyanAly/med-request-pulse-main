<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>

<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Create New Product
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <!-- <button class=" btn btn-primary" id="add_products" name="add_products">
            + Add Products
        </button> -->
    </div>
</div>

<form class="create-product" id="create_product" method="POST" name="create_product">
    <div class="row curve-with-shadow n-row white">
        
        
        <div class="col-md-6">
            <div class="form-group">
                <label for="email">
                    Product Name
                    <span class="required">
                        *
                    </span>
                </label>
                <input autocomplete="off" class="form-control" id="product_name" maxlength="50" name="product_name" type="text">
                </input>
            </div>


            <div class="form-group">
                <label for="email">
                    Unit Size
                    <span class="required">
                        
                    </span>
                </label>
                <input autocomplete="off" class="form-control" id="unit_size" maxlength="50" name="unit_size" type="text">
                </input>
            </div>


            <div class="form-group">
                <label for="email">
                    Price
                    <span class="required">
                    * 
                    </span>
                </label>
                <input autocomplete="off" class="form-control" id="price" maxlength="15" name="price" type="mumber">
                </input>
            </div>


            <div class="form-group">
                <label for="email">
                    Description
                    <span class="required">
                    * 
                    </span>
                </label>
                <textarea id="editor" name="editor"></textarea>
                </input>
            </div>
            

        </div>



        <div class="col-md-6">
            

            <div class="form-group">
                <label for="erx">
                    SKU number
                    <span class="required">
                        *
                    </span>
                </label>
                <input class="form-control" id="sku" maxlength="20" name="sku" type="text">
                </input>
            </div>


            
            <div class="form-group">
                <label for="erx">
                    Category
                    <span class="required">
                        *
                    </span>
                </label>
                    <br />
                    <select class="select-box-full">
                        <option>Select category</option>

                        <?php foreach($categories as $category):?>
                            <option><?php echo $category['name'];?></option>
                        <?php endforeach;?>
                    </select>
            </div>


            <div class="form-group ">
                <label for="prescription">
                    Upload Documents
                </label>
                    <input class="form-control" id="thumb" name="thumb" type="file" />
            </div>


                 <div class="button-container" style="margin-top:180px !important;">
                
                <input class="btn btn-primary submit-button" id="submit_button" onclick="submit_form_data()" type="button" value="Submit">
                    <input class="btn btn-link link-button" id="cancel_button" type="button" value="Cancel">
                    </input>
                </input>
                </div>




            
        </div>



    </div>
</form>



<script type="text/javascript">

    $(function() {

    $('#product_name').on('focus', function(){
        $(this).removeClass('error');
    });


    $('#sku').on('focus', function(){
        $(this).removeClass('error');
    });

    $('#price').on('focus', function(){
        $(this).removeClass('error');
    });

    $('#cancel_button').click('click', function(){
        window.location = '<?php echo $success_url;?>';
    })


});

    

    function submit_form_data() {


            var frm = $('#create_product')[0];
            var formData = new FormData(frm);
            
            var error = false;



            if($('#product_name').val().length < 8){
                $('#product_name').addClass('error');
                error = true;

            }else {
                $('#product_name').removeClass('error');

            }


             if($('#sku').val().length < 8){
                $('#sku').addClass('error');
                error = true;

            }else {
                $('#sku').removeClass('error');

            }


            if($('#price').val().length < 8){
                $('#price').addClass('error');
                error = true;

            }else {
                $('#price').removeClass('error');

            }


            if (error){

                return;
            }

            $('#submit_button').val('wait...');
            $('#submit_button').prop("disabled",true);


        }

        tinymce.init({
    selector: 'textarea#editor',
    skin: 'bootstrap',
    plugins: 'lists, link, image, media',
    toolbar: 'h1 h2 bold italic strikethrough blockquote bullist numlist backcolor | link image media | removeformat help',
    menubar: false
  });


</script>
