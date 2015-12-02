$(document).ready(function(){
	var map;
   function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 43.1551, lng: -77.5992},
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'),{types: ['geocode']});
		// Bias the SearchBox results towards current map's viewport.
		map.addListener('bounds_changed', function() {
			autocomplete.setBounds(map.getBounds());
		});
		var markers = [];
		autocomplete.addListener('place_changed', function() {
			var place = autocomplete.getPlace();
			if (place === undefined || place == null) {
				return;
			}
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			markers = [];
			var bounds = new google.maps.LatLngBounds();
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};
			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));
			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
			map.fitBounds(bounds);
			map.setZoom(16);
		});
	}
	initMap();
	$('#new_entry').on('shown.bs.modal', function (e) {
		google.maps.event.trigger(map, "resize");
		map.setCenter(map.getCenter());
	}).on('hidden.bs.modal', function (e) {
		$('#form_rental')[0].reset();
	});
	$("#submit").click(function() {
		ser = $("#form_rental").serializeArray();
		data = {};
		for(i = 0, len = ser.length; i < len; i++) {
			name = ser[i].name;
			if(data[name] !== undefined) {
				if(!data[name].push) {
					data[name] = [data[name]];
				} 
				data[name].push(ser[i].value);
			} else {
				data[name] = ser[i].value;
			}
		}
		$.ajax({
			type:'POST',
			url:'/addRoom/',
			dataType:'json',
			data: reqJson,
			beforeSend: function() {
			},
			success: function(data ) {
				$('#valid_message').fadeIn().text(data.message);
			}
		});
	});
});

