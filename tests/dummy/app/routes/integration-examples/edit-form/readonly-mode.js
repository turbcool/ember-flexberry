import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'AggregatorE'
   */
  modelProjection: 'AggregatorE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'integration-examples/edit-form/readonly-mode/aggregator'
   */
  modelName: 'integration-examples/edit-form/readonly-mode/aggregator',

  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    let store = this.get('store');
    let aggregator = store.createRecord('integration-examples/edit-form/readonly-mode/aggregator', {});
    let detail = store.createRecord('integration-examples/edit-form/readonly-mode/detail', {});
    aggregator.get('details').pushObject(detail);

    return aggregator;
  },

  /**
  developerUserSettings.
  {
  <componentName>: {
    <settingName>: {
        colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
        sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
        colsWidths: [ <colName>:<colWidth>, ... ],
      },
      ...
    },
    ...
  }
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

  @property developerUserSettings
  @type Object
  @default {}
  */
  developerUserSettings: {
    aggregatorDetailsGroupedit: {
      'DEFAULT': {
        'columnWidths': [{ 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 65 }]
      }
    }
  },
});
