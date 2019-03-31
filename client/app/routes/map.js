import Ember from 'ember';
import config from '../config/environment';
import ResetScrollMixin from '../mixins/reset-scroll';

var getLatLng = function (obj) {
  return new google.maps.LatLng(obj.latitude, obj.longitude);
};

var getLatLngArray = function (arr) {
  var result = [];
  arr.forEach(function (obj) {
    result.push(getLatLng(obj));
  });

  return result;
};

/* globals google */
export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        window.map_callback = () => {

          var mapOptions = {
            zoom: config.APP.map.zoom,
            center: getLatLng(config.APP.map.center),
            mapTypeId: google.maps.MapTypeId.SATELLITE
          };

          var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

          var bounds = new google.maps.Polygon({
            paths: getLatLngArray(config.APP.map.bounds),
            strokeColor: '#FFAA00',
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 0.08,
            clickable: false
          });

          bounds.setMap(map);

          this.get('ajax').request('/status/infections').then((results) => {
            var min = config.APP.map.viewBounds.min;
            var max = config.APP.map.viewBounds.max;

            var removeCount = 0;
            var locations = results.infections.filter((inf) => {
              if (!inf.hasLocation) {
                return false;
              }

              if(inf.latitude < min.latitude || inf.longitude < min.longitude ||
                  inf.latitude > max.latitude || inf.longitude > max.longitude) {
                ++removeCount;
                return false;
              }

              return true;
            }).map((inf) => {
              return {location: new google.maps.LatLng(inf.latitude, inf.longitude), weight: 1};
            });

            console.log("Removed " + removeCount + " locations as out of bounds");

            var heatmap = new google.maps.visualization.HeatmapLayer({data: locations});
            heatmap.setMap(map);

            Ember.$('#loading-message').remove();
          }).catch((err) => {
            this.get('errorHandler').handleError(err, 'Unable to retrieve infections.');
          });
        };

        Ember.$.getScript("//maps.google.com/maps/api/js?libraries=visualization&callback=map_callback&key=" + config.APP.map.key);
      });
    }
  }
});
