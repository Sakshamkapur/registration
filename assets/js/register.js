// var response = grecaptcha.getResponse();

// if(response.length == 0)
//     //reCaptcha not verified

// else



$('#registerbtn').click(function(e){
    e.preventDefault();
    function register(){
        var data = $('.login').serializeArray();
        if(data[2].value!=data[3].value){
            alert("password do not match!");
        }else if(data[0].value==""||data[1].value==""||data[2].value==""||data[3].value==""){
            alert("Cannot leave a field empty");
        }else{
            var myKeyVals = {
                name: data[0].value,
                email: data[1].value,
                pass: data[2].value
            };
            
            $.ajax({
                type: 'POST',
                url: "/register_details",
                    data: myKeyVals,
                success: function(resultData) { 
                    if(resultData.length == 0){
                        alert('No data for the entered filter value');
                    }
                    else{
                        alert('You have been registered Successfully!');
                        window.location.href = '/';
                    }
                }
            });
        }
    }
    if($('.g-recaptcha')){
        grecaptcha.ready(function() {
            grecaptcha.execute('6LeOhOgUAAAAAARUkys_XMOjxnhW0x_PJPIxmL5n', {action: 'homepage'}).then(function(token) {
                $.ajax({
                    type: 'POST',
                    url: '/verify',
                    data: {secret: "6LeOhOgUAAAAANDRrn9NPLHZcwAALz0ZgBNtCxl4",response:token},
                    success: function(resultData) { 
                        if(!resultData.success){
                            alert("You might be a robot!");
                        }else{
                            register();
                        }
                    }
                });
            });
        });
    }else{
        register()
    }
});