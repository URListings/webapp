$(document).ready(function() {
	$("#signup").click(function() {
		var is_hidden = ($("#show").val() === '0');
		$('#valid_message').hide();
		if(is_hidden) {
			$("#profile_group").fadeIn();
			$("#show").val('1');
		} else {
			var reqJson = {_id:$('#loginEmail').val().toLowerCase(), pass:$('#loginPass').val(),
							passC:$('#loginPassC').val(),fName:$('#firstName').val(), lName:$('#lastName').val()};
			if(mandatoryCheck(reqJson) && validateSignUp(reqJson)) {
				$.ajax({
					type:'POST',
					url:'/users/',
					dataType:'json',
					data: reqJson,
					beforeSend: function() {
					},
					success: function(data ) {
						$('#valid_message').fadeIn().text(data.message);
					}
				});
			}
		}
	});
	$("#login").click(function() {
		$('#valid_message').hide();
		var reqJson = {_id:$('#loginEmail').val().toLowerCase(), pass:$('#loginPass').val()};
		if(mandatoryCheck(reqJson)) {
			$.ajax({
				type:'POST',
				url:'/profile/',
				data: reqJson,
				dataType:'json',
				beforeSend: function() {
				},
				success: function(data ) {
					if(data.valid) {
						window.location = data.message
					} else {
						$('#valid_message').fadeIn().text(data.message);
					}
				}
			});
		}
	});
	
	function validateSignUp(json) {
		if(json.pass != json.passC) {
			$('#valid_message').fadeIn().text('Passwords do not match');
			return false;
		}
		return true;
	}
	
	function mandatoryCheck(json) {
		for(s in json) {
			if(json[s] === null || json[s] === undefined || json[s].trim() === '') {
				$('#valid_message').fadeIn().text('Please fill all mandatory fields');
				return false;
			}
		}
		return true;
	}
});
