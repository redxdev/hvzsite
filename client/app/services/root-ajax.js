import AjaxService from 'ember-ajax/services/ajax';
import config from '../config/environment';

export default AjaxService.extend({
  namespace: '/',
  host: config.APP.apiURL
});
