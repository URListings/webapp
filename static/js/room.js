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
			marker = new google.maps.Marker({map: map, icon: icon, title: place.name, 
						position: place.geometry.location});
			$("#latlong").val(marker.position.lat() + ','+marker.position.lng());
			markers.push(marker);
			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
			map.fitBounds(bounds);
			map.setZoom(16);
		});
	}
	
	function processJson(json, isNew) {
		var outpuDiv;
		var content = $("#row_template").html();
		if(isNew) {
			outpuDiv = $('<div id="'+ json._id +'_content">' + content + '</div>');
			$("#item_set").prepend(outpuDiv);
		} else {
			outpuDiv = $('#' + json._id + '_content');
			outpuDiv.html(content);
		}
		outpuDiv.find('#address_').text(json.address).removeAttr("id");
		outpuDiv.find('#rent_').text(json.rent).removeAttr("id");
		outpuDiv.find('#desc_').text(json.description).removeAttr("id");
		outpuDiv.find('#title_').text(json.title).removeAttr("id");
		outpuDiv.find('#rentin_').text(getArrayString(json.rent_in)).removeAttr("id");amenities_
		outpuDiv.find('#amenities_').text(getArrayString(json.amenities)).removeAttr("id");
		var edit = outpuDiv.find('#edit_').removeAttr("id");
		var del = outpuDiv.find('#delete_').removeAttr("id");
		$.data(edit, "data", json);
		$.data(del, "data", json.id);
	}
	
	function getArrayString(arr) {
		var out = '';
		if(arr) {
			for(i = 0, len = arr.length; i < len; i++) {
				if(i + 1 == len) {
					out += arr[i];
				} else {
					out = out + arr[i] + ', ';
				}
			}
		}
		return out;
	}
	
	initMap();
	$('#new_entry').on('shown.bs.modal', function (e) {
		google.maps.event.trigger(map, "resize");
		map.setCenter(map.getCenter());
		$('#send_message').hide();
	}).on('hidden.bs.modal', function (e) {
		$("#send_message").text('');
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
		isNew = data.prop_id === '' || data.prop_id === undefined;
		url = isNew ? '/addRoom' : '/editRoom';
		$.ajax({
			type:'POST',
			url:url,
			dataType:'json',
			data: data,
			beforeSend: function() {
			},
			success: function(response) {
				if(response.valid) {
					$('#new_entry').modal('hide');
					processJson(response.data, isNew);
				} else {
					$("#send_message").text(response.message).show();
				}
			}
		});
	});
	$('a[aria-controls="myListings"]').on('shown.bs.tab', function (e) {
		$.getJSON('userRooms').done(function(response) {
			arr = response.data;
			for(i = 0, len = arr.length; i < len; i++) {
				processJson(arr[i], true);
			}
		});
	});
	$('button[data-target="#new_entry"]').on('show.bs.modal', function (e) {
		console.log(this);
	});
	$('button[data-target="delete"]').on('click', function (e) {
		console.log(this);
	});
});

