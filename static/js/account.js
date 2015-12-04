$(document).ready(function(){
    $('#message').hide();
    var info = checkCookie();    
    
    function checkCookie(){
        var id = Cookies.get('loginId');
        var password = Cookies.get('password');
        if(checkValid(id) && checkValid(password)){
            var fName = Cookies.get('fName');
            var lName = Cookies.get('lName');
            if(checkValid(fName) && checkValid(lName)){
                console.log('Cookies of name exist');
                //$('#name').fadeIn().text(fName + ' ' + lName);
                //$('#id').fadeIn().text(id);
                $('#nameValue').fadeIn().text(fName + ' ' + lName);
                $('#loginIdValue').fadeIn().text(id);
            }
            else{
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
                            $('#nameValue').fadeIn().text(data.fName + ' ' + data.lName);
                            $('#loginIdValue').fadeIn().text(data._id);
                            //$('#edit').fadeIn();
                            Cookies.set('fName', data.fName, {expires: 365});
                            Cookies.set('lName', data.lName, {expires: 365});
                        }
                        else{
                            $('#nameValue').fadeIn().text(data.message);
                            console.log('account info not found');
                        }
                    }
                });
            }
        }
        else{
            window.location = '/';    
        }
    }

    function checkValid(arg){
        if(arg !== null && arg !== undefined && arg !== ''){
            return true;
        }
        else{
            return false;
        }
    }

    $("#logout").click(function(){
        Cookies.remove('loginId');
        Cookies.remove('password');
        Cookies.remove('fName');
        Cookies.remove('lName');
    });

    $("#nameEdit").click(function(){
        $(".User-Info").hide();
        $(".hide_field").fadeIn();
        $('#title').text('Changing Account Settings');
        $('#message').hide().text('');
        //var tmp_name = $('#name').text();
        //var tmp_id = $('#id').text();
        //$('#edit_name').val(tmp_name);
        //$('#edit_id').val(tmp_id);

    });

    $('#cancel').click(function(){
        $(".hide_field").hide();
        $(".User-Info").fadeIn();
        $('#title').text('Account Information');
        $('.new_info').val('');
        $("#message").hide().text('');
    });

    $("#save").click(function(){
        $(".hide_field").hide();
        $(".User-Info").fadeIn();
        var old_name = $('#nameValue').text();
        var id = $('#loginIdValue').text();
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
                    $('#nameValue').text(data.fName + ' ' + data.lName);
                    Cookies.set('fName', data.fName, {expires: 365});
                    Cookies.set('lName', data.lName, {expires: 365});
                }
                else{
                    $('#message').fadeIn().text('Saving failed');
                }
            }
            
        });
        $(".User-Info").fadeIn();
        $('#title').text('Account Information');
    });

    


})


