import AjaxService from 'ember-ajax/services/ajax';
import config from '../config/environment';

export default AjaxService.extend({
  namespace: '/api/v2',
  host: config.APP.apiURL
});
