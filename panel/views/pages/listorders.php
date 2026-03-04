    <script type="text/javascript" src="https://mediclinic.800pharmacy.ae/panel/theme/js/components/daterangepicker.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://mediclinic.800pharmacy.ae/panel/theme/js/css/daterangepicker.css" />
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.1.0/css/buttons.dataTables.min.css" />

<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.4.0/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.4.0/js/buttons.flash.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.4.0/js/buttons.html5.min.js"></script>


<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Orders
        </h4>
    </div>
</div>

<div class="row curve-with-shadow white">
  <div class="col-md-6">
      <!--<div class="btn-group btn-group-toggle" data-toggle="buttons">

          <label class="btn btn-secondary" data ="Complete" id="option1label">
              <input autocomplete="off" id="option5"  name="options" type="radio" value="5">
                  Complete
              </input>
          </label>
          <label class="btn btn-secondary" data ="Canceled">
              <input autocomplete="off" id="option7"  name="options" type="radio" value="7">
                  Canceled
              </input>
          </label>
      </div>-->
  </div>
    <div class="col-md-6">
        <div class="datepicker">
            <button class="export-button"><i class="fa fa-cloud-download"></i> Export</button>

        <input name="daterange" id="daterange" type="text" class = "datepicker" value="">
        <input type = "text" name = "search_box" id = "search_box" placeholder = "Search customer..." style = "margin-right:5px;" />

            <input id="start_date" type="radio" name="start_date" style="display:none;" value="2022-00-10">
            <input id="end_date" type="radio" name="end_date" style="display:none;" value="2022-01-11">
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
                        Value
                    </th>
                <th scope="col">
                        Date / Time
                    </th>
                <th scope="col">
                        Prepared by
                    </th>
                <th scope="col">
                        Prepared at
                    </th>
                
                <th scope="col">
                        Ready for dispatch
                    </th>
                
                <th scope="col">
                        Completed at
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
                				<td>AED <?php echo number_format($order['total'], 2, '.', ' ');?></td>
                				<td><?php echo $order['order_status'];?></td>
                				<td><?php echo $order['date_added'];?></td>

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

.datepicker input {
    min-width: 200px !important;
    font-size: 16px;
    padding: 15px;
}

.datepicker input {
    border: 1px solid #E6E9ED;
    border-radius: 4px;
    padding: 10px !important;
}

.export-button {
    margin-left: 10px;
    color: #43425D;
    padding: 12px;
    min-width: 80px;
    font-size: 14px;
    border: 0px #E6E9ED solid !important;
    border-radius: 4px;
float:right;
}
.buttons-excel {
display:none !important;
}
.white .focus{
  font-weight: normal !important;
  font-size: 18px !important;
}
.white label{
  max-width: 30% !important;
      min-width: 30% !important;
      text-align: center !important;
}
</style>
<script type="text/javascript">
var table;
    $(document).ready(function(){


    $('.export-button').on('click', function(){
           $('.buttons-excel').click();
     });


    $('#search_box').on( 'keyup', function () {
    table.columns( 1 ).search( this.value ).draw();
	} );







    var nowDate = new Date();
      let tmonth = nowDate.getMonth()
      let lmonth = nowDate.getMonth() + 1
      let tday = nowDate.getDate()
      let sttday = nowDate.getDate() - 1
      if(tmonth <= 9)
      tmonth = '0'+tmonth
      if(lmonth <= 9)
      lmonth = '0'+lmonth
      if(tday <= 9)
      tday = '0'+tday
      let today = nowDate.getFullYear() + '-' + tmonth + '-' + sttday;
      let last = nowDate.getFullYear() + '-' + lmonth + '-' + tday;
		$('#start_date').val(today)
		$('#end_date').val(last)


      table =  $('#order-table').DataTable( {

                  "ajax":'<?php echo $listing_order_url;?>'+'&startdate='+$('#start_date').val()+'&enddate='+$('#end_date').val(),
                  "pageLength": 100,
                  "order": [[ 0, "desc" ]],
                  "processing": true,
      		dom: 'Bfrtip',
          buttons: [
            {
                extend: 'excelHtml5',
                title: 'Orders'
            }
     ],
                  "initComplete":function( settings, json){
$('#option1label').click();
            }
              } );
          $('.btn-secondary').on('click',function(){
            var value = $(this).attr('data');
          table.search( value ).draw();
          });




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




        $('#daterange').daterangepicker({
        format: 'mm/dd/yyyy',
        startDate: '<?php echo date('m/d/Y', strtotime('-30 days'));?>'

    }, function(start, end, label) {

    $('#start_date').val(start.format('YYYY-MM-DD'))
    $('#end_date').val(end.format('YYYY-MM-DD'))
    
    
 table.ajax.url( '<?php echo $listing_order_url;?>'+'&startdate='+$('#start_date').val()+'&enddate='+$('#end_date').val() ).load(function(json){
 });

  });


});
</script>
