import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('hvz-badges', 'Integration | Component | hvz badges', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hvz-badges}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#hvz-badges}}
      template block text
    {{/hvz-badges}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
