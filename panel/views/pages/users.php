<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Users
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <button class=" btn btn-primary" id="create_order">
            Create New User
        </button>
    </div>
</div>



<div class="row curve-with-shadow white">

    <div class="col-md-12">
        <table class="table table-bordered" id="user_table">
            <thead>
                <tr>
                    <th scope="col">
                        
                    </th>

                    <th scope="col">
                        Full Name
                    </th>

                    <th scope="col">
                        Email
                    </th>
                    <th scope="col">
                        Mobile
                    </th>
                    <!-- <th scope="col">
                        User Name
                    </th> -->
                    <th scope="col">
                        Type
                    </th>
                    <th scope="col">
                        Status
                    </th>
                    <th width="5%">
                    </th>
                </tr>
            </thead>
            

            <tbody>
                <tr>
                    <td colspan="8">No record found!</td>
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



        $('#create_order').on('click', function(){
            window.location = '<?php echo $add_user_url;?>';
        });



        var table =  $('#user_table').DataTable({
                    "ajax":'<?php echo $listing_user_url;?>',
                    "initComplete":function( settings, json){
                    $('#option1label').click();
                    }
            });

        });

</script>
