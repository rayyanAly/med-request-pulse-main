<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Available Products
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <!--<button class=" btn btn-primary" id="create_product">
            Create New Product
        </button>-->
    </div>
</div>


<div class="row curve-with-shadow white">

    <div class="col-md-12">
        <table class="table table-bordered table-striped" id="product-table">
            <thead>
                <tr>
                    <!--<th>
                        
                    </th>-->
                    <th>
                        SKU
                    </th>
                    <th>
                        Produdct Name
                    </th>
                    <th>
                        Price
                    </th>
                    <th>
                        Stock
                    </th>
                    <th>
                        Unit
                    </th>
                    
                    <!--<th width = "15%"></th>-->
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

      var table =  $('#product-table').DataTable( {
                  "ajax":'<?php echo $listing_product_url;?>',
                  "pageLength": 200              
              } );

          $('.btn-secondary').on('click',function(){
            var value = $(this).attr('data');
          table.search( value ).draw();
          } );



    $('#create_product').on('click',function(){
        window.location  = '<?php echo $create_product;?>';
    });

});


    function openModal(iFrameUrl){
                
        $('#site_container').attr("src", "<?php echo site_url('c=products&m=detail&id');?>=" + iFrameUrl);
        $('#mi-modal').modal();

    }

</script>

