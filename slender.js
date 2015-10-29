var slenderDB = new Firebase('https://runforyourlife.firebaseio.com/')

var currentLocation = "bedroom" // Where the player is located within/near the house

function startSlender() {
	displaySlenderChoices(currentLocation)
}

// Choices are based on which location a player is within.
// The can only choose among the presented choices
// But the location can have multiple different descriptions.
// Perhaps we simulate how they notice different things each time they enter a location.
function displaySlenderChoices(currentLocation) {

	slenderDB.child('locations').child(currentLocation).once('value', function (snap) {

		descriptions = snap.val().description		
		choices = snap.val().choices
		background = snap.val().image

		bgCSS = '#000 url(/locations/' + background + ') no-repeat'

		console.log("CSS: " + bgCSS)

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


// Give a location, get the proper labels and create the HTML for the button
function getLocationButton(location) {
		
		slenderDB.child('locations').child(location).once('value', function (snap) {

			location = snap.key()

			kill = snap.val().die
			direction = snap.val().direction
			label = snap.val().label

			buttonCode = '<button onclick="javascript:displaySlenderChoices(\'' + location + '\')" type="button" class="btn-lg btn-danger scaryButton">Go ' + direction + ' ' + label + '</button> '

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