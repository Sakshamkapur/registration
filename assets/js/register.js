$('#registerbtn').click(function(e){
    e.preventDefault();
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
        console.log(myKeyVals);
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
});