<link href="<?php echo base_url();?>theme/css/intlTelInput.css" rel="stylesheet"/>
<script src="<?php echo base_url();?>theme/js/intlTelInput.js"></script>

<div class="row curve-with-shadow n-row white">
    <div class="col-md-6">
        <h4>
            Create New Order
        </h4>
    </div>
    <div class="col-md-6 text-right">
        <!-- <button class=" btn btn-primary" id="add_products" name="add_products">
            + Add Products
        </button> -->
    </div>
</div>
<form class="create-order with-padding" id="create_order" method="POST" name="create_order">
    <div class="row curve-with-shadow n-row white">
        <div class="col-md-6">
            <div class="form-group">
                <label for="email">
                    Customer Mobile Number
                    <span class="required">
                        *
                    </span>
                </label>
                <input autocomplete="off" class="form-control" id="mobile_number" maxlength="15" name="mobile_number" type="tel">
                </input>
            </div>
            <div class="form-group">
                <label for="notes">
                    Notes
                </label>
                <textarea class="form-control" id="notes" name="notes" rows="7"></textarea>
            </div>

            <!--<div class="row" >
                <label for="add-products-container">
                    <input type="checkbox" value="1" id="enable_add_devices" name="enable_add_devices" />Add Product(s)
                </label>
            </div>-->
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <label for="erx">
                    ERX No
                </label>
                <input class="form-control" id="erx_number" maxlength="10" name="erx_number" type="text">
                </input>
            </div>
            <div class="form-group ">
                <label for="prescription">
                    Upload Documents
                </label>
                <div class="row">
                    <div class="col-md-3 files color" style="padding-left: 0px !important;">
                        <input class="form-control" id="prescription" multiple name="prescription" title=" " type="file"/>
                    </div>
                    <div class="col-md-9">
                        <div class="image-container-attachment">
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

    <div class="box-body row" id="footer_div" style="display: none;">

            <div class="col-md-6" style="padding-left: 0px !important;">
                <div class="form-group has-search">
                    <span class="fa fa-search form-control-feedback"></span>
                    <input class="form-control" type="text" name="search_product" id="search_product" placeholder="Seach products" />
                </div>
            </div>

            <div class="col-md-6 controls">
                <input type="button" id="decrease_value" value="-" />
                <input type="text" id="current_value" class="current-value" readonly="readonly" name="current_value" value="1" />
                <input type="button"  id="increase_value" value="+" />
                <input type="button" value="Add" class="add-item" id="add_item" />
            </div>

            <!-- product table -->
            <table class="table table-bordered table-striped" id="item_table" class="item-table">
            <thead>
                <tr>
                    <th width="5%" >
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
            </thead>
            <tbody></tbody>
        </table>

        <div class="col-md-6 col-lg-6 col-sm-12">
            &nbsp;
        </div>
        <div class="col-md-6 col-lg-6 col-sm-12">
            <table class="total-table" cellpadding="6" id="total_table">
                <tr>
                    <td>Sub Total</td>
                    <td class="value"><div id="sub_total_value"></div></td>
                </tr>
                <tr>
                    <td>Delivery Charges</td>
                    <td class="value"><div id="delivery_charges_value"></div></td>
                </tr>
                <tr class="discount">
                    <td>Discount</td>
                    <td class="value"><div id="discount_value"></div></td>
                </tr>
                <tr>
                    <td colspan="2"><div class="divider"></div></td>
                </tr>
                <tr class="total">
                    <td>Total</td>
                    <td class="value"><div id="total_value"></div></td>
                </tr>
            </table>
        </div>

    </div>

    <div class="col-md-6">&nbsp;</div>
    <div class="col-md-6 form-group button-container">
        <input id="payment_method" name="payment_method" type="hidden" value="cash"/>
        <input id="with_insurance" name="with_insurance" type="hidden" value="0"/>
        <input type="hidden" name="session" id="session" value="<?php echo $current_session;?>" />

        <input id="delivery_charges" name="delivery_charges" value ="<?php echo $delivery_charges;?>" type="hidden" />
        <input class="btn btn-primary submit-button" id="submit_button" onclick="submit_form_data()" type="button" value="Submit">
        <input class="btn btn-link link-button" id="cancel_button" type="button" value="Cancel">
        </input>
    </div>

    </div>
</form>

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
<!-- cancel modal window -->
<div aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade" id="cancel-modal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="confirmation-box">
                    <div class="image-container">
                        <img class="image" src="<?php echo base_url();?>theme/images/error-icon.png"/>
                    </div>
                    <h4>
                        Are you sure?
                    </h4>
                    <p>
                        Do you really want to delete this request? The process cannot be undone.
                    </p>
                    <div class="buttons">
                        <button class="delete-button" id="delete_button" name="delete_button">
                            Delete
                        </button>
                        <button class="can-button" id="can_button" name="can_button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- uploading -->
<div class="modal fade" id="mi-modal-uploading" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div class="confirmation-box">
          <div class="image-container">
            <img class="image" src="https://800pharmacy.ae/panel/theme/images/confirmation-icon.png">
          </div>
          <h4>Uploading!</h4>
          <p>Please wait....</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- end modal windows -->

    
  <script type="text/javascript">
var countries   = <?php echo $products;?>;
var quantity    = 1;
var itemArray   = [];
var totalRows   = 0;

// temp-upload tracking
var imageArray  = [];   // [{id, path, session, inserted_id}]
var imageNextId = 1;
var pendingFiles = [];

/* ================= AUTOCOMPLETE ================= */
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].full_name.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].full_name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].full_name.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i].full_name + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { currentFocus++; addActive(x); }
        else if (e.keyCode == 38) { currentFocus--; addActive(x); }
        else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                if (x[i].parentNode) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
    }
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}
autocomplete(document.getElementById("search_product"), countries);

/* ================= INIT ================= */
$(function() {
    $('#mobile_number').on('focus', function(){ $(this).removeClass('error'); });
    $('#erx_number').on('focus', function(){ $(this).removeClass('error'); });
    $('#notes').on('focus', function(){ $(this).removeClass('error'); });
    $('#prescription').on('click', function(){ $(this).removeClass('error'); });
    $("#mobile_number").intlTelInput();

    $('#add_item').on('click', function() {
        var itemObject = $('#search_product').val().split(" - ");
        var j, i;
        for (j = 0; j < itemArray.length; j++) {
            if (itemArray[j].id == itemObject[1]) {
                itemArray[j].quantity = $('#current_value').val();
                $('#search_product').val('');
                $('#current_value').val(1);
                check_table();
                return;
            }
        }

        for (i = 0; i < countries.length; i++) {
            if (countries[i].id == itemObject[1]) {
                itemArray.push({
                    'id': countries[i].id,
                    'name': countries[i].name,
                    'image': countries[i].image,
                    'price': countries[i].price,
                    'quantity': $('#current_value').val()
                });
                
                $('#item_table > tbody:last').append(
                    '<tr class="' + (((totalRows % 2) == 0) ? "odd" : "") + '" id="row_' + countries[i].id + '">' +
                        '<td><img class="img" src="' + countries[i].image + '" /></td>' +
                        '<td>' + countries[i].name + '</td>' +
                        '<td>' + $('#current_value').val() + '</td>' +
                        '<td>' + countries[i].price + '</td>' +
                        '<td>' + (countries[i].price * parseInt($('#current_value').val(), 10)) + '</td>' +
                        '<td class="small-delete-td"><img src="<?php echo base_url();?>theme/images/close-icon.png" onclick="deleteItem(' + countries[i].id + ')" class="small-delete" /></td>' +
                    '</tr>'
                );

                totalRows ++;
            }
        }
        $('#search_product').val('');
        $('#current_value').val(1);
        quantity = 1;
        check_table();
    });

    check_table();

    // ========== FILE INPUT: temp upload + preview ==========
    var fileInput = document.getElementById('prescription');
    if (fileInput) {
    
    
    
        fileInput.addEventListener('change', function (e) {
    var files = fileInput.files || (e && e.target && e.target.files);
    if (!files || !files.length) {
        return;
    }

    alert('Files selected: ' + files.length);

    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var sizeMb = (f.size / (1024 * 1024)).toFixed(2);
        alert('File #' + (i+1) + ': ' + f.name + ' | ' + sizeMb + ' MB');
        pendingFiles.push(f);
    }

    uploadPendingFiles();
    fileInput.value = '';
}, false);
    
    
    
    }
});

/* ================= MODALS / UI BUTTONS ================= */
$('#continue_button').on('click', function(){
    $('#mi-modal').modal('hide');
    window.location = '<?php echo $success_url;?>';
});

$('#cancel_button').on('click',function(){
    $('#cancel-modal').modal({
        backdrop: 'static',
        keyboard: false
    });
});

$('#delete_button').on('click',function(){
    $('#cancel-modal').modal('hide');
    window.location = '<?php echo $success_url;?>';
});

$('#can_button').on('click',function(){
    $('#cancel-modal').modal('hide');
});

$('#enable_add_devices').on('change', function(){
    if($(this).is(':checked')){
        $('#footer_div').show();    
    } else {
        $('#footer_div').hide();
    }
});

$('#decrease_value').on('click', function() {
    if (quantity > 1) {
        quantity--;
    }
    $('#current_value').val(quantity);
});
$('#increase_value').on('click', function() {
    if (quantity < 100) {
        quantity++;
    }
    $('#current_value').val(quantity);
});

$('#footer_div').hide();

/* ================= PRODUCTS TABLE ================= */
function deleteItem(item) {
    $('#row_' + item).remove();
    for (var z = 0; z < itemArray.length; z++) {
        if (item == itemArray[z].id) {
            itemArray.splice(z, 1);
            break;
        }
    }
    check_table();
}

function check_table() {
    var total = 0;
    var b;
    for (b = 0; b < itemArray.length; b++) {
        total = (total + (itemArray[b].quantity * itemArray[b].price));
    }
    $('#sub_total_value').html(total.toFixed(2));
    $('#delivery_charges_value').html(parseFloat($('#delivery_charges').val()).toFixed(2));
    $('#discount_value').html('0.00');
    $('#total_value').html((parseFloat(total.toFixed(2)) + parseFloat($('#delivery_charges').val())).toFixed(2));
}

/* ================= ATTACHMENTS: TEMP UPLOAD ================= */

// helper: extension + image check
function getFileExt(path){
  try {
    var clean = path.split('?')[0].split('#')[0];
    var parts = clean.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase();
    }
    return '';
  } catch (e) {
    return '';
  }
}
function isImageExt(ext){
  var imgs = ['jpg','jpeg','png','gif','webp','bmp'];
  for (var i = 0; i < imgs.length; i++) {
    if (imgs[i] === ext) return true;
  }
  return false;
}

// icons (adjust paths if needed)
var ICON_PDF   = "<?php echo base_url();?>images/pdf.png";
var ICON_WORD  = "<?php echo base_url();?>images/word.png";
var ICON_EXCEL = "<?php echo base_url();?>images/excel.png";
var ICON_FILE  = "<?php echo base_url();?>images/file-icon.png";

function getPreviewSrc(filePath){
  var ext = getFileExt(filePath);
  if (isImageExt(ext)) return filePath;
  if (ext === 'pdf') return ICON_PDF;
  if (ext === 'doc' || ext === 'docx') return ICON_WORD;
  if (ext === 'xls' || ext === 'xlsx') return ICON_EXCEL;
  return ICON_FILE;
}

// Re-render thumbnails from imageArray
function renderAllImages() {
  var $container = $('.image-container-attachment');
  $container.empty();

  if (!imageArray.length) return;

  for (var i = 0; i < imageArray.length; i++) {
    var it = imageArray[i]; // {id, path, session, inserted_id}
    var thumb = getPreviewSrc(it.path);
    $container.append(
      '<div class="image-div" id="image_' + it.id + '">' +
        '<div>' +
          '<a href="' + it.path + '" target="_blank" rel="noopener">' +
            '<img src="' + thumb + '" />' +
          '</a>' +
        '</div>' +
        '<input type="button" class="close-button-icon" onclick="deletTempItem(' + it.id + ');" value="X" />' +
      '</div>'
    );
  }
}

// Upload all files currently in pendingFiles (one by one)
function uploadPendingFiles() {
  if (!pendingFiles.length) {
    return;
  }
  // process queue sequentially
  var file = pendingFiles.shift();
  sendFile(file, function() {
    // after each upload, run again for next file
    uploadPendingFiles();
  });
}

// Upload ONE file to temp endpoint
function sendFile(file, doneCallback) {
  var formData = new FormData();
  var request  = new XMLHttpRequest();
  var sessionVal = $('#session').val();

  var sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  console.log('Uploading file to temp:', file.name, '|', sizeMb + ' MB');

  // OPTIONAL: client-side size limit example
  // var maxSizeMb = 10;
  // if (file.size > maxSizeMb * 1024 * 1024) {
  //   alert('File "' + file.name + '" is ' + sizeMb + ' MB and exceeds ' + maxSizeMb + ' MB limit.');
  //   if (doneCallback) doneCallback();
  //   return;
  // }

  formData.append('prescription', file);
  formData.append('session', sessionVal);

  request.open("POST", '<?php echo $temp_image_url;?>', true);

  request.onreadystatechange = function(){
    if (request.readyState !== 4) return;

    console.log('Upload XHR readyState=4, status=' + request.status);

    if (request.status !== 200) {
      console.log('Upload failed. Status:', request.status);
      console.log('Response text:', request.responseText);
      if (doneCallback) doneCallback();
      return;
    }

    var responseFromServer;
    try {
      responseFromServer = JSON.parse(request.responseText);
    } catch (e) {
      console.log('Invalid JSON from temp upload:', e, request.responseText);
      if (doneCallback) doneCallback();
      return;
    }

    console.log('Upload response JSON:', responseFromServer);

    if (responseFromServer.success == '1'){
      var newId = imageNextId++;
      imageArray.push({
        id: newId,
        path: responseFromServer.data.file_path,
        session: responseFromServer.data.session,
        inserted_id: responseFromServer.data.inserted_id
      });
      renderAllImages();
      console.log('Successfully uploaded file to temp:', file.name);
    } else {
      console.log('Server reported upload failure:', responseFromServer);
    }

    if (doneCallback) doneCallback();
  };

  request.onerror = function () {
    console.log('Network error during upload for file:', file.name);
    if (doneCallback) doneCallback();
  };

  request.send(formData);
}

// Delete temp file + remove from UI
function deletTempItem(id){
  var idx = -1;
  var i;
  for (i = 0; i < imageArray.length; i++) {
    if (imageArray[i].id == id) {
      idx = i;
      break;
    }
  }
  if (idx === -1) {
    $('#image_' + id).remove();
    return;
  }

  var selected = imageArray[idx];
  var $btn = $('#image_' + id + ' .close-button-icon');
  $btn.prop('disabled', true).val('...');

  if (!selected.inserted_id) {
    imageArray.splice(idx, 1);
    renderAllImages();
    return;
  }

  $.ajax({
      type: "GET",
      url: '<?php echo $delete_temp_image_url; ?>',
      data: { id: selected.inserted_id, session: $('#session').val() },
      cache: false,
      success: function(data) {
          imageArray.splice(idx, 1);
          renderAllImages();
      },
      error: function() {
          $btn.prop('disabled', false).val('X');
          console.log('An error occurred during delete.');
      }
  });
}

/* ================= FORM SUBMIT ================= */
function submit_form_data() {
    var frm = $('#create_order')[0];
    var error = false;

    if($('#mobile_number').val().length < 8){
        $('#mobile_number').addClass('error');
        error = true;
    } else {
        $('#mobile_number').removeClass('error');
    }

    // your logic: ERX or notes or at least one uploaded temp file
    if($('#erx_number').val().length < 3 && $('#notes').val().trim().length < 3 && imageArray.length === 0){
        $('#erx_number').addClass('error');
        $('#notes').addClass('error');
        $('#prescription').addClass('error');
        error = true;
    } else {
        $('#erx_number').removeClass('error');
        $('#notes').removeClass('error');
        $('#prescription').removeClass('error');
    }

    if (error){ return; }

    $('#submit_button').val('wait...');
    $('#submit_button').prop("disabled",true);

    // If some files are still pending, try to upload them, then submit
    if (pendingFiles.length > 0) {
        uploadPendingFilesAndThenSubmit();
    } else {
        doFinalFormSubmit();
    }
}

// upload remaining pendingFiles and then submit main form via AJAX
function uploadPendingFilesAndThenSubmit() {
    if (!pendingFiles.length) {
        doFinalFormSubmit();
        return;
    }
    uploadPendingFiles();
    // crude delay to allow uploads to finish; can be tuned
    setTimeout(function() {
        doFinalFormSubmit();
    }, 1500);
}

function doFinalFormSubmit() {
    var frm = $('#create_order')[0];
    var formData = new FormData(frm);

    if($('#enable_add_devices').length && $('#enable_add_devices').is(':checked') && itemArray.length > 0){
        formData.append("products", JSON.stringify(itemArray));
    }

    // NOTE: we do NOT append files here; backend uses session + temp uploads (imageArray)
    $.ajax({
        type: "POST",
        url: '<?php echo $submission_url; ?>',
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        data: formData,
        success: function(data) {
            console.log('Final submit response:', data);
            var responseData = JSON.parse(data);
            if(responseData.success == '1'){
                $('#mi-modal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            } else {
                if(responseData.error && responseData.error[0] == 'Unauthorized request'){
                    alert('You session has expired, please login again');
                    window.location = '<?php echo $login_url; ?>';
                } else {
                    alert('Request failed. please try again');
                }
            }
        },
        error: function(data) {
            $('#submit_button').val('Submit');
            $('#submit_button').prop("disabled",false);
            console.log('An error occurred during final submit.');
            console.log(data);
        }
    });
}
</script>
