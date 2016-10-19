import Ember from 'ember';

import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('flexberry-textarea', 'Integration | Component | flexberry-textarea', {
  integration: true,

  beforeEach: function () {
    this.register('locale:ru/translations', I18nRuLocale);
    this.register('locale:en/translations', I18nEnLocale);
    this.register('service:i18n', I18nService);

    this.inject.service('i18n', { as: 'i18n' });
    Ember.Component.reopen({
      i18n: Ember.inject.service('i18n')
    });

    // Set 'ru' as initial locale.
    this.set('i18n.locale', 'ru');
  }
});

test('it renders properly', function(assert) {
  assert.expect(10);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
  }}`);

  // Retrieve component.
  let $component = this.$().children();

  // Check wrapper <div>.
  assert.strictEqual($component.prop('tagName'), 'DIV', 'Component\'s wrapper is a <div>');
  assert.strictEqual($component.hasClass('flexberry-textarea'), true, 'Component\'s wrapper has \' flexberry-textarea\' css-class');
  assert.strictEqual($component.hasClass('ui'), true, 'Component\'s wrapper has \'ui\' css-class');
  assert.strictEqual($component.hasClass('input'), true, 'Component\'s wrapper has \'input\' css-class');

  // Check wrapper's additional CSS-classes.
  let additioanlCssClasses = 'fluid mini huge';
  this.set('class', additioanlCssClasses);
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    true,
    'Component\'s wrapper has additional css class \'' + cssClassName + '\'');
  });

  // Clean up wrapper's additional CSS-classes.
  this.set('class', '');
  Ember.A(additioanlCssClasses.split(' ')).forEach((cssClassName, index) => {
    assert.strictEqual(
    $component.hasClass(cssClassName),
    false,
    'Component\'s wrapper hasn\'t additional css class \'' + cssClassName + '\'');
  });
});

test('readonly mode works properly', function(assert) {
  assert.expect(3);

  // Render component.
  this.render(hbs`{{flexberry-textarea
    class=class
    readonly=readonly
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check that <textarea>'s readonly attribute doesn't exist yet.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('readonly')),
    '',
    'Component\'s inner <textarea> hasn\'t readonly attribute');

  // Activate readonly mode & check that <textarea>'s readonly attribute exists now & has value equals to 'readonly'.
  this.set('readonly', true);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('readonly')),
    'readonly',
    'Component\'s inner <textarea> has readonly attribute with value equals to \'readonly\'');

  // Check that <textarea>'s readonly attribute doesn't exist now.
  this.set('readonly', false);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('readonly')),
    '',
    'Component\'s inner <textarea> hasn\'t readonly attribute');
});

test('readonly mode works properly with value', function(assert) {
  assert.expect(2);

  // Set <textarea>'s value' & render component.
  this.set('value', null);
  this.set('readonly', true);
  this.render(hbs`{{flexberry-textarea
    readonly=readonly
    value=value
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  $textareaInput.on('change', (e) => {
    if (this.get('readonly')) {
      e.stopPropagation();
      $textareaInput.val(null);
    }
  });

  let newValue = 'New value';
  $textareaInput.val(newValue);
  $textareaInput.change();

  // Check <textarea>'s value not chenged.
  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    '',
    'Component\'s inner <textarea>\'s value not chenged');
  assert.strictEqual(
    this.get('value'),
    null,
    'Component\'s property binded to unchanged \'value\'');
});

test('it renders i18n-ed placeholder', function(assert) {
  assert.expect(2);

  // Render component.
  this.render(hbs`{{flexberry-textarea}}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s placeholder.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    Ember.get(I18nRuLocale, 'components.flexberry-textarea.placeholder'),
    'Component\'s inner <textarea>\'s placeholder is equals to it\'s default value from i18n locales/ru/translations');

  // Change current locale to 'en' & check <textarea>'s placeholder again.
  this.set('i18n.locale', 'en');
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    Ember.get(I18nEnLocale, 'components.flexberry-textarea.placeholder'),
    'Component\'s inner <textarea>\'s placeholder is equals to it\'s value from i18n locales/en/translations');
});

test('it renders manually defined placeholder', function(assert) {
  assert.expect(2);

  // Set <textarea>'s placeholder' & render component.
  let placeholder = 'textarea is empty, please type some text';
  this.set('placeholder', placeholder);
  this.render(hbs`{{flexberry-textarea
    placeholder=placeholder
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s placeholder.
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    placeholder,
    'Component\'s inner <textarea>\'s placeholder is equals to manually defined value \'' + placeholder + '\'');

  // Change placeholder's value & check <textarea>'s placeholder again.
  placeholder = 'textarea has no value';
  this.set('placeholder', placeholder);
  assert.strictEqual(
    Ember.$.trim($textareaInput.attr('placeholder')),
    placeholder,
    'Component\'s inner <textarea>\'s placeholder is equals to manually updated value \'' + placeholder + '\'');
});

test('changes in inner <textarea> causes changes in property binded to \'value\'', function(assert) {
  assert.expect(4);

  // Set <textarea>'s value' & render component.
  this.set('value', null);
  this.render(hbs`{{flexberry-textarea
    value=value
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s value & binded value for initial emptyness.
  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    '',
    'Component\'s inner <textarea>\'s value is equals to \'\'');
  assert.strictEqual(
    this.get('value'),
    null,
    'Component\'s property binded to \'value\' is equals to null');

  // Change <textarea>'s value (imitate situation when user typed something into component's <textarea>)
  // & check them again ('change' event is needed to force bindings work).
  let newValue = 'Some text typed into textboxes inner <textarea>';
  $textareaInput.val(newValue);
  $textareaInput.change();

  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    newValue,
    'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
  assert.strictEqual(
    this.get('value'),
    newValue,
    'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
});

test('changes in property binded to \'value\' causes changes in inner <textarea>', function(assert) {
  assert.expect(4);

  // Set <textarea>'s value' & render component.
  this.set('value', null);
  this.render(hbs`{{flexberry-textarea
    value=value
  }}`);

  // Retrieve component.
  let $component = this.$().children();
  let $textareaInput = $component.children('textarea');

  // Check <textarea>'s value & binded value for initial emptyness.
  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    '',
    'Component\'s inner <textarea>\'s value is equals to \'\'');
  assert.strictEqual(
    this.get('value'),
    null,
    'Component\'s property binded to \'value\' is equals to null');

  // Change property binded to 'value' & check them again.
  let newValue = 'Some text typed into textboxes inner <textarea>';
  this.set('value', newValue);

  assert.strictEqual(
    Ember.$.trim($textareaInput.val()),
    newValue,
    'Component\'s inner <textarea>\'s value is equals to \'' + newValue + '\'');
  assert.strictEqual(
    this.get('value'),
    newValue,
    'Component\'s property binded to \'value\' is equals to \'' + newValue + '\'');
});
