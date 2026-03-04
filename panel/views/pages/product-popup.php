<?php $this->load->view('components/header_blank')?>

<div class="row">
    

    <div class="left-panel">
        
        <img src = "<?php echo $product['image'];?>" />

    </div>

    <div class="right-panel">

        <h4><?php echo $product['name'];?></h4>
        <h6><?php echo $product['unit'];?></h6>
        <br />
        <h5><strong>AED <?php echo $product['price'];?></strong></h5>
        <hr />
        <p><?php echo $product['description'];?></p>
        

    </div>

    
</div>
<?php $this->load->view('components/footer_blank')?>
<style type="text/css">
    .row {
        width:100%;
        min-height: 400px;
    }

    .row .left-panel {
        width:40%;
        float:left;
        padding:10px;
    }


    .row .left-panel img {

        width:100%;
        margin-top:0px;
    }


    .row .right-panel {
        width:55%;
        margin-left:1%;
        padding:10px;
        float:left;
    }


</style>