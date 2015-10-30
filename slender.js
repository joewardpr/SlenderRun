var slenderDB = new Firebase('https://runforyourlife.firebaseio.com/')

var currentLocation = "bedroom" // Where the player is located within/near the house

function startSlender() {
	displaySlenderChoices(currentLocation)
}

// Choices are based on which location a player is within.
// The can only choose among the presented choices
// But the location can have multiple different descriptions.
// Perhaps we simulate how they notice different things each time they enter a location.
function displaySlenderChoices(currentLocation, kill) {

	if (kill == "yes") {
		$('#soundSlender').trigger("play")
	}

	slenderDB.child('locations').child(currentLocation).once('value', function (snap) {

		descriptions = snap.val().description		
		choices = snap.val().choices
		background = snap.val().image

		bgCSS = '#000 url(/locations/' + background + ') no-repeat'	

		$("body").css("background-repeat", "no-repeat")
		$("body").css("background-size", "cover")
		$("body").css("background-image","url('/locations/" + background + "')")

		var choiceButtons
		$('#choiceButtons').html('')
		for (var option in choices) {
		    if (choices.hasOwnProperty(option)) {
		        // This will cause the buttons to get replaced in the options area of the page
		        getLocationButton(option)
		    }
		}

		var desc = getRandomDescription(descriptions) // The randomly selected description of the location

		$('#locationDescription').html(desc)



		flashSlenderFace()

	})
	
}

// We will load all of the ether messages once (at start)
// We'll keep the list in memory and randomize when they are updated
// The display is independent of what the user is doing on the page.
function loadSlenderEtherMessages() {
		slenderDB.child('ether').child('messages').once('value', function (snap) {

			ethers = snap.val()		

			var etherText
			//$('#etherText').html('')

			// Function for random descriptions also works for ether messages
			// Select a random either message
			randomEther = getRandomDescription(ethers)

			etherFace = "<img src='/images/face-slenderman.png' class='img-circle' style='height: 40px; width: 40px'> "

			$('#etherText').hide()
			$('#etherFace').hide()
			$('#etherText').html(randomEther)
			$('#etherFace').html(etherFace)
			$('#etherText').fadeIn(2000)
			$('#etherFace').fadeIn(2000)
			$('#etherText').fadeOut(4000)
			$('#etherFace').fadeOut(4000)

	})

}

// This will create a recursive function. Over a random time interval, new ether messages will display
function initEtherMessages() {
    var etherTimer = function() {

    	// Our ether messages will display between 7 and 20 seconds apart
        var rand = Math.round(Math.random() * (13000)) + 7000;

        setTimeout(etherTimer, rand);
        loadSlenderEtherMessages();

    }
    etherTimer()
}


// Give a location, get the proper labels and create the HTML for the button
function getLocationButton(location) {
		
		slenderDB.child('locations').child(location).once('value', function (snap) {

			location = snap.key()

			kill = snap.val().die
			direction = snap.val().direction
			label = snap.val().label			

			buttonCode = '<button onclick="javascript:displaySlenderChoices(\'' + location + '\',\'' + kill + '\')" type="button" class="btn-lg btn-danger scaryButton">Go ' + direction + ' ' + label + '</button> '

			$('#choiceButtons').append(buttonCode)			
		})

}


// Each location has several descriptions. We select one at random.
function getRandomDescription(descriptions) {
	d = descriptions
	var i = 1;
	
	var rand = Math.floor(Math.random() * d.length);
	if (rand == 0) { rand = 1 }
	
	for (i = 1; i < d.length; ++i) {
		if (i == rand) {
			return d[i]
		}
	}
}


function flashSlenderFace() {
	
	// 40% of the time, we can display a scary face in the lower right hand corner
	var rand = Math.floor(Math.random() * 100);

	if (rand > 60) {
	    $('#slenderFader').hide()
	    $('#slenderFader').html('<img src="/faces/evilface.png"/>');
	    $('#slenderFader').fadeIn(100);
	    $('#slenderFader').fadeOut(100);		
	}

}