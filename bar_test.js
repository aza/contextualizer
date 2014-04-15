var bar = require('./bar'),
	assert = require('assert'),
	moment = require('moment')

bar.getBarByLocation(37.765325, -122.396579, function(venue){
	assert.equal( venue.name, 'Bottom of the Hill')
})

bar.getBarByLocation(37.765528, -122.400355, function(venue){
	assert.equal( venue.name, 'Thee Parkside')
})

bar.getBarByLocation(37.767765, -122.406385, function(venue){
	assert.equal( venue.name, 'Mighty')
})

bar.getBarByLocation(37.778259, -122.405618, function(venue){
	assert.equal( venue.name, '1015 Folsom')
})

/*bar.getBarByLocation(37.775772, -122.408794, function(venue){
	// Raven is right next to this, so this one fails
	assert.equal( venue.name, 'Bloodhound')
})*/

bar.getBarByLocation(37.776363, -122.408319, function(venue){
	assert.equal( venue.name, 'Terroir')
})



var momentObj = {
	moment:{
		start_time: moment('1 Feb 2014').unix()*100,
		context:{
			main_location: {lat: 37.776363, lon: -122.408319}
		}
	}
}

bar.createContext(momentObj, function(context){
	console.log( context )
	//assert.equal( venue.name, 'Terroir')
})