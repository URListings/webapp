$(document).ready(function() {
	$("#signup").click(function() {
		var is_hidden = ($("#show").val() === '0');
		if(is_hidden) {
			$('#valid_message').hide()
			$("#profile_group").fadeIn();
			$("#show").val('1');
		} else {
			var reqJson = {email:$('#loginEmail').val(), pass:$('#loginPass').val(),
							passC:$('#loginPassC').val(),fName:$('#firstName').val(), lName:$('#lastName').val()};
			if(mandatoryCheck(reqJson) && validateSignUp(reqJson)) {
				$.ajax({
					type:'POST',
					url:'/users/',
					dataType:'text/html',
					data: reqJson,
					beforeSend: function() {
					},
					success: function(data ) {
						alert(data);
					},
					error: function(jq,status,message) {
						$('#valid_message').fadeIn().text(jq.responseText);
					}
				});
			}
		}
	});
	$("#login").click(function() {
		var reqJson = {email:$('#loginEmail').val(), pass:$('#loginPass').val()};
		if(mandatoryCheck(reqJson)) {
			$.ajax({
				type:'POST',
				url:'/profile/',
				data: reqJson,
				dataType:'text/html',
				beforeSend: function() {
				},
				success: function(data ) {
						alert(data);
				},
				error: function(jq,status,message) {
					$('#valid_message').fadeIn().text(jq.responseText);
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
