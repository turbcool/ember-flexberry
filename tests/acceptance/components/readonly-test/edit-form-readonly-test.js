/* global $ */
import { run, scheduleOnce } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';

let app;
const path = 'components-acceptance-tests/edit-form-readonly';

module('Acceptance | edit-form | readonly-mode ', {
    beforeEach() {

      // Start application.
      app = startApp();

      // Enable acceptance test mode in application controller (to hide unnecessary markup from application.hbs).
      let applicationController = app.__container__.lookup('controller:application');
      applicationController.set('isInAcceptanceTestMode', true);
    },

    afterEach() {
      run(app, 'destroy');
    }
  });

test('controller is render properly', (assert) => {
  assert.expect(3);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    assert.equal(currentPath(), path, 'Path for edit-form-readonly-test is correctly');
    assert.strictEqual(controller.get('readonly'), true, 'Controller\'s flag \'readonly\' is enabled');

    controller.set('readonly', false);
    assert.strictEqual(controller.get('readonly'), false, 'Controller\'s flag \'readonly\' is disabled');
  });
});

test('flexbery-checkbox on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $checkbox = $('.not-in-groupedit .flexberry-checkbox');
    assert.strictEqual($checkbox.hasClass('read-only'), true, 'Checkbox is readonly');

    let $checkboxFge = $('.in-groupedit .flexberry-checkbox');
    assert.strictEqual($checkboxFge.hasClass('read-only'), true, 'Groupedit\'s checkbox is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($checkbox.hasClass('read-only'), false, 'Checkbox don\'t readonly');
      assert.strictEqual($checkboxFge.hasClass('read-only'), false, 'Groupedit\'s checkbox don\'t readonly');
    });
  });
});

test('flexbery-textbox on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $textbox = $('.not-in-groupedit .flexberry-textbox');
    let $textboxInput = $textbox.children('input');
    assert.strictEqual($.trim($textboxInput.attr('readonly')), 'readonly', 'Textbox is readonly');

    let $textboxFge = $('.in-groupedit .flexberry-textbox');
    let $textboxFgeInput = $textboxFge.children('input');
    assert.strictEqual($.trim($textboxFgeInput.attr('readonly')), 'readonly', 'Groupedit\'s textbox is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($textbox.is('readonly'), false, 'Textbox don\'t readonly');
      assert.strictEqual($textboxFge.is('readonly'), false, 'Groupedit\'s textbox don\'t readonly');
    });
  });
});

test('flexberry-textarea on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $textarea = $('.not-in-groupedit .flexberry-textarea');
    let $textareaInput = $textarea.children('textarea');
    assert.strictEqual($.trim($textareaInput.attr('readonly')), 'readonly', 'Textarea is readonly');

    let $textareaFGE = $('.in-groupedit .flexberry-textarea');
    let $textareaInputFGE = $textareaFGE.children('textarea');
    assert.strictEqual($.trim($textareaInputFGE.attr('readonly')), 'readonly', 'Groupedit\'s textarea is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($.trim($textareaInput.attr('readonly')), '', 'Textarea don\'t readonly');
      assert.strictEqual($.trim($textareaInputFGE.attr('readonly')), '', 'Groupedit\'s textarea don\'t readonly');
    });
  });
});

test('flexberry-datepicker on readonly editform', (assert) => {
  assert.expect(8);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $datepicker = $('.not-in-groupedit .flexberry-datepicker');
    let $datepickerInput = $datepicker.children('input');
    assert.strictEqual($.trim($datepickerInput.attr('readonly')), 'readonly', 'Time is readonly');
    let $button = $datepicker.children('.calendar');
    assert.strictEqual($button.hasClass('link'), false, 'Datepicker hasn\'t link');

    let $datepickerFge = $('.in-groupedit .flexberry-datepicker');
    let $datepickerFgeInput = $datepickerFge.children('input');
    assert.strictEqual($.trim($datepickerFgeInput.attr('readonly')), 'readonly', 'Groupedit\'s datepicker is readonly');
    let $buttonFge = $datepickerFge.children('.calendar');
    assert.strictEqual($buttonFge.hasClass('link'), false, 'Groupedit\'s datepicker hasn\'t link');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($.trim($datepickerInput.attr('readonly')), '', 'Time don\'t readonly');
      assert.strictEqual($button.hasClass('link'), true, 'Datepicker has link');

      assert.strictEqual($.trim($datepickerFgeInput.attr('readonly')), '', 'Groupedit\'s datepicker don\'t readonly');
      assert.strictEqual($buttonFge.hasClass('link'), true, 'Groupedit\'s datepicker has link');
    });
  });
});

test('flexberry-simpledatetime on readonly editform', (assert) => {
  assert.expect(2);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $simpledatetime = $('.not-in-groupedit .flexberry-simpledatetime .custom-flatpickr');

    assert.strictEqual($.trim($simpledatetime.attr('readonly')), 'readonly', 'Time is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($.trim($simpledatetime.attr('readonly')), '', 'Time don\'t readonly');
    });
  });
});

test('flexberry-dropdown on readonly editform', (assert) => {
  assert.expect(4);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $dropdown = $('.not-in-groupedit .flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('disabled'), true, 'Dropdown is readonly');

    let $dropdownFge = $('.in-groupedit .flexberry-dropdown');
    assert.strictEqual($dropdownFge.hasClass('disabled'), true, 'Groupedit\'s dropdown is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($dropdown.hasClass('disabled'), false, 'Dropdown don\'t readonly');
      assert.strictEqual($dropdownFge.hasClass('disabled'), false, 'Groupedit\'s dropdown don\'t readonly');
    });
  });
});

test('flexberry-file on readonly edit form', (assert) => {
  assert.expect(14);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $file = $('.not-in-groupedit input.flexberry-file-filename-input');
    assert.strictEqual($.trim($file.attr('readonly')), 'readonly', 'Flexberry-file is readonly');
    let $downloadButton = $('.not-in-groupedit label.flexberry-file-download-button');
    assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file\'s button \'Download\' is readonly');

    let $fileFge = $('.in-groupedit input.flexberry-file-filename-input');
    assert.strictEqual($.trim($fileFge.attr('readonly')), 'readonly', 'Groupedit\'s flexberry-file is readonly');
    let $downloadButtonFge = $('.in-groupedit label.flexberry-file-download-button');
    assert.strictEqual($downloadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file\'s button \'Download\' is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($file.is('readonly'), false, 'Flexberry-file don\'t readonly');
      let $addButton = $('.not-in-groupedit label.flexberry-file-add-button');
      assert.strictEqual($addButton.hasClass('disabled'), false, 'Flexberry-file\'s button \'Add\' don\'t readonly');
      let $removeButton = $('.not-in-groupedit label.flexberry-file-remove-button');
      assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-file has button \'Remove\'');
      let $uploadButton = $('.not-in-groupedit label.flexberry-file-upload-button');
      assert.strictEqual($uploadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Upload\'');
      assert.strictEqual($downloadButton.hasClass('disabled'), true, 'Flexberry-file has button \'Download\'');

      assert.strictEqual($fileFge.is('readonly'), false, 'Groupedit\'s flexberry-file don\'t readonly');
      let $addButtonFge = $('.in-groupedit label.flexberry-file-add-button');
      assert.strictEqual($addButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-file\'s button \'Add\' don\'t readonly');
      let $removeButtonFge = $('.in-groupedit label.flexberry-file-remove-button');
      assert.strictEqual($removeButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Remove\'');
      let $uploadButtonFge = $('.in-groupedit label.flexberry-file-upload-button');
      assert.strictEqual($uploadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Upload\'');
      assert.strictEqual($downloadButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-file has button \'Download\'');

    });
  });
});

test('flexberry-lookup on readonly edit form', (assert) => {
  assert.expect(12);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $lookup = $('.not-in-groupedit input.lookup-field');
    assert.strictEqual($.trim($lookup.attr('readonly')), 'readonly', 'Lookup is readonly');
    let $chooseButton = $('.not-in-groupedit button.ui-change');
    assert.strictEqual($chooseButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Choose\' is readonly');
    let $removeButton = $('.not-in-groupedit button.ui-clear');
    assert.strictEqual($removeButton.hasClass('disabled'), true, 'Flexberry-lookup\'s button \'Remove\' is readonly');

    let $lookupFge = $('.in-groupedit input.lookup-field');
    assert.strictEqual($.trim($lookupFge.attr('readonly')), 'readonly', 'Groupedit\'s lookup is readonly');
    let $chooseButtonFge = $('.in-groupedit button.ui-change');
    assert.strictEqual($chooseButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' is readonly');
    let $removeButtonFge = $('.in-groupedit button.ui-clear');
    assert.strictEqual($removeButtonFge.hasClass('disabled'), true, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($lookup.is('readonly'), false, 'Lookup don\'t readonly');
      assert.strictEqual($chooseButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Choose\' don\'t readonly');
      assert.strictEqual($removeButton.hasClass('disabled'), false, 'Flexberry-lookup\'s button \'Remove\' don\'t readonly');

      assert.strictEqual($lookupFge.is('readonly'), false, 'Groupedit\'s lookup don\'t readonly');
      assert.strictEqual($chooseButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Choose\' don\'t readonly');
      assert.strictEqual($removeButtonFge.hasClass('disabled'), false, 'Groupedit\'s flexberry-lookup\'s button \'Remove\' don\'t readonly');
    });
  });
});

test('flexberry-lookup as dropdown on readonly edit form', (assert) => {
  assert.expect(2);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $dropdownAsLookup = $('.not-in-groupedit .flexberry-lookup');
    let $dropdown = $($dropdownAsLookup[1]).children('.flexberry-dropdown');
    assert.strictEqual($dropdown.hasClass('disabled'), true, 'Lookup as dropdown is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($dropdown.hasClass('disabled'), false, 'Lookup as dropdown don\'t readonly');
    });
  });
});

test('flexberry-groupedit on readonly edit form', (assert) => {
  assert.expect(2);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $groupedit = $('.in-groupedit table');
    assert.strictEqual($groupedit.hasClass('readonly'), true, 'Groupedit is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($groupedit.hasClass('readonly'), false, 'Groupedit don\'t readonly');
    });
  });
});

test('flexberry-groupedit\'s button on readonly edit form', (assert) => {
  assert.expect(12);

  visit(path);
  andThen(() => {
    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let $addButton = $('.in-groupedit .ui-add');
    assert.strictEqual($.trim($addButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Add\' is readonly');

    let $removeButton = $('.in-groupedit .ui-delete');
    assert.strictEqual($.trim($removeButton.attr('disabled')), 'disabled', 'Flexberry-groupedit\'s button \'Remove\' is readonly');

    let $checkbox = $('.in-groupedit .flexberry-checkbox');
    assert.strictEqual($checkbox.hasClass('read-only'), true, 'Flexberry-groupedit\'s checkbox helper is readonly');

    let $removeButtonRow = $('.in-groupedit .object-list-view-row-delete-button');
    assert.strictEqual($removeButtonRow.hasClass('disabled'), true, 'Flexberry-groupedit\'s button \'Remove in row\' is readonly');

    let $itemEditMenu = $('.in-groupedit .edit-menu');
    assert.strictEqual($itemEditMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Edit\' in left menu is readonly');
    let $itemDeleteMenu = $('.in-groupedit .delete-menu');
    assert.strictEqual($itemDeleteMenu.hasClass('disabled'), true, 'Flexberry-groupedit\'s item \'Delete\' in left menu is readonly');

    controller.set('readonly', false);
    scheduleOnce('afterRender', () => {
      assert.strictEqual($addButton.is('disabled'), false, 'Flexberry-groupedit\'s button \'Add\' don\'t readonly');
      assert.strictEqual($removeButton.is('disabled'), false, 'Flexberry-groupedit\'s button \'Remove\' don\'t readonly');
      assert.strictEqual($checkbox.hasClass('read-only'), false, 'Flexberry-groupedit\'s checkbox helper don\'t readonly');
      assert.strictEqual($removeButtonRow.hasClass('disabled'), false, 'Flexberry-groupedit\'s button \'Remove in row\' don\'t readonly');
      assert.strictEqual($itemEditMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Edit\' in left menu don\'t readonly');
      assert.strictEqual($itemDeleteMenu.hasClass('disabled'), false, 'Flexberry-groupedit\'s item \'Delete\' in left menu don\'t readonly');
    });
  });
});
