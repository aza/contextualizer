var request = require('request'),
	  fs = (require('foursquarevenues')('NAR1HTODQA0XJQGYXJQGI1TCPNGKOVMH0L2C0PZT0KOFZOZR', 'CAFBCKWMEZS1OEO0LYJOIHWEF15XBZP3P1V00AIUQXXFIEQQ')),
	  _ = require('underscore'),
	  moment = require('moment')


function sortByMagic( venues ){



	// Sort by # of checkins, but if there are more than 500 checkins or more, we don't care.
	// But weight further things worse
	return _(venues).sortBy( function(venue){ return -(Math.min(venue.stats.checkinsCount, 1000)-venue.location.distance) })
}

function onlyVenuesOpenLate( venues, callback ){
	var openLateVenues = []

	var leftToCount = venues.length
	_(venues).each(function(venue){
		fs.getHours({venue_id: venue.id}, function(error, json){
			venue.hours = json.response.hours
			if( venue.hours.timeframes ){
				var timeframe = venue.hours.timeframes[0]
				var closeTime = parseInt(timeframe.open[0].end)
				if( closeTime > 2100 || closeTime < 0700 ){
					openLateVenues.push( venue )
				}
			} else {
				openLateVenues.push( venue )
			}
			
			if( --leftToCount == 0 ){ callback(openLateVenues) }
		})
	})
}



function getBarsByLocation(lat, lng, callback){
	var params = {ll: lat+','+lng, categoryId:'4d4b7105d754a06376d81259,5032792091d4c4b30a586d5c,4bf58dd8d48988d1e5931735', radius: 100, time:"2100", limit: 5}
	// 4d4b7105d754a06376d81259 is a "Nightlife Spot". See https://developer.foursquare.com/categorytree
	// 5032792091d4c4b30a586d5c is Concert Hall
	// 4bf58dd8d48988d1e5931735 is music venue (Jazz club/piano bar/rock club)


	fs.getVenues(params, function(error, json){
		if( error ){ console.log( "ERROR", error); return }

		var venues = json.response.venues

		onlyVenuesOpenLate( venues, function(venues){
			venues = sortByMagic( venues )
			callback( venues )
		})
	})
}


function getBarByLocation(lat, lng, callback){
	getBarsByLocation( lat, lng, function(venues){
		if( venues.length > 0 ) callback(venues[0])
		else callback( null )
	})
}

function createContext(mo, callback){
	var startHour = moment(mo.moment.start_time).hour()

	if( (startHour >= 17 || startHour <= 4) && mo.moment.context.main_location ){
		var location = mo.moment.context.main_location
		getBarByLocation( location.lat, location.lon, function(bar){
			if( bar ){

				var context = {
					content: {
						title: bar.name,
						verb: 'Drank at',
						// Todo: replace this with an image of the bar
						image_url: 'http://pigpartsandbeer.com/wp-content/uploads/2013/07/beer-flight.jpg-.jpg'						
					},
					meta:{
						venue: bar
					},
					author: 'Jawbone',
					name: 'Bar Tagger',
					version: '0.1'
				}

				callback( context )

			}
		})
	} else {
		callback( null )
	}

}


exports.getBarsByLocation = getBarsByLocation
exports.getBarByLocation  = getBarByLocation
exports.createContext = createContext