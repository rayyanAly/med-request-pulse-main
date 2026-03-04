<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <!-- Mobile viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Orders | Partnership Panel</title>


    <!-- Stylesheets -->
    <link rel="stylesheet" href="<?php echo base_url();?>theme/css/components/normalize.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>theme/css/styles.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>theme/css/responsive.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>theme/css/custom.css" />

    <!-- Javascript -->
    <script src="<?php echo base_url();?>theme/js/components/jquery-3.4.1.min.js"></script>
    <script src="<?php echo base_url();?>theme/js/components/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>theme/js/components/moment.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>theme/js/components/daterangepicker.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<?php echo base_url();?>theme/js/css/daterangepicker.css" />

    <link rel="stylesheet" href="<?php echo base_url();?>theme/css/bootstrap/bootstrap.min.css">

<script src="<?php echo base_url();?>theme/js/bootstrap/bootstrap.min.js"></script>




        <link rel="shortcut icon" href="<?php echo base_url();?>theme/images/favicon.ico"/>

	<!-- <script type="text/javascript" src="http://thrilleratplay.github.io/jquery-validation-bootstrap-tooltip/js/jquery.validate-1.14.0.min.js" /></script>
	<script type="text/javascript" src="http://thrilleratplay.github.io/jquery-validation-bootstrap-tooltip/js/jquery-validate.bootstrap-tooltip.js" /></script> -->

    <script src="<?php echo base_url();?>theme/js/main.js"></script>

</head>

<body>

    <section class="primary-sidebar hidden">

        <div class="menu-wrap hidden">

            <div class="menu-toggle">
                <button class="ico btn-menu"></button>
            </div> <!-- Menu Toggle Button -->

            <!--<div class="logo">
                <a href="#">
                <img style="height:40px;" src="<?php echo get_partner_logo();?>" alt="Partnership" />
                </a>
            </div>--><!-- Logo -->

        </div>

        <nav class="primary-nav hidden">
            <ul>
                <li <?php echo $selected == "dashboard" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=dashboard');?>"><span class="ico ico-meter"></span>Dashboard</a></li>
                <!-- <li <?php echo $selected == "orders-create" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=orders&m=create');?>"><span class="ico ico-orders"></span> New Order</a></li> -->
                <li <?php echo ($selected == "orders" || $selected == "orders-create") ? 'class="active"' : '';?>><a href="<?php echo site_url('c=orders');?>"><span class="ico ico-orders"></span>Orders</a></li>
                <!-- <li><a href="#"><span class="ico ico-settings"></span>Preferences</a></li> -->
                <!-- <li><a href="<?php echo site_url('c=profiles');?>"><span class="ico ico-user"></span>Profiles</a></li> -->
                <!--<li <?php echo $selected == "customers" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=customers');?>"><span class="ico ico-seller"></span>Customers</a></li>-->
                <!--<li <?php echo $selected == "withdrawals" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=account');?>"><span class="ico ico-store"></span>Withdraws</a></li>-->
                <li <?php echo $selected == "products" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=products');?>"><span class="ico ico-orders"></span>Products</a></li>
                <li <?php echo $selected == "users" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=users');?>"><span class="ico ico-seller"></span>Users</a></li>

                <!--<li <?php echo $selected == "dispatch" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=dispatch');?>"><span class="ico ico-meter"></span>Dispatch</a></li>-->


                <!--<li <?php echo $selected == "settings" ? 'class="active"' : '';?>><a href="<?php echo site_url('c=settings');?>"><span class="ico ico-settings"></span>Settings</a></li>-->

<!--                 <li><a href="<?php echo site_url('c=notifications');?>"><span class="ico ico-dollor"></span>Notifications</a></li>
 -->            </ul>
        </nav><!-- Primary Navigation -->

    </section> <!-- Primary Sidebar -->

    <section class="dashboard-container">

        <header class="dashboard-header">
            <div class="db-wrap">

                <div class="searchbar">
                    <span class="ico ico-search"></span>
                    <input type="text" name="inputfield" id = "inputfield" class="inputfield" placeholder="search...">
                </div> <!-- Input Field -->

                <div class="user-options-bar">

                    <!--<div class="user-control">
                        <span class="ico ico-chat"></span>
                        <span class="ico ico-notify">
                            <i class="notify-bubble"></i>
                        </span>
                    </div>--> <!-- User Control -->

                    <div class="user-menu">
                        <a href="#"><?php echo get_partner_name();?> <span class="ico ico-arrow"></span></a>
                        <a href="<?php echo site_url('logout');?>">Sign out <span class="ico ico-arrow1">&nbsp;</span></a>
                        <img src="<?php echo base_url();?>theme/images/avatar.jpg" alt="avatar" />
                    </div> <!-- User Menu -->

                </div> <!-- User Options Bar -->

            </div>
        </header> <!-- Dashboard Header -->
        <div class="dashboard-content-area">
