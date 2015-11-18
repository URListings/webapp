$(document).ready(function(){
    $('#message').hide();
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
                        $('#id').fadeIn().text(data._id);
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
        //var tmp_name = $('#name').text();
        //var tmp_id = $('#id').text();
        //$('#edit_name').val(tmp_name);
        //$('#edit_id').val(tmp_id);

    });

    $("#save").click(function(){
        $(".hide_field").hide();
        $(".User-Info").fadeIn();
        var old_name = $('#name').text();
        var id = $('#id').text();
        var new_fname = $('#edit_fname').val();
        var new_lname = $('#edit_lname').val();
        //var new_id = $('#edit_id').val();

        var reqJson = {_id:id, pass:Cookies.get('password'), fName:new_fname, lName:new_lname};
        $.ajax({
            type:'POST',
            url:'/Edit/',
            data:reqJson,
            dataType:'json',
            beforeSend: function(){
                $('#message').fadeIn().text('Saving profile...');
            },
            success: function(data){
                if(data.valid){
                    $('#message').fadeIn().text('Profile saved');
                    $('#name').text(data.name);
                }
                else{
                    $('#message').fadeIn().text('Saving failed');
                }
            }
            
        });
        $(".User-Info").fadeIn();

    });

    


})


