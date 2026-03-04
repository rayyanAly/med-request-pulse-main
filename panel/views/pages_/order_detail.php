<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Order No: #<?php echo $order_detail['order_id'];?>
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <button class=" btn cancel-button-no-border" id="add_products" name="add_products">
            Cancel
        </button>
    </div>
</div>
<div class="row curve-with-shadow-no-padding n-row white">
    
        <div class="col-md-6 col-lg-6 col-sm-12 order-details">
            <div class="row">
                <div class="col-md-6 order-detail-labels">
                    
                    <p>
                        <strong>Customer Information</strong>
                    </p>
                    <p class="label-value">
                        <?php echo $order_detail['full_name'];?><br ><?php echo $order_detail['contact_number'];?>
                    </p>

                    <p>
                        <strong>Delivery Time </strong>
                    </p>
                    <p class="label-value">
                        <?php echo $order_detail['delivery_date'];?> <?php echo $order_detail['delivery_time'];?>
                    </p>


                </div>
                <div class="col-md-6 order-detail-labels">


<p>
                        <strong>ERX No: </strong>
                    </p>
                    <p class="label-value">
                        <?php echo $order_detail['erx'];?>
                    </p>


                    <p>
                        <strong>Payment Method</strong>
                    </p>
                    <p class="label-value">
                        <?php echo $order_detail['payment_method'];?>
                    </p>

                </div>
            </div>
        </div>




        <div class="col-md-6 col-lg-6 col-sm-12 order-details">

            <div class="image-container-attachment">
                <?php 
                if(count($order_detail['attachments']) > 0){
                foreach($order_detail['attachments'] as $attachment):?>
                    <img src="<?php echo $attachment['attachment_url'];?>" />
                <?php 
                    endforeach;
                }
                    ?>
            </div>

        </div>






    <div class="divider"></div>
    <div class="box-body row">

        <?php if(count($order_detail['products']) > 0):?>
            <!-- product table -->
            <table class="table table-bordered">
            <thead>
                <tr>
                    <th width="8%" >
                        Image
                    </th>

                    <th>
                        Product Name
                    </th>

                    <th width="10%">
                        Qty
                    </th>

                    <th width="10%">
                        Price
                    </th>

                    <th width="10%">
                        Discounts
                    </th>

                    <th width="10%">
                        Totals
                    </th width="10%">

                  
                    
            </thead>
            <tbody>
                

                            <?php foreach($order_detail['products'] as $order):?>
                            <tr>
                              <td><img src="<?php echo $order['image'];?>" class="img" /></td>  
                              <td><?php echo $order['name'];?></td>
                              <td><?php echo $order['quantity'];?></td>
                              <td><?php echo $order['price'];?></td>
                              <td><?php echo $order['discount_applied'];?></td>
                              <td><?php echo $order['total'];?></td>
                            </tr>
                            <?php endforeach;?>


                            
            </tbody>
        </table>
    <?php endif;?>

            <div class="col-md-8 col-lg-8 col-sm-12">
                <p>
                        <strong>Notes:</strong>
                    </p>
                    <p class="label-value">
                        <?php echo $order_detail['comments'];?>
                    </p>

            </div>
            <div class="col-md-4 col-lg-4 col-sm-12">

                <table class="total-table" cellpadding="8">
                    <tr>
                        <td>Sub Total</td>
                        <td class="value"><?php echo (!isset($order_detail['sub_total']) ? '0.00' : $order_detail['sub_total']);?></td>
                    </tr>
                    <tr>
                        <td>Delivery Charges</td>
                        <td class="value"><?php echo (!isset($order_detail['delivery_charges']) ? '0.00' : $order_detail['delivery_charges']);?></td>
                    </tr>
                    <tr class="discount">
                        <td>Discount</td>
                        <td class="value"><?php echo $order_detail['discount'];?></td>
                    </tr>
                    <tr>
                        <td colspan="2"><div class="divider"></div></td>
                        
                    </tr>
                    <tr class="total">
                        <td>Total</td>
                        <td class="value"><?php echo $order_detail['total'] == "0" ? "0.00" : $order_detail['total'];?></td>
                    </tr>
                </table>

            </div>


    </div>



</div>
