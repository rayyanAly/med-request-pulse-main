<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Customers
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <button class=" btn btn-primary" id="create_product">
            Create New Customer
        </button>
    </div>
</div>


<div class="row curve-with-shadow white">

    <div class="col-md-12">
        <table class="table table-bordered table-striped" id="customer-table">
            <thead>
                <tr>
                    <th>
                        ID
                    </th>
                    <th>
                        Full Name
                    </th>
                    <th>
                        Mobile#
                    </th>
                    <th>
                        MRN Number
                    </th>
                    <th>
                        Added Date
                    </th>
                    <th>
                        Total Orders
                    </th>
                    
                    <th></th>
                </tr>
            </thead>
            <tbody>
            
            </tbody>
        </table>
    </div>
</div>






<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="mi-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">


<div class="modal-header">
        
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>

            <div class="modal-body">
                <div class="confirmation-box">

                        <iframe id="site_container" src="<?php echo site_url('c=products&m=detail');?>" class="iframe-popup"></iframe>   
                </div>
            </div>
        </div>
    </div>
</div>




<script type="text/javascript">
    $(document).ready(function(){

      var table =  $('#customer-table').DataTable( {
                  "ajax":'<?php echo $listing_customer_url;?>',
                  "pageLength": 200              
              } );

          $('.btn-secondary').on('click',function(){
            var value = $(this).attr('data');
          table.search( value ).draw();
          } );



    $('#create_product').on('click',function(){
        window.location  = '<?php echo $create_customer_url;?>';
    });

});


    function openModal(iFrameUrl){
                
        $('#site_container').attr("src", "<?php echo site_url('c=products&m=detail&id');?>=" + iFrameUrl);
        $('#mi-modal').modal();

    }

</script>

