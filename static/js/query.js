$(document).ready(function(){
    var info = checkCookie();    
    
    function checkCookie(){
        var id = Cookies.get('loginId');
        var password = Cookies.get('password');
        if(id !== null && id !== undefined && id !== '' && password !== null && password !== undefined && password !== ''){
            var reqJson = {_id:id, pass:password};
            $.ajax({
                type:'POST',
                url:'/query/',
                data: reqJson,
                dataType:'json',
                beforeSend: function(){},
                success: function(data){
                    if(data.valid){
                        console.log('account info found');
                        $('#name').fadeIn().text(data.name);
                    }
                    else{
                        $('#name').fadeIn().text(data.message);
                        console.log('account info not found');
                    }
                }
            });
        }
        else{
            window.location = '/';    
        }
    }

})


