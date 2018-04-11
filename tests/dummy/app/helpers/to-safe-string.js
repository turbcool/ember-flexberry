import Helper from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

/**
  Calls [Ember.String.htmlSafe] with the provided string.
  This is a convenient way to render JS variables values and HTML-tags.

  @method toSafeString
  @for Ember.Templates.helpers
  @param {*} value Value to be formatted as safe string.
  @see {Ember.String.htmlSafe}
  @public
*/
export default Helper.extend({
  compute: function ([value]) {
    return new htmlSafe(value);
  }
});
