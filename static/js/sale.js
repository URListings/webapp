$(document).ready(function(){
    getSale();
    
    function getSale(){
        $.ajax({
            type:'GET',
            url:'/getSale/',
            beforeSend: function(){},
            success: function(data){
                if(data.valid){
                    var json = data.sale_info
                    $.each(json, function(index, value){
                        console.log(index + ': ' + value._title);
                    });

                    
                }
            }
        });
    }

    $("#postB").click(function(){
        $('#valid_message').hide();
        $(".post-form").fadeIn();
        $(".sale-info").hide();
    })

    $("#back").click(function(){
        $('#valid_message').hide();
        $(".sale-info").fadeIn();
        $(".post-form").hide();
    })

    $("#submit").click(function(){
        $('#valid_message').hide();
        var id = Cookies.get('loginId');
        var password = Cookies.get('password');
        var fName = Cookies.get('fName');
        var lName = Cookies.get('lName');
        var title = $('#post_title').val();
        var content = $('#post_content').val();
        var reqJson = {_id:id, pass:password, fName:fName, lName:lName, 
                        _title:title, _content:content};
        if(mandatoryCheck(reqJson)){
            $.ajax({
                type:'POST',
                url:'/postSale/',
                dataType:'json',
                data:reqJson,
                beforeSend: function(){},
                success: function(data){
                    if(data.valid){
                        
                    }
                    
                }
            });
        


            $(".sale-info").fadeIn();
            $(".post-form").hide();
        }

    })

    function mandatoryCheck(json) {
        for(s in json) {
            if(json[s] === null || json[s] === undefined || json[s].trim() === '') {
                $('#valid_message').fadeIn().text('Please fill in all mandatory fields');
                return false;
            }
        }
        return true;
    }



})

