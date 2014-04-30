//Google Maps APIv3
//Created by Alexander Karlsson - akl@qlikview.com - QlikTech Nordic AB
//Tested on QV11
//
//QlikTech takes no responsbility for any code.
//Use at your own risk.
//Do not submerge in water.
//Do not taunt Happy Fun Ball.

function map_init() {
	Qva.AddExtension("GoogleMaps - Marker", function() {

		var _this = this,
			divName = _this.Layout.ObjectId.replace("\\", "_"),
			popupLabels = _this.Layout.Text0.text,
			infoList = [],
			reg = /\.(gif|jpg|jpeg|tiff|png|bmp)$/,
			rowreg = _this.Data.Rows[0];

		if (_this.Element.children.length == 0) {
			var ui = document.createElement("div");
			ui.setAttribute("id", divName);
			_this.Element.appendChild(ui);
			$("#" + divName).css("height", _this.GetHeight() + "px").css("width", _this.GetWidth() + "px");
		} else {
			$("#" + divName).css("height", _this.GetHeight() + "px").css("width", _this.GetWidth() + "px");
			$("#" + divName).empty();
		};

		var latlngbounds = new google.maps.LatLngBounds();
		var map = new google.maps.Map(document.getElementById(divName), {
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		if (reg.test(rowreg[3].text)) {
			for (var i = 0, k = _this.Data.Rows.length; i < k; i++) {
				var row = _this.Data.Rows[i];
				var val = parseFloat(row[0].text);
				var val2 = parseFloat(row[1].text);
				if (val != NaN && val != '' && val <= 90 && val >= -90 && val2 != NaN && val2 != '' && val2 <= 180 && val >= -180) {
					var latLng = new google.maps.LatLng(row[0].text, row[1].text);
					var marker = new google.maps.Marker({
						position: latLng,
						title: row[2].text,
						map: map,
						icon: row[3].text
					});

					if (popupLabels === 1) {

						marker.infoWindow = new google.maps.InfoWindow({
							content: row[2].text
						});

						google.maps.event.addListener(marker, 'mouseover', function() {
							infoList.push(this);
							this.infoWindow.open(map, this);
						});

						google.maps.event.addListener(marker, 'mouseout', function() {
							infoList.push(this);
							this.infoWindow.close();
						});
					};

				};
				latlngbounds.extend(latLng);
				google.maps.event.addListener(marker, 'click', (function(lat, lng) {
					return function() {
						_this.Data.SelectTextsInColumn(0,true, lat);
						_this.Data.SelectTextsInColumn(1,true, lng)
					}
				})(row[0].text, row[1].text));
			};
		} else {
			for (var i = 0, k = _this.Data.Rows.length; i < k; i++) {
				var row = _this.Data.Rows[i];
				var val = parseFloat(row[0].text);
				var val2 = parseFloat(row[1].text);
				if (val != NaN && val != '' && val <= 90 && val >= -90 && val2 != NaN && val2 != '' && val2 <= 180 && val >= -180) {
					var latLng = new google.maps.LatLng(row[0].text, row[1].text);
					var marker = new google.maps.Marker({
						position: latLng,
						title: row[2].text,
						map: map
					});

					if (popupLabels === 1) {

						marker.infoWindow = new google.maps.InfoWindow({
							content: row[2].text
						});

						google.maps.event.addListener(marker, 'mouseover', function() {
							infoList.push(this);
							this.infoWindow.open(map, this);
						});

						google.maps.event.addListener(marker, 'mouseout', function() {
							infoList.push(this);
							this.infoWindow.close();
						});
					};

					latlngbounds.extend(latLng);
					google.maps.event.addListener(marker, 'click', (function(lat, lng) {
						return function() {
							_this.Data.SelectTextsInColumn(0,true, lat);
							_this.Data.SelectTextsInColumn(1,true, lng)
						}
					})(row[0].text, row[1].text));
				};
			};
		};

		map.setCenter(latlngbounds.getCenter());
		map.fitBounds(latlngbounds);

	});
};

/* load external libs - callback map_init() */
loadLibs();

function loadLibs() {
	Qva.LoadScript('https://maps.google.com/maps/api/js?sensor=false&callback=map_init')
};