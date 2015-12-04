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
                    var table = $('#sale_table');
                    $.each(json, function(index, value){
                        $('#sale_table').append(createRow(value));
                    });
                }
            }
        });
    }

    function createRow(row){
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var a1 = document.createElement('a');
        var text1 = document.createTextNode(row._title);
        a1.appendChild(text1);
        a1.href="/sale/post/" + row._id;
        a1.id = row._id;
        td1.appendChild(a1);
        tr.appendChild(td1);

        var td2 = document.createElement('td');
        var a2 = document.createElement('a');
        var text2 = document.createTextNode(row.fName+' '+row.lName);
        a2.appendChild(text2);
        td2.appendChild(a2);
        tr.appendChild(td2);

        var td3 = document.createElement('td');
        var text3 = document.createTextNode(row.create_date);
        td3.appendChild(text3);
        tr.appendChild(td3);
        
        return tr;
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
        

            location.reload();
            //$(".sale-info").fadeIn();
            //$(".post-form").hide();
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

