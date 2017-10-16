var currentCardID = ""; 
var separator = "*///**//*~!";
var dateArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
var cardNumber = 1;

 
 
 $( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
  } );
  
 
 $( function() {
    $( ".draggable" ).draggable();
  } );


 
 $(document).ready(function() {
	$("#settingsMenu").hide();
	$("#newMenu").hide();
	$("#blackout").hide();
	console.log("hide");
	
	loadCards();
	autoSave();
	
 
	/*bring up menu to create new card */
	$("#newBTN").click(function(){
		$("#newMenu").show();
		$("#blackout").show();
	});
	
	
	$("#refreshBTN").click(function(){
		if(confirm("Do you want to delete all cards?")){
			removeLocalStorage("notecardslist");
			$("ul li").remove();
			loadCards();
		}
	});
	
	/*create new card */
	$("#createNewBTN").click(function(){
		var cardTitle = $("#newCardTitle").val();
		var cardBody = $("#newCardBody").val();
		cardNumber += 1;
		var newCard = '<li class="col-xs-4 ui-state-default"><span style="background: #FFF;"> <i class="fa fa-cog settingsBTN" aria-hidden="true"></i> <p id="cardId'+ cardNumber +
		'">'+cardNumber+'</p><input type="text" placeholder="title" value="'+cardTitle+
		'" style="color: #000;"><textarea placeholder="text..." style="color: #000;">'+ cardBody + '</textarea> </span></li>';
		$("ul").append(newCard);
		
		var cardTitle = $("#newCardTitle").val("");
		var cardBody = $("#newCardBody").val("");
	});
	

	/* card settings / get which card was clicked*/ 
	$(document).on("click", ".settingsBTN", function(){
		$("#settingsMenu").show();
		$("#blackout").show();
		currentCardID = $(this).parent().children('[id^="cardId"]').attr('id'); 
	});
	

	/* close new card creation window*/
	$(document).on("click", "#newMenu .closeSettings", function(){
		$("#newMenu").hide();
		$("#blackout").hide();
	});
	
	
	/* close card settings window*/
	$(document).on("click", "#settingsMenu .closeSettings", function(){
		$("#settingsMenu").hide();
		$("#blackout").hide();
	});
	
	/* close card settings window*/
	$(document).on("click", "#uploadMenu .closeSettings", function(){
		$("#uploadMenu").hide();
		$("#blackout").hide();
	});
	
	
	/* change card settings*/
	$(document).on("click", ".applyBTN", function(){
		var color = $("#cardColor").val();
		var textColor = $("#textColor").val();
		
		$("#" + currentCardID).parent().css("background", color);
		$("#cardId1").parent().children("input").css("background", color );
		$("#cardId1").parent().children("textarea").css("background", color );
		$("#cardId1").parent().children("input").css("color", textColor );
		$("#cardId1").parent().children("textarea").css("color", textColor );
		
		/*var titleSize = $("#titleSize").val() + "px";
		var bodySize = $("#bodySize").val() + "px";
		console.log(color + " " + titleSize + " " +  bodySize + " " + cardHeight);*/
		/*$("#cardId1").parent().children("input").css("font-size", titleSize );
		$("#cardId1").parent().children("textarea").css("font-size", bodySize );
		
		var cardHeight = $("#" + currentCardID).parent().height() + 20 + "px";
		$("li span").css("height", cardHeight);*/
		
		//close window
		$("#settingsMenu").hide();
		$("#blackout").hide();
	});
	
	
	/*delete card */
	$(document).on("click", "#deleteBTN", function(){
		//delete card
		cardNumber -= 1;
		var cardTitle = '"' + $("#" + currentCardID).parent().children("input").val() + '"';
		var message = "Are you sure you want to delete " + cardTitle + "?";
		if(confirm(message)){
			$("#" + currentCardID).parent().parent().remove();
			$("#settingsMenu").hide();
			$("#blackout").hide();
		}
	});
	
	
	/*save all cards*/
	$("#saveCardsBTN").click(function(){
		saveCards();
	});
	
	
	/* download data */
	$("#downloadBTN").click(function(){
		var content = saveCards();
		var link = makeTextFile(content);
		alert("Save the text in a text file");
		window.open(link);
	});
	
	/* upload data */
	$("#uploadBTN").click(function(){
		$("#uploadMenu").show();
		$("#blackout").show();
	});
	
	
	/* show upload data window */
	$("#uploadDataBTN").click(function(){
		$("ul li").remove();
		var val = $("#uploadDataTextArea").val();
		setLocalStorage("notecardslist", val);
		loadCards();
	});
	
});

function autoSave(){
	//3000ms = 3 sec
	setInterval(saveCards, 10000); //every ten sec
}

function saveCards() { 
	var list = $("ul li");
	var title, body, textColor, bodyColor, cardInfo;
	var stringList = "";
	for(var i = 0; i < list.length; ++i) {
		title = list[i].getElementsByTagName("input")[0].value;
		body = list[i].getElementsByTagName("textarea")[0].value;
		bodyColor = list[i].getElementsByTagName("span")[0].style.backgroundColor;
		textColor  = list[i].getElementsByTagName("textarea")[0].style.color;
		if( title == "") { title = ' '; }
		if( body == "") { body = ' '; }
		cardInfo = '{"title": "' +title + '", "body": "' + body + '", "textColor": "' + textColor + '", "bodyColor": "' + bodyColor + '"}';
		stringList += cardInfo + separator;
	}
	
	//last saved getDate()
	var lastSaved = "Last Saved: " + getDate();
	$("#lastSaved").text(lastSaved);
	
	setLocalStorage("notecardslistLastsaved", lastSaved);
	setLocalStorage("notecardslist", stringList);
	
	return stringList;
}

var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };


function loadCards(){  
	var stringList = getLocalStorage("notecardslist");
	console.log(stringList);
	
		if(stringList != null && stringList != undefined && stringList != "") {
			stringList = stringList.split(separator);
			var stringListLength = stringList.length;
			cardNumber = stringListLength;
			var myobj; var cardNum; 
			
			for(var i = 0; i < stringListLength; ++i) {
				if(stringList[i] != ""){
					cardNum = i + 1;
					myobj = JSON.parse(stringList[i]);
					var newCard = '<li class="col-xs-4 ui-state-default"><span style="background: '+ myobj["bodyColor"]
					+';"> <i class="fa fa-cog settingsBTN" aria-hidden="true"></i> <p id="cardId'+ cardNum +
					'">'+cardNum+'</p><input type="text" placeholder="title" value="'+ myobj["title"] +
					'" style="color: '+ myobj["textColor"] +'; background:'+ myobj["bodyColor"] + ';"><textarea placeholder="text..." style="color: '+ myobj["textColor"]
					+ '; background:'+ myobj["bodyColor"] +';">'+ myobj["body"] + '</textarea> </span></li>';
					$("ul").append(newCard);
				}
			}
		}
		else{
			//if nothing saved, add one card
			var cardTitle = "Sample Title";
			var cardBody = "Sample Text";
			var newCardNum = cardNumber;
			var newCard = '<li class="col-xs-4 ui-state-default"><span style="background: #FFF;"> <i class="fa fa-cog settingsBTN" aria-hidden="true"></i> <p id="cardId'+ newCardNum +
			'">'+newCardNum+'</p><input type="text" placeholder="title" value="'+cardTitle+
			'" style="color: #000;"><textarea placeholder="text..." style="color: #000;">'+ cardBody + '</textarea> </span></li>';
			$("ul").append(newCard);
		}

	
	
	
	
	var date = getLocalStorage("notecardslistLastsaved");
	if (date != null && date != undefined) {
		$("#lastSaved").text(date);
	}
	else{
		$("#lastSaved").text("Last Saved: N/A");
	}
}




//get current date and time
function getDate(){
	var date = new Date();
	var lastSaved = dateArray[date.getDay()] + " " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() 
	+ " " + formatTime(date.getHours()) + ":" + formatTime(date.getMinutes()) + ":" + formatTime(date.getMilliseconds());
	return lastSaved;
}


//format nurmber so it is at least two digits
function formatTime(num){
	if(num < 10) { num = "0" + num; }
	return num;
}
