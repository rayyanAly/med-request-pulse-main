
            <div class="content-row">

                <div class="box insight-box">

                    <div class="box-head ib-head">
                            <input type="text" name="datepickerrange" id="datepickerrange" class="form-control" />
                    </div>

                    <div class="ib-content">
                        <img src="<?php echo base_url();?>theme/images/sales.jpg" alt="Sales">
                        <h1>
                            Total Sales
                            <span class="insight-count"><?php echo $stats['total_sale'];?></span>
                        </h1>
                    </div>

                </div> <!-- Insight Box -->

                <div class="box insight-box">

                    <div class="box-head ib-head">
                        <div class="datepicker">
                            <!-- <input type="date" name="datepicker"> -->
                        </div>
                    </div>

                    <div class="ib-content">
                        <img src="<?php echo base_url();?>theme/images/document.jpg" alt="document">
                        <h1>
                            Total Orders
                            <div class="insight-count"><?php echo $stats['total_orders'];?></div>
                        </h1>
                    </div>

                </div> <!-- Insight Box -->

                <div class="box insight-box">

                    <div class="box-head ib-head">
                        <div class="datepicker">
                            <!-- <input type="date" name="datepicker"> -->
                        </div>
                    </div>

                    <div class="ib-content">
                        <img src="<?php echo base_url();?>theme/images/order.jpg" alt="Orders">
                        <h1>
                            Avg Order Value
                            <div class="insight-count"><?php echo $stats['average_value'];?></div>
                        </h1>
                    </div>

                    <div class="view-link">
                        <!-- <a href="#" class="view-link">view</a> -->
                    </div>

                </div> <!-- Insight Box -->

                <div class="box insight-box">

                    <div class="box-head ib-head">
                        <div class="datepicker">
                            <!-- <input type="date" name="datepicker"> -->
                        </div>
                    </div>

                    <div class="ib-content">
                        <img src="<?php echo base_url();?>theme/images/customers.jpg" alt="Customers">
                        <h1>
                            Total Customers
                            <div class="insight-count"><?php echo $stats['total_customers'];?></div>
                        </h1>
                    </div>

                </div> <!-- Insight Box -->

            </div> <!-- Insights -->

            <div class="content-row">

                <div class="box sales-overview">
                    <div class="box-head">
                        <h2>Recent Orders</h2>
                        <div class="datepicker">
                            <!-- <input type="date" name="" id=""> -->
                        </div>
                    </div>

                    <div class="sales-chart">
                    
                    </div> <!-- Sales Overview Chart -->

                </div> <!-- Sales Overview -->

                <div class="box top-product">

                    <div class="box-head">
                        <h2>Top Products</h2>
                    </div>

                    <div class="tp-table">
                        <table>
                            <thead>
                                <tr>
                                    <th width="10%"></th>
                                    <th>Products Details</th>
                                    <th>Unit Sales</th>
                                </tr>
                            </thead>

                            <tbody>

                                <?php if(count($stats['products']) == 0):?>
                                <tr>
                                    <td colspan="5">&nbsp;&nbsp;&nbsp;No record found!</td>
                                </tr>
                                <?php else:?>

                                    <?php 
                                    $counter = 1;
                                    foreach($stats['products'] as $product):?>
                                        <tr>
                                            <td><?php echo $counter;?></td>
                                            <td><?php echo $product['name'];?></td>
                                            <td><?php echo $product['total'];?></td>
                                        </tr>
                                    <?php 
                                    $counter++;
                                endforeach;?>

                                <?php endif;?>
                            </tbody>
                        </table>
                    </div>

                </div> <!-- Top Product -->

            </div> <!-- Content Row -->



<script type="text/javascript">

    $(function() {
        $('#datepickerrange').daterangepicker();
    });

</script>