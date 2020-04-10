$('#loginbtn').click(function(e){
	e.preventDefault();
	var data = $('.login').serializeArray();
	if(data[0].value==""||data[1].value==""){
		alert("Fill both fields");
	}else{
		var myKeyVals = {
            email: data[0].value,
            pass: data[1].value
        };
		$.ajax({
            type: 'POST',
            url: "/login_details",
            data: myKeyVals,
            success: function(resultData) { 
            	console.log(resultData);
            	if(resultData.login){
            		alert('login Successfully!');
                	window.location.href = '/users';
            	}else{
            		alert(resultData.err);
            	}
            }
        });
	}
});