
function initMap() {

	var map = new google.maps.Map(document.getElementById('map'), { zoom: 17 });

	var infoWindow = new google.maps.InfoWindow({map: map});

	if (navigator.geolocation) {

	  navigator.geolocation.getCurrentPosition(function(position) {
	    
	    var pos = {
	      lat: position.coords.latitude,
	      lng: position.coords.longitude
	    };

	    infoWindow.setPosition(pos);

	    infoWindow.setContent("You're here");

	    map.setCenter(pos);
		
		var elevator= new google.maps.ElevationService;
		var thisElevation;
		elevator.getElevationForLocations({
		    'locations': [pos]
		  }, function(results, status) {
				thisElevation = results[0].elevation;
				getPos(pos, map, thisElevation);
		  });
	    
	  }, function() {
	    handleLocationError(true, infoWindow, map.getCenter());
	  });


		} else {
		  // Browser doesn't support Geolocation
		  handleLocationError(false, infoWindow, map.getCenter());
	}
		//adding watchPosition
	    navigator.geolocation.watchPosition(pos) {
	    maximumAge: 1000,
	    timeout: 300000,
  		enableHighAccuracy: true
	  	};
	//ending of watchPosition

}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
}

function getPos(pos, map, thisElevation) {
	$(".posBtn").click(function (e) {
		e.preventDefault();
		
		var myLat = pos.lat
		,	myLong = pos.lng;

		var geocoder = new google.maps.Geocoder;
		
		function geocodeLatLng(lat, long, geocoder, map, thisElevation) {
			var latLng = {"lat":lat, "lng":long}
			console.log(thisElevation)
		  	geocoder.geocode({'location': latLng}, function(results, status) {
		    if (status === google.maps.GeocoderStatus.OK) {
		      if (results[0]) {

		        var marker = new google.maps.Marker({
		          position: latLng,
		          map: map
		        });

		        var address = results[0].formatted_address;

		        var d = new Date().toString()
		        
		        var location = {
		        	"elev": thisElevation,
		        	"lat": lat,
		        	"long": long,
		        	"address": address,
		        	"time": d,
		        	"userId" : $('.user').val()
		       		 }
		        console.log(location)
					$.ajax({
						type: 'POST',
						data: JSON.stringify(location),
						dataType: 'json',
				        contentType: 'application/json',
                        url: '/update',						
                        success: function(data) {
                                                        
                            var count = $('.record').length;                        
							var newRec = $("<div class=\"record\" data-id='"+data.id+"'></div>").html((count+1)+".<br>"+"lat: "+lat+"<br>"+"long: "+long+"<br>"+"addy: "+address+"<br>"+"time: "+d+"<br>"+"elevation: "+thisElevation+"\n\n\n" + '<button class="delete">X</button>');
							$(".records").append(newRec)	
                        }
                    });
		      
		      } else {
		        window.alert('No results found');
		      }
		    } else {
		      window.alert('Geocoder failed due to: ' + status);
		    }
		  });
		}

		geocodeLatLng(myLat, myLong, geocoder, map, thisElevation);
	})
}

function login() {
	var username = $(".username").val()
	,	password = $(".password").val()

	var user = {
		
		"username": username, 
		"password": password

		}
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(user),
        contentType: 'application/json',
        dataType: 'json',
        url: '/login',
        success: function(data) {
        	if( !data.success ){
        		alert("Failed to register"); return;
        	}
        	var userId = data.userId;
        	$('.user').val(userId);   	//var user = data.user;
        	localStorage.setItem("id", userId)
        	/*localStorage.setItem("username", data[0].username)
        	localStorage.setItem("loggedIn", true)*/
        	$('.loginForm').remove();
        	$('.mapContainer').removeClass('hidden');
    		//$('.wrapper').html(data.content);
    		initMap();
    		$.get("/records?userId="+userId, function(data) {
				for(var i = data.length - 1; i >= 0; i--){
					var elev = data[i].elev;
					var lat = data[i].lat;
					var long = data[i].long;
					var address = data[i].address;
					var time = data[i].time;
					var newRec = $("<div class=\"record\" data-id='"+data[i]._id+"'></div>").html(data.length - i +".<br>"+"lat: "+lat+"<br>"+"long: "+long+"<br>"+"addy: "+address+"<br>"+"time: "+time+"<br>"+"elevation: "+elev+"\n\n\n" + '<button class="delete">X</button>')
					$(".records").append(newRec)
				}
			});
        		
        }
    });
	
}

function createAccount() {
	window.location.href = "/new.html"
}

function createAndEnter() {

	var username = $(".username").val()
	,	password = $(".password").val()

	var user = {
		
		"username": username, 
		"password": password

		}
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(user),
        contentType: 'application/json',
        dataType: 'json',
        url: '/new',
        success: function (data) {
        	window.location.href = "index.html"
        }
    });


}


$(document).on('click', '.delete', function(e){
	e.preventDefault();
	var parent = $(this).parent('.record');
	$.ajax({
		type: 'POST',
		data: JSON.stringify({id:parent.data('id')}) ,
        contentType: 'application/json',
        dataType: 'json',
        url: '/delete',
        cache: false,					
        success: function(data) {
        	console.log('deleted response: ' + data.success);
        	if(data.success) {
            	parent.fadeOut().remove();
            }
        }
    });
})




