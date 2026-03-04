</div> <!-- Dashboard Content Area -->
</section> <!-- Admin Panel's Container  -->
</body>

<script type="text/javascript" src="<?php echo base_url();?>theme/js/components//loader.js"></script>
<script type="text/javascript">
    google.charts.load('current', {
        packages: ['corechart', 'bar']
    });
    google.charts.setOnLoadCallback(drawMaterial);

    function drawMaterial() {
        var data = new google.visualization.DataTable();
        data.addColumn('timeofday', 'Time of Day');
        data.addColumn('number', 'Motivation Level');
        data.addColumn('number', 'Energy Level');

        data.addRows([
            
        ]);

        var options = {
            title: 'Motivation and Energy Level Throughout the Day',
            hAxis: {
                title: 'Time of Day',
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

        // Donut Chart

        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            
        ]);

        var options = {
            title: '',
            pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('ta-chart'));

        chart.draw(data, options);

        // Donut Chart

        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Deira', 0],
            ['Bur Dubai', 0]
        ]);

        var options = {
            title: '',
            pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('tc-chart'));
        chart.draw(data, options);

        //Area Chart


        var data = google.visualization.arrayToDataTable([
            
            
        ]);

        var options = {
            title: 'Company Performance',
            hAxis: {
                title: 'Year',
                titleTextStyle: {
                    color: '#333'
                }
            },
            vAxis: {
                minValue: 0
            }
        };

        var chart = new google.visualization.AreaChart(document.getElementById('areachart'));
        chart.draw(data, options);


    };

    $(window).resize(function() {
        drawMaterial();
    });
    $(".dashboard-container").resize(function() {
        drawMaterial();
    });
</script>

</html>