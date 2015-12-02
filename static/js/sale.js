$(document).ready(function(){

    

    $("#postB").click(function(){
        $(".post-form").fadeIn();
        $(".sale-info").hide();
    })

    $("#back").click(function(){
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
                url:'/post_sale/',
                dataType:'json',
                data:reqJson,
                beforeSend: function(){},
                success: function(data){
                    if(data.valid){
                        console.log(data.message);
                        
                    }
                    console.log(data.message);
                }
            });
        


            $(".sale-info").fadeIn();
            $(".post-form").hide();
        }
    })

    function mandatoryCheck(json) {
        for(s in json) {
            if(json[s] === null || json[s] === undefined || json[s].trim() === '') {
                $('#valid_message').fadeIn().text('Please fill all mandatory fields');
                return false;
            }
        }
        return true;
    }



})

