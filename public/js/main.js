function initMap() {
var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 17
});

var infoWindow = new google.maps.InfoWindow({map: map});


if (navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(function(position) {
    
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    infoWindow.setPosition(pos);

    infoWindow.setContent("You are here");

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
		        	"time": d
		       		 }
		        console.log(location)
					$.ajax({
						type: 'POST',
						data: JSON.stringify(location),
				        contentType: 'application/json',
                        url: '/update',						
                        success: function(location) {
                            console.log('success');
                            console.log(JSON.stringify(location));
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

$.get( "/records", function(data) {

	for(var i = data.length - 1; i >= 0; i--){
		var elev = data[i].elev;
		var lat = data[i].lat;
		var long = data[i].long;
		var address = data[i].address;
		var time = data[i].time;
		var newRec = $("<div class=\"record\"></div>").html(data.length - i +".<br>"+"lat: "+lat+"<br>"+"long: "+long+"<br>"+"addy: "+address+"<br>"+"time: "+time+"<br>"+"elevation: "+elev+"\n\n\n");
		$(".records").append(newRec)
	}

  
});

initMap();
