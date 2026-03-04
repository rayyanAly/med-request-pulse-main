$(document).ready(function () {

	//Menu Btn Interaction

	$(".btn-menu").click(function () {

		$(".primary-sidebar").toggleClass("hidden");
		$(".logo").toggleClass("hidden");
		$(".primary-nav").toggleClass("hidden");
		$(".dashboard-container").toggleClass("hidden");

	});



		$("#inputfield").on('keyup', function(event){
      	
          if (event.keyCode === 13) {
     
            $.ajax({
                type: "POST",
                url: '?c=orders&m=order_exists',
                data: {"order_id": $("#inputfield").val()},
                success: function(data) {
                var d = jQuery.parseJSON(data);
                	console.log(data);
                	if(d.data != '0'){
                    window.location = '?c=orders&m=detail&id=' + d.data;
                    }
                	else 	{
                    	alert('No order found');
                    }
                },
                error: function(data) {
                    alert('No order found');
                },
            });
        
          }
        
        
    	});



});


function getFileExtension(filename)
{
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
}