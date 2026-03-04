<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>theme/css/intlTelInput.css" rel="stylesheet"/>
    <script src="<?php echo base_url();?>theme/js/intlTelInput.js">
    </script>
    <div class="row curve-with-shadow n-row white">
        <div class="col-md-6">
            <h4>
                Create Order
            </h4>
        </div>
        <div class="col-md-6 text-right">
            <button class=" btn cancel-button-no-border" id="add_products" name="add_products">
                Cancel
            </button>
        </div>
    </div>
    <div class="row curve-with-shadow-no-padding n-row white">
        <div class="col-md-6 col-lg-6 col-sm-12 order-details">
            <form id="create_order" method="POST" name="create_order">
                <div class="row">
                    <div class="col-md-6 order-detail-labels">
                        <div class="form-group">
                            <label for="erx">
                                Customer Mobile Number
                            </label>
                            <input class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="text">
                            </input>
                        </div>
                        <div class="form-group">
                            <label for="erx">
                                ERX No
                            </label>
                            <input class="form-control" id="erx_number" maxlength="10" name="erx_number" type="text">
                            </input>
                        </div>
                    </div>
                    <input id="payment_method" name="payment_method" type="hidden" value="cash"/>
                    <input id="with_insurance" name="with_insurance" type="hidden" value="0"/>
                </div>
            </form>
            <div class="col-md-6 order-detail-labels">
                <p>
                    <strong>
                        Notes:
                    </strong>
                </p>
                <p class="label-value">
                    <textarea class="form-control" id="notes" name="notes" rows="5">
                    </textarea>
                </p>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-lg-6 col-sm-12 order-details">
        <div class="form-group ">
            <label for="prescription">
                Upload Document(s)
            </label>
            <div class="row">
                <div class="col-md-3 files color">
                    <input class="form-control" id="prescription" name="prescription[]" title=" " type="file"/>
                </div>
                <div class="col-md-9">
                    <div class="image-container">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="divider">
    </div>
    <div class="box-body row">
        <div class="col-md-6">
            <div class="form-group has-search">
                <span class="fa fa-search form-control-feedback">
                </span>
                <input class="form-control" id="search_product" name="search_product" placeholder="Seach products" type="text"/>
            </div>
        </div>
        <div class="col-md-6 controls">
            <input id="decrease_value" type="button" value="-"/>
            <input class="current-value" id="current_value" name="current_value" readonly="readonly" type="text" value="1"/>
            <input id="increase_value" type="button" value="+"/>
            <input id="add_item" type="button" value="Add"/>
        </div>
        <!-- product table -->
        <table class="item-table" id="item_table">
            <thead>
                <tr>
                    <th width="8%">
                        Image
                    </th>
                    <th>
                        Product Name
                    </th>
                    <th width="10%">
                        Qty
                    </th>
                    <th width="10%">
                        Price
                    </th>
                    <th width="10%">
                        Total
                    </th>
                    <th width="5%">
                    </th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="col-md-8 col-lg-8 col-sm-12">
        </div>
        <div class="col-md-4 col-lg-4 col-sm-12">
            <table cellpadding="8" class="total-table" id="total_table">
                <tr>
                    <td>
                        Sub Total
                    </td>
                    <td class="value">
                        <div id="sub_total_value">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        Delivery Charges
                    </td>
                    <td class="value">
                        <div id="delivery_charges_value">
                        </div>
                    </td>
                </tr>
                <tr class="discount">
                    <td>
                        Discount
                    </td>
                    <td class="value">
                        <div id="discount_value">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="divider">
                        </div>
                    </td>
                </tr>
                <tr class="total">
                    <td>
                        Total
                    </td>
                    <td class="value">
                        <div id="total_value">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <button class="submit-button" id="submit_button" onclick="submit_form_data()">
                            Submit
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</link>
<!-- modal window -->
<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="mi-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="confirmation-box">
                    <div class="image-container">
                        <img class="image" src="<?php echo base_url();?>theme/images/confirmation-icon.png"/>
                    </div>
                    <h4>
                        Thank You!
                    </h4>
                    <p>
                        Order Submitted Successfully!
                    </p>
                    <button class="continue-button" id="continue_button" name="continue_button">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
