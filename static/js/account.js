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
                        $('#name').fadeIn().text("Name: " + data.name);
                        $('#id').fadeIn().text("Login id: " + data._id);
                        $('#edit').fadeIn().text('Edit');
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

    $("#logout").click(function(){
        Cookies.remove('loginId');
        Cookies.remove('password');
        
    });

    $("#edit").click(function(){
        $(".User-Info").hide();
        $(".hide_field").fadeIn();
        
    });

    $("#save").click(function(){
        $(".hide_field").hide();
        $(".User-Info").fadeIn();
    });

})


