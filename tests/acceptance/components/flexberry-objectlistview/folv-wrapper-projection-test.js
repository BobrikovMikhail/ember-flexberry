import Ember from 'ember';
import { executeTest } from './execute-folv-test';
import { checkSortingList, loadingLocales } from './folv-tests-functions';

executeTest('check wrapper and projection', (store, assert, app) => {
  assert.expect(6);
  let path = 'components-acceptance-tests/flexberry-objectlistview/base-operations';
  visit(path);
  andThen(function() {
    assert.equal(currentPath(), path);

    let controller = app.__container__.lookup('controller:' + currentRouteName());
    let projectionName = () => { return Ember.get(controller, 'modelProjection'); };

    let $olv = Ember.$('.object-list-view ');
    let $folvContainer = Ember.$('.object-list-view-container');
    let $tableInFolvContainer = Ember.$('table', $folvContainer);
    assert.equal($tableInFolvContainer.length, 1, 'folv table in container exist');

    let $tableBody = Ember.$('tbody', '.object-list-view-container');
    assert.equal($tableBody.length, 1, 'tbody in table exist');

    let dtHeadTable = Ember.$('.dt-head-left.me.class', 'thead', $tableInFolvContainer);

    let done = assert.async();
    checkSortingList(store, projectionName(), $olv, null).then((isTrue) => {
      assert.ok(isTrue, 'records are displayed correctly');
      done();
    });

    loadingLocales('en', app).then(() => {

      // Check projectionName.
      let attrs = projectionName().attributes;
      let flag = true;

      /* eslint-disable no-unused-vars */
      Object.keys(attrs).forEach((element, index, array) => {
        if (attrs[element].kind !== 'hasMany') {
          flag = flag && (Ember.$.trim(dtHeadTable[index].innerText) === attrs[element].caption);
        }
      });
      /* eslint-enable no-unused-vars */
      assert.ok(flag, 'projection = columns names');

      let newProjectionName = 'SettingLookupExampleView';
      controller.set('modelProjection', newProjectionName);

      // Ember.get(controller, 'modelProjection') returns only the name of the projection when it replaced.
      assert.equal(projectionName(), newProjectionName, 'projection name is changed');
    });

  });
});
