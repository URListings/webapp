$(document).ready(function(){
	var map;
	var markers = [];
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
		markers = [];
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
			marker = new google.maps.Marker({icon: icon, title: place.name, 
						position: place.geometry.location});
			$("#latlong").val(marker.position.lat() + ','+marker.position.lng());
			markers.push(marker);
			setMarkersMap(map);
			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
			map.fitBounds(bounds);
			map.setZoom(16);
		});
	}
	
	function setMarkersMap(map) {
		for(var i = 0, len = markers.length; i < len; i++) {
			markers[i].setMap(map);
		}
	}
	
	function processJson(json, isNew) {
		var outpuDiv;
		var content = $("#row_template").html();
		if(isNew) {
			outpuDiv = $('<div id="'+ json._id +'_content">' + content + '</div>');
		} else {
			outpuDiv = $('#' + json._id + '_content');
			outpuDiv.html(content);
		}
		outpuDiv.find('#address_').text(json.address).removeAttr("id");
		outpuDiv.find('#rent_').text(json.rent).removeAttr("id");
		outpuDiv.find('#desc_').text(json.description).removeAttr("id");
		outpuDiv.find('#title_').text(json.title).removeAttr("id");
		outpuDiv.find('#rentin_').text(getArrayString(json.rent_in)).removeAttr("id");
		outpuDiv.find('#amenities_').text(getArrayString(json.amenities)).removeAttr("id");
		var edit = outpuDiv.find('#edit_').removeAttr("id");
		var del = outpuDiv.find('#delete_').removeAttr("id");
		edit.data("data", json);
		del.data("data", json._id);
		return outpuDiv;
	}
	function getArrayString(arr) {
		var out = '';
		if(arr) {
			out = arr.join(", ");
		}
		return out;
	}
	
	function getUser() {
		id = Cookies.get('loginId');
		if(id) {
			return id;
		} else {
			return '';
		}
	}
	
	function getFormData(serializeArray) {
		data = {};
		listFields = {"amenities":true,"rent_in":true};
		for(i = 0, len = ser.length; i < len; i++) {
			name = ser[i].name;
			if(data[name] && data[name].push) {
				data[name].push(ser[i].value);
			} else {
				if(listFields[name]) {
					data[name] = [ser[i].value];
					delete listFields[name];
				} else {
					data[name] = ser[i].value;
				}
			}
		}
		for(key in listFields) {
			data[key] = [];
		}
		data.user = getUser() ;
		return data;
	}
	
	function setFormFields(json) {
		var form = $("#form_rental");
		var coord = json.latlong.split(",");
		$("#prop_id").val(json._id);
		$("#title").val(json.title);
		$("#latlong").val(json.latlong);
		$("#address").val(json.address);
		$("#rent").val(json.rent);
		$("#description").val(json.description);
		$("#id").val(json._id);
		setFormMultiple(json.amenities);
		setFormMultiple(json.rent_in);
		var latLng = new google.maps.LatLng(Number(coord[0]), Number(coord[1]));
		var marker = new google.maps.Marker({position: latLng});
		markers.push(marker)
		setMarkersMap(map);
		map.setCenter(latLng);
		map.fitBounds(new google.maps.LatLngBounds(latLng, latLng));
		map.setZoom(16);
	}
	
	function setFormMultiple(arr) {
		for(var i =0, len = arr.length;i < len;i++) {
			$('#chk_' + arr[i]).prop("checked", true);
		}
	}
	initMap();
	$('#new_entry').on('shown.bs.modal', function (e) {
		google.maps.event.trigger(map, "resize");
		map.setCenter(map.getCenter());
		$('#send_message').hide();
	}).on('hidden.bs.modal', function (e) {
		$("#send_message").text('');
		$('#form_rental')[0].reset();
		$('#form_rental input[type="text"], #form_rental input[type="hidden"]').val('');
		$('#form_rental input[type="checkbox"]').prop('checked', false);
		setMarkersMap(null);
		markers = [];
	});
	$("#submit").click(function() {
		ser = $("#form_rental").serializeArray();
		data = getFormData(ser)
		isNew = data._id === '' || data._id === undefined;
		url = isNew ? '/userRooms' : '/userRooms/' + data._id;
		requestType = isNew ? 'POST' : 'PUT';
		$.ajax({
			type:requestType,
			url:url,
			dataType:'json',
			data: data,
			success: function(response) {
				if(response.valid) {
					$('#new_entry').modal('hide');
					outputDiv = processJson(response.data, isNew);
					BootstrapDialog.alert(response.message);
					$("#item_set").prepend(outputDiv);
				} else {
					$("#send_message").text(response.message).show();
				}
			}
		});
	});
	$('a[aria-controls="myListings"]').on('shown.bs.tab', function (e) {
		var itemDiv = $("#item_set");
		if(!itemDiv.hasClass("loaded")) {
			$.getJSON('userRooms', 
				{user:getUser()}
			).done(function(response) {
				arr = response.data;
				itemDiv.addClass("loaded");
				for(i = 0, len = arr.length; i < len; i++) {
					outputDiv = processJson(arr[i], true);
					$("#item_set").append(outputDiv);
				}
				if(arr.length == 0) {
					$("#empty_set").show();
				}
			});
		}
	});
	$('#item_set').on('click', 'button.edit', function (e) {
		setFormFields($.data(this, "data"));
		$('#new_entry').modal('show');
	});
	$('#item_set').on('click', 'button.delete', function (e) {
		var id = $.data(this, "data");
		BootstrapDialog.confirm({
			title:"Confirm",
			message:"Are you sure you want to delete?",
			callback:function(result) {
				if(result) {
					$.ajax({
						type:'DELETE',
						url:'/userRooms/' + id,
						data:{user:getUser()},
						dataType:'json',
						success: function(response) {
							if(response.valid) {
								$("#" + id + "_content").remove();
								if($("#item_set").is(":empty")) {
									$("#empty_set").show();
								}
							}
							BootstrapDialog.alert(response.message);
						},
						error: function(req, status) {
							BootstrapDialog.alert('There was an error in the operation');
						}
					});
				}
			}
		});
	});
});

