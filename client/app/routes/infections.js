import Ember from "ember";
import ResetScrollMixin from '../mixins/reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  errorHandler: Ember.inject.service(),

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model(params) {
    var page = params.page || 1;
    var lastCount = page * 10;

    page = Number(page);
    if (page < 1) {
      this.get('toast').error(page + ' is not a valid page!');
      return {infections: [], nextPage: null, previousPage: null};
    }

    return this.get('ajax').request('/status/infections').then(function (result) {
      return {
        infections: result.infections.map(function (inf) {
          return {human: inf.human.name, zombie: inf.zombie.name, time: new Date(inf.time)};
        }),

        nextPage: lastCount < result.total ? (page + 1) : null,
        previousPage: page > 1 ? (page - 1) : null
      };
    }).catch((err) => {
      this.get('errorHandler').handleError(err, 'Unable to retrieve list of infections.');
      return {infections: []};
    });
  }
});
