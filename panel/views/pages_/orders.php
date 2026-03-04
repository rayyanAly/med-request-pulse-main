<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Order Status
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <button class=" btn btn-primary" id="create_order">
            Create New Order
        </button>
    </div>
</div>
<div class="row">
    <div class="col-md-4">
        <div class="curve-with-shadow-no-padding n-box white">


            <div class="box-header">
                <!-- <div class="datepicker">
                    <input name="daterange" type="daterange" value="Date">
                    </input>
                    <i class="fa fa-chevron-down"></i>
                </div> -->
            </div>
            <div class="divider"></div>

            <div class="box-body">
                <div class="left-box"><img src="<?php echo base_url();?>theme/images/total_orders.png" /></div>
                <div class="right-box"><p>Total Orders<br /><span class="value-heading total-orders"><?php echo $total_orders;?></span></p></div>
            </div>

        </div>
    </div>


    <div class="col-md-4">
        <div class="curve-with-shadow-no-padding n-box white">


            <div class="box-header">
                <!-- <div class="datepicker">
                    <input name="daterange" type="daterange" value="Date">
                    </input>
                </div> -->
            </div>
            <div class="divider"></div>

            <div class="box-body">
                <div class="left-box"><img src="<?php echo base_url();?>theme/images/total_value.png" /></div>
                <div class="right-box"><p>Total value<br /><span class="value-heading total-value">AED <?php echo $total_orders_value;?></span></p></div>
            </div>

        </div>
    </div>




    <div class="col-md-4">
        <div class="curve-with-shadow-no-padding n-box white">


            <div class="box-header">
                <!-- <div class="datepicker">
                    <input name="daterange" type="daterange" value="Date">
                    </input>
                </div> -->
            </div>
            <div class="divider"></div>

            <div class="box-body">
                <div class="left-box"><img src="<?php echo base_url();?>theme/images/total_customers.png" /></div>
                <div class="right-box"><p>Total Customers<br /><span class="value-heading total-customers"><?php echo $total_orders;?></span></p></div>
            </div>

        </div>
    </div>







</div>
<div class="row curve-with-shadow white">
    <div class="col-md-10">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-primary btn-secondary active" data ="New Order" id="option1label">
                <input autocomplete="off" checked="" id="option1"  name="options" type="radio" value="1">
                    New order
                </input>
            </label>
            <label class="btn btn-secondary" data ="Under Process">
                <input autocomplete="off" id="option2"  name="options" type="radio" value="2">
                    Under Process
                </input>
            </label>
            <label class="btn btn-secondary" data ="Ready for Dispatch">
                <input autocomplete="off" id="option3"  name="options" type="radio" value="3">
                    Ready for Dispatch
                </input>
            </label>
            <label class="btn btn-secondary" data ="Dispatch">
                <input autocomplete="off" id="option4"  name="options" type="radio" value="4">
                    Dispatch
                </input>
            </label>
            <label class="btn btn-secondary" data ="Complete">
                <input autocomplete="off" id="option5"  name="options" type="radio" value="5">
                    Delivered
                </input>
            </label>
            <label class="btn btn-secondary" data ="Returns">
                <input autocomplete="off" id="option6"  name="options" type="radio" value="6">
                    Returns
                </input>
            </label>
            <label class="btn btn-secondary" data ="Canceled">
                <input autocomplete="off" id="option7"  name="options" type="radio" value="7">
                    Canceled
                </input>
            </label>
        </div>
    </div>
    <div class="col-md-2">
        <div class="datepicker">
            <input name="daterange" type="daterange" value="Date">
            </input>
            <input id="start_date" value="0" style="display:none;"/>
            <input id="end_date"  value="0" style="display:none;"/>
        </div>
    </div>
    <div class="col-md-12">
        <table class="table table-bordered" id="order-table">
            <thead>
                <tr>
                    <th scope="col">
                        Order ID
                    </th>
                    <th scope="col">
                        Customer Name
                    </th>
                    <th scope="col">
                        Date / Time
                    </th>
                    <th scope="col">
                        Value
                    </th>
                    <th scope="col">
                        Comission
                    </th>
                    <th scope="col">
                        Status
                    </th>
                    <th width="5%">
                    </th>
                </tr>
            </thead>
            <tbody>
                <?php

                	if(!$orders):?>
                		<tr><td colspan="6">No record found!</td></tr>
                		<?php
                		else:?>


                			<?php
                			$counter = 1;
                			foreach($orders as $order):?>
                			<tr <?php echo (($counter%2 == 0) ? "class='alternative'" : "");?>>
                				<td>#<?php echo $order['order_id'];?></td>
                				<td><?php echo $order['full_name'];?></td>
                				<td><?php echo $order['date_added'];?></td>
                				<td>AED <?php echo number_format($order['total'], 2, '.', ' ');?></td>
                				<td><?php echo $order['comission'];?></td>
                				<td><?php echo $order['order_status'];?></td>
                				<td class="text-center"><?php echo $order['image'];?></td>
                			</tr>
	                		<?php
	                		$counter++;
	                		endforeach;?>



                		<?php endif;
                ?>
            </tbody>
        </table>
    </div>
</div>
<style>
#order-table_filter{
  display: none;
}
#order-table_length{
  display: none;
}
</style>
<script type="text/javascript">
    $(document).ready(function(){

      var table =  $('#order-table').DataTable( {

                  "ajax":'<?php echo $listing_order_url;?>',
                  "initComplete":function( settings, json){
                $('#option1label').click();

            }
              } );
          $('.btn-secondary').on('click',function(){
            var value = $(this).attr('data');
          table.search( value ).draw();
          } );




    $('#create_order').on('click',function(){
        window.location  = '<?php echo $create_order_url;?>';
    });


    $(".btn-group-toggle label [type=radio]").each(function(){
        $(this).on("change", function(){


            if($(this).is(":checked")){


               		$(this).parent().siblings().each(function(){
                    $(this).removeClass("btn-primary active");
                    $(this).addClass("btn-secondary");


                });

                                $(this).parent().addClass("btn-primary active");

            }



        });
    });
});
</script>
