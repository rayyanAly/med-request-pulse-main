<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Payment Transfers
        </h4>
    </div>
    <div class="col-md-6 text-right">
    </div>
</div>
<div class="row curve-with-shadow white">
    <div class="col-md-12">
        <table class="table table-bordered" id="user_table">
            <thead>
                <tr>
                    <th width="10%">
                    </th>
                    <th>
                        Date / Time
                    </th>
                    <th>
                        Amount
                    </th>
                    <th>
                        Payment Method
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4">No record found!</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
<style>
    #user-table_filter{
  display: none;
}
#user-table_length{
  display: none;
}
</style>
<script type="text/javascript">
    $(document).ready(function(){

        var table =  $('#user_table').DataTable({
                    "ajax":'<?php echo $listing_user_url;?>',
                    "initComplete":function( settings, json){
                    $('#option1label').click();
                    }
            });

        });
</script>
