// Get the current trip details
function getBasicInfo(id){
	postVars = {'init': 'true', 'id': id};
	makeAJAX(postVars).done(function(response){
		console.log(response);
		$('#profile_text').prepend("<span id=\"username\">" + response['username'] + "</span> " + response['trip'] + "<br/>");
	});
}

// Makes an AJAX request to the API, which returns the photo info
function makePhotoRequest(pID, uID, oldStamp, numNeeded, prepend){
	postVars = {'photoRequest': 'true', 'photoID': pID, 'userID': uID, 'oldStamp': oldStamp, 'numNeeded': numNeeded};
	makeAJAX(postVars).done(function(response){

		console.log(response);
		
		for (photo in response){
			newHTML = "<div class=\"photo_wrapper\" id=\"" + response[photo]['title'] + "_image\">" +
						"<div class=\"photo_title\" id=\"" + response[photo]['title'] + "_title\">" +
						response[photo]['title'] + 
						"</div>"  +
						"<img src=" + response[photo]['path'] + " class=\"photo\">" +
						"<div class=\"photo_description\" id=\"" + response[photo]['title'] + "_desc\">" +
						response[photo]['description'] +
						"</div>" +
						"<button class=\"deletePhoto\" id=\"" + response[photo]['id'] + "\">X</button>" +
					"</div><br id=\"" + response[photo]['id'] + "_br\"/>";
			if (prepend){
				$("#body_content").prepend(
					newHTML
				);
			}else{
				$("#body_content").append(
					newHTML
				);
			}
		}
			
	});
}

function addFollowButton(id){
	postVars = {'followQuery': 'true', 'id': id}

	makeAJAX(postVars).done(function(response){
		$('#profile_text').append("<button id=\"follow_button\"></button>");
		console.log(response);
		if (response['status'] == false){
			buttonText = "Follow";
		}else{
			buttonText = "Following";
		}
		$('#follow_button').html(buttonText);
		$('#follow_button').attr('class', buttonText);
	});
}

function makeAJAX(dynamicData){
	return $.ajax({
		url: 'api.php',
		type: "post",
		data: dynamicData
	});
}




//////////////////////////////////////////////////////////////////////////////////
//																				//
//																				//
//									JQUERY										//
//																				//
//																				//
//////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){


	$('#uploadInit').click(function(){
		$('#uploadSection').show();
	});

	$('#uploadCancel').click(function(){
		$('#uploadSection').hide();
	});

	$('#display_options').click(function(){
		$('#options').slideToggle('fast'); 
	});

	$('#settings_button').click(function(){
		$('#settings').slideToggle('fast');
	});

	$("#logout").click(function(event){
		event.preventDefault();
		serializedData = "logout=true";
		apirequest = $.ajax({
			url: "api.php",
			type: "post",
			data: serializedData
		}).done(function(response){
			window.location = "login.php";
		});

	});


	$("#body_content").on('click', '.deletePhoto', function() {
					
		item = $(this).parent();
		line = $(this).attr('id');
		line = line + "_br";
		apirequest =$.ajax({
			url: "api.php",
			type: "post",
			data: "deletePhoto=true&button=" + $(this).attr('id')
		}).done(function(response){
			console.log(response);
			console.log(item);
			$(item).remove();
			$("#" + line).remove();

		});


	});

	// AJAX request to upload a file
	$('#upload').submit(function(event){
		event.preventDefault();

		serializedData = $(this).serialize() + "&upload=true";
		file = $('#fileToUpload').prop('files')[0];
		formData = new FormData($(this)[0]);
		formData.append('longitude', -25.2744);
		formData.append('latitude', 133.7751);
		formData.append('description', $('#description').val());
		formData.append('upload', true);
		for(var pair of formData.entries()) {
			console.log(pair[0]+ ', '+ pair[1]); 
		}
		console.log(serializedData);
		apirequest = $.ajax({
			url: "api.php",
			type: "post",
			data: formData,
			cache: false,
	    	contentType: false,
	    	processData: false
	     
		}).done(function(response){
			if (response["valid"]){
				$('#title').val("");
				$('#fileToUpload').val("");
				$('#description').val("");
				$('#private').prop('checked', false);
				$('#uploadStatus').html("Uploading Complete!");
				$('#uploadSection').hide();
				// This is only in feed moode
				makePhotoRequest(1, 1, '2019-12-18 09:15:54', 1, true);
				
			}else if(response["file"] == "invalid"){
				$('#uploadStatus').html("Please Upload an image file only");
			}
			console.log(response);
		});
		
	});

	$("#Trip").click(function(){
		$("#trip_form").show();
		$("#settings").hide();
	});

	$("#cancel_trip").click(function(){
		$("#trip_form").hide();
	});

	$("#set_trip").submit(function(event){
		event.preventDefault();
		serializedData = $(this).serialize() + "&";
	});


	$('#profile_text').on('click', '#follow_button', function(){
		user = $('#username').text();
		button = $('#follow_button');
		if (button.text() == 'Follow'){
			postVars = {'toFollow': user, 'newFollow': 'true'};
			newText = "Following";
		}else{
			postVars = {'toUnfollow': user, 'stopFollow': 'true'};
			newText = "Follow";
		}
		
		makeAJAX(postVars).done(function(){
			button.toggleClass('Following').toggleClass('Follow');
			button.text(newText);
		});
		
	});


});
