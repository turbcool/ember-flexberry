/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import PredicateFromFiltersMixin from '../mixins/predicate-from-filters';
import deserializeSortingParam from '../utils/deserialize-sorting-param';

/**
  Mixin for edit-form-controller for ObjectListView support.

  @class FlexberryObjectlistviewOnEditFormControllerMixin
  @extends Ember.Mixin
  @uses PredicateFromFiltersMixin
  @public
*/
export default Ember.Mixin.create(PredicateFromFiltersMixin, {
  /**
    Name of related to FOLV edit form route.

    @property folvEditFormRoute
    @type String
    @default undefined
   */
  folvEditFormRoute: undefined,

  /**
    Name of FOLV model.

    @property folvModelName
    @type String
    @default undefined
   */
  folvModelName: undefined,

  /**
    Name of FOLV projection.

    @property folvProjection
    @type String
    @default undefined
   */
  folvProjection: undefined,

  /**
    Result predicate with all restrictions for olv.

    @property resultPredicate
    @type BasePredicate
    @default null
   */
  resultPredicate: null,

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: Ember.inject.service(),

  /**
    Total count of FOLV records.

    @property recordsTotalCount
    @type Number
    @readOnly
  */
  recordsTotalCount: Ember.on('init', Ember.computed('customFolvContent', function() {
    let customFolvContent = this.get('customFolvContent');
    if (customFolvContent) {
      if (customFolvContent instanceof Ember.RSVP.Promise) {
        customFolvContent.then((records) => {
          this.set('recordsTotalCount', records.meta.count);
        }, this);
      } else {
        return customFolvContent.meta.count;
      }
    }
  })),

  /**
    Content of FOLV on this edit form.

    @property customFolvContent
    @type Promise
    @readOnly
  */
  customFolvContentObserver: Ember.observer('model', 'perPage', 'page', 'sorting', 'filter', 'filters', function() {
    let _this = this;

    Ember.run(function() {
      Ember.run.once(_this, 'getCustomContent');
    });
  }),

  getCustomContent() {
    let _this = this;
    let folvModelName = this.get('folvModelName');
    let folvProjection = this.get('folvProjection');
    let filtersPredicate = this._filtersPredicate();
    let perPage = this.get('perPage');
    let page = this.get('page');
    let sorting = this.get('sorting');
    let filter = this.get('filter');
    let filterCondition = this.get('filterCondition');
    let hierarchicalAttribute;
    if (this.get('inHierarchicalMode')) {
      hierarchicalAttribute = this.get('hierarchicalAttribute');
    }

    let params = {};
    params.perPage = perPage;
    params.page = page;
    params.sorting = sorting;
    params.filter = filter;
    params.filterCondition = filterCondition;
    let limitPredicate =
      this.objectListViewLimitPredicate({ modelName: folvModelName, projectionName: folvProjection, params: params });
    if (folvModelName && folvProjection) {
      let queryParameters = {
        modelName: folvModelName,
        projectionName: folvProjection,
        perPage: perPage,
        page: page,
        sorting: sorting,
        filter: filter,
        filterCondition: filterCondition,
        filters: filtersPredicate,
        predicate: limitPredicate,
        hierarchicalAttribute: hierarchicalAttribute,
      };
      return this.reloadList(queryParameters)
      .then(records => {
        _this.set('customFolvContent', records);
      })
      .catch(reason => {
        _this.send('handleError', reason);
      })
      .finally(() => {
        this.get('appState').reset();
      });
    }

    _this.set('customFolvContent', undefined);
  },

  customFolvContent: undefined,

  sort: undefined,

  sorting: [],

  sortObserver: Ember.on('init', Ember.observer('sort', function() {
    let sorting = this.get('sort');

    if (sorting) {
      sorting = deserializeSortingParam(sorting);
    }

    this.set('sorting', sorting || []);
  })),

  /**
    Dictionary with sorting data related to properties.

    @property computedSorting
    @type Object
    @readOnly
  */
  computedSorting: Ember.computed('sorting', function() {
    let sorting = this.get('sorting');
    let result = {};

    if (sorting) {
      for (let i = 0; i < sorting.length; i++) {
        let propName = sorting[i].propName;
        let sortDef = {
          sortAscending: sorting[i].direction === 'asc' ? true : false,
          sortNumber: i + 1
        };
        result[propName] = sortDef;
      }
    }

    return result;
  }),

  /**
    It forms the limit predicate for FOLV loaded data on edit form.

    By default it returns `undefined`.
    In order to set specific limit predicate, this method have to be overriden on applied-specific controller.

  @method objectListViewLimitPredicate
  @public

  @param {Object} options Method options
  @param {String} [options.modelName] Type of records to load
  @param {String} [options.projectionName] Projection name to load data by
  @param {String} [options.params] Current route query parameters
  @return {BasePredicate} The predicate to limit loaded data
  */
  objectListViewLimitPredicate(options) {
    return undefined;
  },

  actions: {
    /**
      Set in `property` for `target` promise that load nested records.

      @method actions.loadRecordsById
      @param {String} id Record ID.
      @param {ObjectListViewRowComponent} Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} property Property name into {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
    */
    loadRecordsById(id, target, property) {
      let hierarchicalAttribute = this.get('hierarchicalAttribute');
      let modelName = this.get('folvModelName');
      let projectionName = this.get('folvProjection');
      let builder = new Query.Builder(this.store)
        .from(modelName)
        .selectByProjection(projectionName)
        .where(hierarchicalAttribute, 'eq', id);

      Ember.set(target, property, this.store.query(modelName, builder.build()));
    },

    beforeDeleteAllRecords(modelName, data) {
      data.cancel = true;
      Ember.assert(`Please specify 'beforeDeleteAllRecords' action for '${this.componentName}' list compoenent in corresponding controller`);
    },

    /**
      Switch hierarchical mode.

      @method actions.switchHierarchicalMode
    */
    switchHierarchicalMode() {
      this.toggleProperty('inHierarchicalMode');
      this.getCustomContent();
    },
  },
});
