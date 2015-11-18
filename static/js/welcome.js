$(document).ready(function(){
    checkCookie();    
 
 
    function checkCookie(){
        console.log('check cookie');

        var id = Cookies.get('loginId');
        var password = Cookies.get('password');
        if(id !== null && id !== undefined && id !== '' && password !== null && password !== undefined && password !== ''){
            console.log('check pass');
            var reqJson = {_id:id, pass:password};
			$.ajax({
				type:'POST',
				url:'/profile/',
				data: reqJson,
				dataType:'json',
				beforeSend: function() {
				},
				success: function(data ) {
					if(data.valid) {
						console.log('already login');
					}
                    else{
                        console.log('cookie not correct');
                        window.location = '/';
                    }
                }
			});
        }
        else{
            console.log('no cookie');
            window.location = '/';
        }
    }

    $("#account").click(function(){
        var id = Cookies.get('loginId');
        if(id == 'Guest'){
            window.location = '/';
        }
        else{
                window.location = '/account';
            }
    });

    $("#logout").click(function(){
        Cookies.remove('loginId');
        Cookies.remove('password');
        
    });

})

