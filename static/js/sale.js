$(document).ready(function(){

    getSale();
    //errorDialog();
    console.log('begin');
    function errorDialog(res, message) {
        BootstrapDialog.confirm({
            title:"Confirm",
            message:"Are you sure you want to delete?",
            callback:function(result) {
                if(result) {
                    console.log("ok");
                }
                else{
                    console.log("cancel");
                }
            }
        });
    }

    function getUser() {
        id = Cookies.get('loginId');
        if(id) {
            return id;
        } else {
            return '';
        }
    }


    function getSale(){
        $.ajax({
            type:'GET',
            url:'/saleInfo/',
            beforeSend: function(){},
            success: function(data){
                if(data.valid){
                    var id = Cookies.get('loginId');
                    var json = data.sale_info
                    //var table = $('#sale_table');
                    //var user_table = $('#user_table')
                    $.each(json, function(index, value){
                        $('#sale_table').append(createRow(value));
                        if(id == value.userID){
                            $('#user_table').append(createUserRow(value));
                        }
                    });
                }
            }
        });
    }

    function createRow(row){
        var tr = document.createElement('tr');
        //tr.setAttribute('id', row._id + '_tr');
        tr.id = row._id + '_list';

        var td1 = document.createElement('td');
        var a1 = document.createElement('a');
        var text1 = document.createTextNode(row._title);
        a1.appendChild(text1);
        a1.id = row._id;
        td1.appendChild(a1);
        tr.appendChild(td1);

        var td2 = document.createElement('td');
        var text2 = document.createTextNode(row.fName+' '+row.lName);
        td2.appendChild(text2);
        tr.appendChild(td2);

        var td3 = document.createElement('td');
        var text3 = document.createTextNode(row.modified_date.split("T")[0]);
        td3.appendChild(text3);
        tr.appendChild(td3);
        
        return tr;
    }

    function createUserRow(row){
        console.log(row);
        var tr = document.createElement('tr');
        //tr.setAttribute('id', row._id + 'tr');
        tr.id = row._id + '_user';

        var td1 = document.createElement('td');
        var a1 = document.createElement('a');
        var text1 = document.createTextNode(row._title);
        a1.appendChild(text1);
        a1.id = row._id;
        td1.appendChild(a1);
        tr.appendChild(td1);

        var td2 = document.createElement('td');
        var ds = row.modified_date;
        var dss = ds.split("T")[0];
        var text2 = document.createTextNode(dss);
        td2.appendChild(text2);
        tr.appendChild(td2);

        var td3 = document.createElement('td');
        var btn = document.createElement('button');
        var t = document.createTextNode("DELETE");
        btn.appendChild(t);
        btn.id = row._id;
        td3.appendChild(btn);
        tr.appendChild(td3);
        
        return tr;
    }
 
    function editForm(data){
        $("#edit_title").val(data._title);
        $("#edit_content").val(data._content);
    }

    function setEditForm(id){
        reqJson = {_id:id};
        $.ajax({
            type:'POST',
            url:'/saleContent/',
            dataType:'json',
            data:reqJson,
            beforeSend: function(){},
            success: function(data){
                editForm(data);
            }
        });
    }

    function contentShow(id){
        reqJson = {_id:id};
        $.ajax({
            type:'POST',
            url:'/saleContent/',
            dataType:'json',
            data:reqJson,
            beforeSend: function(){},
            success: function(data){
                $("#contentTitle").text(data._title);
                $("#contentText").text(data._content);
            }
        });
    }
    

    $('a[aria-controls="listings"]').on('shown.bs.tab', function (e) {
        console.log('listings');
    })

    $('a[aria-controls="myListings"]').on('shown.bs.tab', function (e) {
        console.log('myListings');
    })

    $("#user_table").on("click", 'a', function(e){
        var id = $(this).attr("id");
        Cookies.set('sale_id', id);
        $('#saleModal2').modal('show');
        setEditForm(id);
    })

    $("#sale_table").on("click", 'a', function(e){
        var id = $(this).attr("id");
        console.log(id);
        $('#contentModal').modal('show');
        contentShow(id);
    })
    
    $("#user_table").on("click", 'button', function(e){
        var id = $(this).attr("id");
        BootstrapDialog.confirm({
            title:"Confirm",
            message:"Are you sure you want to delete?",
            callback:function(result) {
                if(result){
                    var reqJson = {_id:id, user:getUser()};
                    
                    $.ajax({
                        type:'DELETE',
                        url:'/saleInfo/',
                        dataType:'json',
                        data: reqJson,
                        success: function(response) {
                            if(response.valid) {
                                $('#' + id + '_user').remove();
                            }
                            BootstrapDialog.alert(response.message);
                        },
                        error: errorDialog
                    });                  
                }
            }
        });      
    })

    $("#submit").click(function(){
        console.log("submit click");
        var id = Cookies.get('loginId');
        var password = Cookies.get('password');
        //var fName = Cookies.get('fName');
        //var lName = Cookies.get('lName');
        var title = $('#post_title').val();
        var content = $('#post_content').val();
        var reqJson = {_id:id, pass:password, _title:title, _content:content};
        if(mandatoryCheck(reqJson)){
            $.ajax({
                type:'PUT',
                url:'/saleInfo/',
                dataType:'json',
                data:reqJson,
                beforeSend: function(){},
                success: function(data){
                    $('#saleModal').modal('hide');
                    if(data.valid){
                        reqJson.modified_date = data.modified_date;
                        reqJson._id = data._id;
                        $('#user_table').prepend(createUserRow(reqJson));
                    }
                    $('#post_title').val('');
                    $('#post_content').val('');
                    BootstrapDialog.alert(data.message);
                }
            });
        }
    })

    $("#edit_submit").click(function(){
        var id = Cookies.get('sale_id');
        var title = $('#edit_title').val();
        var content = $('#edit_content').val();
        var reqJson = {_id:id, _title:title, _content:content, user:getUser()};
        if(mandatoryCheck(reqJson)){
            $.ajax({
                type:'POST',
                url:'/saleInfo/',
                dataType:'json',
                data:reqJson,
                beforeSend: function(){},
                success: function(data){
                    $('#saleModal2').modal('hide');
                    if(data.valid){
                        reqJson.modified_date = data.modified_date;
                        $('#' + id + '_user').remove();
                        $('#user_table').prepend(createUserRow(reqJson));
                    }
                    BootstrapDialog.alert(data.message);
                }
            });
        }
    })

    

    function mandatoryCheck(json) {
        for(s in json) {
            if(json[s] === null || json[s] === undefined || json[s].trim() === '') {
                BootstrapDialog.alert(response.message);
                return false;
            }
        }
        return true;
    }



})

