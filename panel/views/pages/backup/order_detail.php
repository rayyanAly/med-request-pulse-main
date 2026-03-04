<link href="<?php echo base_url();?>theme/css/intlTelInput.css" rel="stylesheet"/>
<script src="<?php echo base_url();?>theme/js/intlTelInput.js">
</script>
<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Order No: #
            <?php echo $order_detail['order_id'];?>

        </h4>
    </div>
    

    <div class="col-md-6 text-right">

        <span class="status-bar"><span></span><?php echo strtoupper($order_detail['order_status']);?></span>

        <button class=" btn cancel-button-no-border <?php echo (($order_detail['order_status_id'] > 3 ) ? "disable-button" : "");?>" id="cancel_order" name="cancel_order">
            Cancel
        </button>
    </div>



</div>
<div class="row curve-with-shadow-no-padding n-row white">
    <div class="col-md-12 col-lg-12 col-sm-12 order-details">
        <!-- <div class="col-md-12">
            <h5>
                Customer Information
            </h5>
            <hr/>
        </div> -->
        <div class="row">
            <div class="col-md-3 order-detail-labels">
                <p class="heading-margin">
                    Personal Information
                </p>
                <p class="label-value">
                    <?php echo $order_detail['full_name'];?>
                    <br>
                        <?php echo $order_detail['contact_number'];?>
                    </br>
                </p>
                
                <p class="heading-margin">
                    
                        Delivery Time
                    
                </p>
                <p class="label-value">
                    <?php echo $order_detail['delivery_date'];?>
                    <?php echo $order_detail['delivery_time'];?>
                </p>


                <p  class="heading-margin">
                        <strong>
                            Payment Method
                        </strong>
                    </p>
                    <p class="label-value">
                        <?php echo $order_detail['payment_method'];?>
                    </p>
            </div>
            
            
            <div class="col-md-3 order-detail-labels">
                <p class="heading-margin">
                    Address
                </p>
                <p class="label-value">

                    <?php if($address['area'] != null):?>
                        <?php echo $address['title'];?><br />
                        <?php echo $address['apartment'];?>, <?php echo $address['house_building_no'];?> <?php echo $address['street'];?><br />
                        <?php echo $address['country'];?>

                        <?php else:?>
                            Delivery address not yet set!

                    <?php endif;?>

                </p>


                 <p class="heading-margin">
                            Comments
                    </p>
                    <p class="label-value">
                        <?php echo $order_detail['comments'];?>
                    </p>   

                
            </div>


            <div class="col-md-6 col-lg-6 col-sm-12 order-details">
                <p class="heading-margin">
                    Documents
                </p>
                <div class="image-container-attachment">
                    <?php 
                if(count($order_detail['attachments']) >
                    0){
                foreach($order_detail['attachments'] as $attachment):?>
                    <img onclick="openModal('<?php echo $attachment['attachment_url'];?>')" src="<?php echo $attachment['attachment_url'];?>"/>
                    <?php 
                    endforeach;
                }
                    ?>
                </div>
            </div>
        </div>
    </div>
    <div class="divider">
    </div>
    <div class="box-body row">
        <!-- product table -->
        

        <!--
        <div class="col-md-6">
            <div class="form-group has-search">
                <span class="fa fa-search form-control-feedback">
                </span>
                <input class="form-control full-search" id="search_product" name="search_product" placeholder="Seach product to add" type="text"/>
            </div>
        </div>

        <div class="col-md-6 controls">
            <input id="decrease_value" type="button" value="-"/>
            <input class="current-value" id="current_value" name="current_value" readonly="readonly" type="text" value="1"/>
            <input id="increase_value" type="button" value="+"/>
            <input id="add_item" type="button" value="Add" class="add-item"/>
        </div>-->
        
        <div class="col-md-12">
        <table class="table table-bordered" id="item_table" name= "item_table">
            <thead>
                <tr>
                   <!-- <th width="5%">
                        Image
                    </th>-->
                    <th>
                        Product Name
                    </th>
                    <th width="10%">
                        Qty
                    </th>
                    <th width="10%">
                        Price
                    </th>
                    <!--<th width="10%">
                        Discounts
                    </th>-->
                    <th width="10%">
                        Totals
                    </th>
                    <!--<th width="5%">
                    </th>-->
                </tr>
            </thead>
            <tbody>

        <?php 
                $counter = 0;

        if(count($order_detail['products']) >
        0):?>



                <?php 

                foreach($order_detail['products'] as $order):?>
                <tr <?php echo ((($counter % 2) == 0) ? "class='odd'" : '');?> id = "row_<?php echo $order['product_id'];?>">
                    <!--<td>
                        <img class="img" src="<?php echo $order['image'];?>"/>
                    </td>-->
                    <td>
                        <?php echo $order['name'];?>
                    </td>
                    <td>
                        <?php echo $order['quantity'];?>
                    </td>
                    <td>
                        <?php echo number_format($order['price'], 2, '.', ' ');?>
                    </td>
                    <!--<td>
                        <?php echo $order['discount_applied'];?>
                    </td>-->
                    <td>
                        <?php echo number_format(($order['price'] * $order['quantity']), 2, '.', ' ');?>
                    </td>
                    <!--<td class="small-delete-td">
                        <img src="<?php echo base_url();?>theme/images/close-icon.png" width="30" onclick="deleteItem('<?php echo $order['product_id'];?>')" class="small-delete"/>
                    </td>-->
                </tr>
                <?php 
                $counter++;
            endforeach;?>

                    <?php endif;?>
            </tbody>

        </table>
    </div>






        <div class="col-md-8 col-lg-8 col-sm-12">
            
            
                

                   <?php foreach($activities as $activity):?>
                    <div><strong><?php echo $activity['status'];?></strong></div>
                    <div style="margin-bottom: 5px;"><?php echo $activity['date_added'];?></div>
                   <?php endforeach;?>


                    


            
        </div>
        <div class="col-md-4 col-lg-4 col-sm-12">
            <table cellpadding="6" class="total-table">
                <!--<tr>
                    <td colspan="2">
                        <div clas="coupon-container">
                            <input class="coupon-code" id="coupon" name="coupon" placeholder="Coupon code" type="text"/>
                            <input class="apply-coupon-button" id="apply_coupon" name="apply_copuon" type="button" value="Apply"/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        Sub Total
                    </td>
                    <td class="value">
                        <span id="sub_total_value"><?php echo (!isset($order_detail['sub_total']) ? '0.00' : $order_detail['sub_total']);?></span>
                    </td>
                </tr>
                <tr>
                    <td>
                        Delivery Charges
                    </td>
                    <td class="value">
                        <span id="delivery_charge_value"><?php echo (!isset($order_detail['delivery_charges']) ? '0.00' : $order_detail['delivery_charges']);?></span>
                    </td>
                </tr>
                <tr class="discount">
                    <td>
                        Discount
                    </td>
                    <td class="value">
                        <span id="discount_value"><?php echo $order_detail['discount'];?></span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="divider">
                        </div>
                    </td>
                </tr>-->


                <tr class="total">
                    <td align="right">
                        Total
                    </td>
                    <td class="value">
                        <span id="total_value"><?php echo $order_detail['item_total'] == "0" ? "0.00" : number_format($order_detail['item_total'], 2, '.', ' ');?></span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        
                        <input type="hidden" name="product_sku" id="product_sku" value = "0" />
                        <?php if($order_detail['order_status_id'] < 4 ):?>

                        <!--<input class="accept-order submit-button" type="button" id="submit_button" value="<?php echo $label;?>"/>-->

                    <?php endif;?>

                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>

<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="mi-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                    <span aria-hidden="true">
                        ×
                    </span>
                </button>
            </div>
            <div class="modal-body">
                <div class="confirmation-box">
                    <img class="prescription-image" id="prescription_image" src=""/>
                </div>
            </div>
        </div>
    </div>
</div>




<!-- change status modal window -->
<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="change_status_modal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="confirmation-box">
                    <div class="image-container">
                        <img class="image" src="<?php echo base_url();?>theme/images/confirmation-icon.png"/>
                    </div>
                    <h4>
                        Are you sure?
                    </h4>
                    <p>
                        Do you really want to change the order status?.
                    </p>
                    <div class="buttons">
                        <button class="ok-button" id="continue_button" name="continue_button">
                            Continue
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
                        Do you really want to delete this request? The process cannot be undone.
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







<!-- cacnel modal window -->
<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="cancel-order-modal" role="dialog" tabindex="-1">
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
                        Do you really want to cancel this order?
                    </p>
                    <div class="buttons">
                        <button class="delete-button" id="cancel_button_action" name="cancel_button_action">
                            Confirm
                        </button>
                        <button class="can-button" id="can_button_action" name="can_button_action">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>





<script type="text/javascript">
     
      function openModal(iFrameUrl){
                
        $('#prescription_image').attr("src", iFrameUrl);
        $('#mi-modal').modal();

    }

var totalRows = parseInt('<?php echo $counter;?>');
var countries = <?php echo $products;?>;
var quantity = 1;
var itemArray = [];
var imageArray = [];

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].full_name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].full_name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].full_name.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i].full_name + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}
autocomplete(document.getElementById("search_product"), countries);




    $(function(){


        $('#submit_button').on('click', function(){
            $('#change_status_modal').modal();

        });

        $('#can_button').on('click', function(){
          $('#change_status_modal').modal('hide');
        });

        $('#continue_button').on('click', function(){
            update_order_status();
        });



    $('#add_item').on('click', function() {
        var itemObject = $('#search_product').val().split(" - ");
        $('#product_sku').val(itemObject[1]);


          var formData = {"id": $('#product_sku').val(), "quantity": $('#current_value').val(), "order_id": <?php echo $order_detail['order_id'];?>};

                $('#search_product').val('');
                $('#current_value').val(1)
                $('#product_sku').val(0);


          $.ajax({
                type: "POST",
                url: '<?php echo $add_product_url;?>',
                data: formData,
                success: function(data) {

                    console.log(data);

                    var responseData = JSON.parse(data);

                    if(responseData.success == '1'){

                        
                        var response = responseData.data;

                        $('#item_table > tbody:last').append('<tr class="' + (((totalRows % 2) == 0) ? "odd" : "") + '"  id="row_' + response.id + '"><td><img class="img" src="' + response.image + '" /></td><td>' + response.name + '</td><td>' + response.quantity + '</td><td>' + response.price + '</td><td>' + response.discount +  '</td><td>' + (response.price * parseInt(response.quantity)) + '</td><td class="small-delete-td"><img src="<?php echo base_url();?>theme/images/close-icon.png" onclick="deleteItem(' + response.id + ')" class="small-delete" /></td></tr>');

                        $('#sub_total_value').html(response.totals.sub_total);
                        $('#delivery_charge_value').html(response.totals.delivery);
                        $('#discount_value').html(response.totals.discount);
                        $('#total_value').html(response.totals.total);
                        totalRows++;

                    }else {
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


    });






    $('#decrease_value').on('click', function() {
        if (quantity > 1) {
            quantity--;
        }
        $('#current_value').val(quantity)
    })


    $('#increase_value').on('click', function() {
        if (quantity < 100) {
            quantity++;
        }
        $('#current_value').val(quantity)
    })


    $('#cancel_button_action').on('click', function(){


        <?php if($order_detail['order_status_id'] < 4):?>

            var formData = {"id": '<?php echo $order_detail['external_order_id'];?>', "cancel_key": '<?php echo $order_detail['cancel_key'];?>'}


             $.ajax({
                type: "POST",
                url: '<?php echo $cancel_order_url; ?>',
                timeout: 600000,
                data: formData,
                success: function(data) {
                    var responseData = JSON.parse(data);

                    if(responseData.success == '1'){

                        window.location = '<?php echo $confirmation_url;?>';

                    }else {

                        alert(responseData.error.message);

                    }
                    
                },
                error: function(data) {

                    console.log('An error occurred.');
                    console.log(data);
                },
            });

         <?php endif;?>


    });

    $('#can_button_action').on('click', function(){
                $('#cancel-order-modal').modal('hide');

    });

                            

    $('#cancel_order').on('click', function(){
        <?php if($order_detail['order_status_id'] < 4):?>

                $('#cancel-order-modal').modal();
            <?php endif;?>

    })








    })






    function update_order_status(){

            <?php if($order_detail['order_status_id'] < 5):?>
            var formData = {"id": <?php echo $order_detail['order_id'];?>, "internal_name": "<?php echo $next_action;?>"}

        <?php endif;?>
            $.ajax({
                type: "POST",
                url: '<?php echo $change_status_url; ?>',
                timeout: 600000,
                data: formData,
                success: function(data) {

                    var responseData = JSON.parse(data);

                    if(responseData.success == '1'){

                        window.location = '<?php echo $confirmation_url;?>';

                    }else {

                        alert(responseData.error.message);

                    }
                    
                },
                error: function(data) {

                    console.log('An error occurred.');
                    console.log(data);
                },
            });


    }




    function deleteItem(item) {

        if(confirm("are you sure want to delet this item?")){

            var formData = {"id": item, "order_id": <?php echo $order_detail['order_id'];?>}

            $.ajax({
                type: "POST",
                url: '<?php echo $delete_product_url; ?>',
                timeout: 600000,
                data: formData,
                success: function(data) {

                    var responseData = JSON.parse(data);

                    if(responseData.success == '1'){

                        var response = responseData.data;

                        $('#sub_total_value').html(response.totals.sub_total);
                        $('#delivery_charge_value').html(response.totals.delivery);
                        $('#discount_value').html(response.totals.discount);
                        $('#total_value').html(response.totals.total);


                    }else {

                        alert(responseData.error.message);

                    }
                    
                },
                error: function(data) {

                    console.log('An error occurred.');
                    console.log(data);
                },
            });







            $('#row_' + item).remove();
        }

    }



    
        
    



</script>
