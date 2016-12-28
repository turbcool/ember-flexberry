import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

export default function executeTest(testName, callback) {
  let app;
  let store;
  let latestReceivedRecords;

  module('Acceptance | flexberry-objectlistview |' + testName, {
    beforeEach() {
      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
      store = app.__container__.lookup('service:store');
      let originalQueryMethod = store.query;
      store.query = function(...args) {

        // Call original method & remember returned records.
        return originalQueryMethod.apply(this, args).then((records) => {
          latestReceivedRecords = records.toArray();
          return records;
        });
      };
    },

    afterEach() {
      Ember.run(app, 'destroy');
    }
  });

  test(testName, (assert) => callback(store, assert, app));
}
