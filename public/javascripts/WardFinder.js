$(document).ready(function()
{	

	document.getElementById("findWard").addEventListener("click", findWard);
	document.getElementById("gllpSearchButton").addEventListener("click", clearWardPoly);

});


var wardPoly;

// Deletes all markers in the array by removing references to them.
function clearWardPoly() {

	if(wardPoly)
	{
		wardPoly.setMap(null);
	}
}
			
function findWard()
{
	//Here we read in our KML file and convert it to geojson for use with turf.js
	//We do all the work in the callback to ensure the file is loaded.
		$.ajax('KML/UdaipurShapesAsKML.kml').done(function(xml) {
			var wards = toGeoJSON.kml(xml).features;

			var currentLat = parseFloat($("#gglLat").val());
			var currentLong = parseFloat($("#gglLong").val());
		
			var center = {lat: currentLat, lng: currentLong};

			//Set the point we want to test as a turf point
			var pt = turf.point([currentLong, currentLat]);

			var matchfound = false;


			
			//We want to run through all of the wards until we find the correct one
			wards.some(ward => {
				
				//Some of the areas have multiple shapes within them, so we
				//need to handle them seperately to wards with only one shape.
				if(ward.geometry.type == "GeometryCollection")
				{

				
				var currentWard = ward.geometry.geometries;

				//We know this ward has multiple polygons within it, so
				//we need to check all of them individually.
				currentWard.forEach(polygon => {

					var poly = turf.polygon([polygon.coordinates[0]]);

					

					//Here is where we do the test to see if the current point
					//is within the current polygon. If it is, then we return true and
					//stop the loop
					if(turf.booleanPointInPolygon(pt, poly))
					{
						updatemap(center, polygon.coordinates[0], ward);
						matchfound = true;
						return true;
					}

				});

				}//Here we know there is only one polygon.
				else if(ward.geometry.type == "Polygon")
				{				

					var currentWard = ward.geometry.coordinates[0];

					var poly = turf.polygon([currentWard]);

					//Do our test and then update the map and exist the loop if we find a match
					if(turf.booleanPointInPolygon(pt, poly))
					{
						updatemap(center, currentWard, ward);
						matchfound = true;
						return true;
					}

				}

			});

			if(!matchfound)
			{
				alert("Unable to find ward details.")
			}
		});


}

function updatemap(center, currentPolygon, ward)
{

	if(wardPoly)
	{
		wardPoly.setMap(null);
	}

	  $("#ward-id").val(ward.properties.id);
	  $("#ward-name").val(ward.properties.name);

	  var wardCoords=[];

	  currentPolygon.forEach(coord => {
		wardCoords.push(new google.maps.LatLng(coord[1],
			coord[0]));
	  });

	  wardPoly = new google.maps.Polygon({
		paths: wardCoords,
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.35
	  });

	   wardPoly.setMap(map);

	   $("#gllpZoom").val( map.getZoom() );
	   $("#gglLat").val( center.lat );
	   $("#gglLong").val( center.lng );
	
}