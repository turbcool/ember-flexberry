import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Defaul style of modal context.

    @property readonly
    @type String
    @default #example
  */
  _style:'#example',

  modaldialog: false,

  actions: {
    modalWindow(style) {
      if (!Ember.isNone(style)) {
        this.set('_style', style);
      }

      let repeatWindow = Ember.$('#repeat-window').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
        context: this.get('_style'),
      });
      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('show').modal('refresh');
    },

    modalWindowDouble(style) {
      this.set('modaldialog', !this.get('modaldialog'));
    },

    logOut() {
      this.get('repeatWindow').modal('hide');
    },

    logOutDouble() {
      this.get('repeatWindowdouble').modal('hide');
    }

  }
});