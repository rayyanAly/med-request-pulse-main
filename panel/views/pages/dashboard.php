<section class="dashboard-container">
            <div class="content-row">

                <div class="box insight-box-33">

                    <!--<div class="box-head ib-head">
                            <input type="text" name="datepickerrange" id="datepickerrange" class="form-control" />
                    </div>-->

                    <div class="ib-content">
                        <img src="<?php echo base_url();?>theme/images/sales.jpg" alt="Sales">
                        <h1>
                            Total Sales
                            <span class="insight-count"><?php echo $stats['total_sale'];?></span>
                        </h1>
                    </div>

                </div> <!-- Insight Box -->

                <div class="box insight-box-33">

                    <!--<div class="box-head ib-head">
                        <div class="datepicker">
                        </div>
                    </div>-->

                    <div class="ib-content">
                        <img src="<?php echo base_url();?>theme/images/document.jpg" alt="document">
                        <h1>
                            Total Orders
                            <div class="insight-count"><?php echo $stats['total_orders'];?></div>
                        </h1>
                    </div>

                </div> <!-- Insight Box -->

                <div class="box insight-box-33">

                    <!--<div class="box-head ib-head">
                        <div class="datepicker">
                        </div>
                    </div>-->

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

                
                
                
                

            </div> <!-- Insights -->


<div class="content-row">

                <div class="box sales-overview">
                    <div class="box-head">
                        <h2>Top Categories</h2>
                    </div>

                    <div class="sales-chart">
                        <div id="tc-chart" class="tc-chart" style="overflow:hidden;"></div> 
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
                                    <th style="width: 30px;"></th>
                                    <th>Product </th>
                                    <!--<th>Products Details</th>
                                    <th>Unit Sales</th>-->
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                <?php foreach($stats['products'] as $product):?>
                                    <tr>
                                        <td></td>
                                        <td><?php echo $product['name'];?></td>
                                        <!--<td>
                                        <img src="<?php echo base_url();?>theme/images/prod1.jpg" alt="product thumbnail" />
                                        <span class="prod-title">Cationorm Eye Drops</span>
                                        </td>-->
                                        
                                        <td><?php echo $product['total_products'];?></td>
                                    </tr>
                                <?php endforeach;?>
                                
                            </tbody>
                        </table>
                    </div>

                </div> <!-- Top Product -->

            </div> <!-- Content Row -->




    <!--<div class="content-row">

                    <div class="box top-areas">
                        <div class="box-head">
                            <h2>Top Areas</h2>
                        </div>
                        <div id="ta-chart" class="ta-chart"></div> 
                    </div> 

                    <div class="box top-categories">
                        <div class="box-head">
                            <h2>Top Categories</h2>
                        </div>

                        <div id="tc-chart" class="tc-chart"></div> 

                    </div> 

                    <div class="box average-value">
                        <div class="box-head">
                            <h2>Performance Chart</h2>
                        </div>
                        <div id="areachart" class="aov-chart"></div>
                    </div> 

    </div>-->


</section>


<script type="text/javascript" src="theme/js/components/loader.js"></script>
<!-- <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script> -->
<script type="text/javascript">

    $(function() {
        $('#datepickerrange').daterangepicker();
  google.charts.load('current', {'packages':['corechart', 'bar']}); 
google.charts.setOnLoadCallback(drawChart); 

google.charts.setOnLoadCallback(drawChartCategories); 
google.charts.setOnLoadCallback(drawAreaChart); 
google.charts.setOnLoadCallback(barChart); 



  
    });



function drawChart() { 
  var data = google.visualization.arrayToDataTable(<?php echo $stats['categories'];?>); 
  var options = {'title':'', 'width':550, 'height':400}; 
  var chart = 
 new google.visualization.PieChart(document.getElementById('ta-chart')); 
  chart.draw(data, options); 
} 




function drawChartCategories() { 
  var data = google.visualization.arrayToDataTable([ 
  ['DHCC', 'Hours per Day'], 
  ['Personal Care', 3], 
  ['Skin Care', 14], 
  ['Cosmatics', 4], 
  ['First Aids', 2], 
  ['Skin Care', 8] 
]); 
  var options = {'title':'', 'width':800, 'height':450}; 
  var chart = 
 new google.visualization.PieChart(document.getElementById('tc-chart')); 
  chart.draw(data, options); 
} 




function drawAreaChart(){



        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses'],
          ['2013',  1000,      400],
          ['2014',  1170,      460],
          ['2015',  660,       1120],
          ['2016',  1030,      540]
        ]);

        var options = {
          title: '',
          hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
          
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('areachart'));
        chart.draw(data, options);


}



function barChart(){
          var data = new google.visualization.DataTable();
      data.addColumn('timeofday', 'Time of Day');
      data.addColumn('number', 'Online Customers');
      data.addColumn('number', 'Walkin Customers');

      data.addRows([
        [{v: [8, 0, 0], f: '8 am'}, 1, .25],
        [{v: [9, 0, 0], f: '9 am'}, 2, .5],
        [{v: [10, 0, 0], f:'10 am'}, 3, 1],
        [{v: [11, 0, 0], f: '11 am'}, 4, 2.25],
        [{v: [12, 0, 0], f: '12 pm'}, 5, 2.25],
        [{v: [13, 0, 0], f: '1 pm'}, 6, 3],
        [{v: [14, 0, 0], f: '2 pm'}, 7, 4],
        [{v: [15, 0, 0], f: '3 pm'}, 8, 5.25],
        [{v: [16, 0, 0], f: '4 pm'}, 9, 7.5],
        [{v: [17, 0, 0], f: '5 pm'}, 10, 10],
      ]);

      var options = {
        title: 'Motivation and Energy Level Throughout the Day',
        legend: {position: 'none'},
        hAxis: {
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Rating (scale of 1-10)'
        }
      };

      var materialChart = new google.charts.Bar(document.getElementById('chart_div'));
      materialChart.draw(data, options);
}



//     google.charts.load('current', {packages: ['corechart', 'bar']});
// google.charts.setOnLoadCallback(drawMaterial);

// function drawMaterial() {
//       var data = new google.visualization.DataTable();
//       data.addColumn('timeofday', 'Time of Day');
//       data.addColumn('number', 'Motivation Level');
//       data.addColumn('number', 'Energy Level');

//       data.addRows([
//         [{v: [8, 0, 0], f: '8 am'}, 1, .25],
//         [{v: [9, 0, 0], f: '9 am'}, 2, .5],
//         [{v: [10, 0, 0], f:'10 am'}, 3, 1],
//         [{v: [11, 0, 0], f: '11 am'}, 4, 2.25],
//         [{v: [12, 0, 0], f: '12 pm'}, 5, 2.25],
//         [{v: [13, 0, 0], f: '1 pm'}, 6, 3],
//         [{v: [14, 0, 0], f: '2 pm'}, 7, 4],
//         [{v: [15, 0, 0], f: '3 pm'}, 8, 5.25],
//         [{v: [16, 0, 0], f: '4 pm'}, 9, 7.5],
//         [{v: [17, 0, 0], f: '5 pm'}, 10, 10],
//       ]);

//       var options = {
//         title: 'Motivation and Energy Level Throughout the Day',
//         hAxis: {
//           title: 'Time of Day',
//           format: 'h:mm a',
//           viewWindow: {
//             min: [7, 30, 0],
//             max: [17, 30, 0]
//           }
//         },
//         vAxis: {
//           title: 'Rating (scale of 1-10)'
//         }
//       };

//       var materialChart = new google.charts.Bar(document.getElementById('chart_div'));
//       materialChart.draw(data, options);

//         // Donut Chart

//         var data = google.visualization.arrayToDataTable([
//             ['Task', 'Hours per Day'],
//             ['Work', 11],
//             ['Eat', 2],
//             ['Commute', 2],
//             ['Watch TV', 2],
//             ['Sleep', 7]
//         ]);

//         var options = {
//             title: 'My Daily Activities',
//             pieHole: 0.4,
//         };

//         var chart = new google.visualization.PieChart(document.getElementById('ta-chart'));

//         chart.draw(data, options);

//         // Donut Chart

//         var data = google.visualization.arrayToDataTable([
//             ['Task', 'Hours per Day'],
//             ['Work', 11],
//             ['Eat', 2],
//             ['Commute', 2],
//             ['Watch TV', 2],
//             ['Sleep', 7]
//         ]);

//         var options = {
//             title: 'My Daily Activities',
//             pieHole: 0.4,
//         };

//         var chart = new google.visualization.PieChart(document.getElementById('tc-chart'));
//         chart.draw(data, options);

//         //Area Chart

    
//         var data = google.visualization.arrayToDataTable([
//           ['Year', 'Sales', 'Expenses'],
//           ['2013',  1000,      400],
//           ['2014',  1170,      460],
//           ['2015',  660,       1120],
//           ['2016',  1030,      540]
//         ]);

//         var options = {
//           title: 'Company Performance',
//           hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
//           vAxis: {minValue: 0}
//         };

//         var chart = new google.visualization.AreaChart(document.getElementById('areachart'));
//         chart.draw(data, options);
    

//     };

//     $(window).resize(function(){
//         drawMaterial();
//     });
//     $(".dashboard-container").resize(function(){
//         drawMaterial();
//     });
</script>