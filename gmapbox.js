/*
 * TODO: no minzoom on obj?
 */

Drupal.gmap.addHandler('gmap',function(elem) {
  var obj = this;
  obj.bind("bootstrap_options", function() {
    var opts = obj.opts;
    var vars = obj.vars;
    var layers = obj.vars.baselayers;
    var maps = Drupal.settings.gmapbox;
    // Copyright info
    var copyright = new GCopyright(1,
      new GLatLngBounds(new GLatLng(-90,-180),new GLatLng(90,180) ),
      0, "<a href='http://mapbox.com'><img src='mapbox.png'></a>");
    var copyrightCollection = new GCopyrightCollection();
    copyrightCollection.addCopyright(copyright);
    // Use .each to avoid scope issues in CustomTilesUrl
    $.each(layers, function(k, val) {    
      var name = k.replace(/-/gi,' ');
      if (k in maps) {
        CustomTilesUrl= function(a,b){
          // Y coordinate is flipped in Mapbox, compared to Google
          a.y = Math.abs(a.y - (Math.pow(2,b) - 1));
          return "http://a.tile.mapbox.com/1.0.0/" + k +"/"+b+"/"+a.x+"/"+a.y+".png";
        }
        // Used when instantiating GMapType, points where to grab tiles
        var tilelayers = [new GTileLayer(copyrightCollection,0,vars.maxzoom)];
        tilelayers[0].getTileUrl = CustomTilesUrl;

        // Default options for the new map type.
        var GMapTypeOptions = new Object();
        GMapTypeOptions.minResolution = 0;
        GMapTypeOptions.maxResolution = vars.maxzoom;

        // Create the custom map type and add it to the map.
        var custommap = new GMapType(tilelayers, new GMercatorProjection(vars.maxzoom + 1), name, GMapTypeOptions);
        opts.mapTypes.push(custommap);
        opts.mapTypeNames.push(k); 
      }
    });
  });
});