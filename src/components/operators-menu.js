import Cycle from 'cyclejs';
import Colors from 'rac-marbles/styles/colors';
import Dimens from 'rac-marbles/styles/dimens';
import Examples from 'rac-marbles/data/examples';
import Todo from 'rac-marbles/data/todo';
import {mergeStyles} from 'rac-marbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

/**
 * Returns a hashmap of category headers to lists of examples in that category.
 */
function organizeExamplesByCategory(examples) {
  let categoryMap = {};
  for (let key in examples) {
    if (!examples.hasOwnProperty(key)) continue;
    let value = examples[key];
    value.key = key;
    if (categoryMap.hasOwnProperty(value.category)) {
      categoryMap[value.category].push(value);
    } else {
      categoryMap[value.category] = [value];
    }
  }
  return categoryMap;
}

const operatorsMenuCategoryStyle = {
  textTransform: 'uppercase',
  fontSize: '0.7em',
  color: Colors.grey,
  marginTop: Dimens.spaceMedium
};

const operatorsMenuItemStyle = {
  color: Colors.greyDark,
  fontSize: '1rem',
  lineHeight: '1.6rem'
};

function renderExampleItem(example) {
  return h('li', {style: operatorsMenuItemStyle},
    h('x-operators-menu-link', {
      key: `operatorsMenuLink${example.key}`,
      href: '#' + example.key,
      content: example.key
    })
  );
}

function renderExampleItems(examples) {
  let items = [];
  for (let i = 0; i < examples.length; i++) {
    let example = examples[i];
    items.push(renderExampleItem(example));
  }
  return items;
}

function renderExampleCategory(categoryName, isFirstCategory) {
  return h('li', {
      style: mergeStyles(
        operatorsMenuCategoryStyle,
        isFirstCategory ? {marginTop: '0'} : {})},
    `${categoryName}`
  );
}

function renderMenuContent(categoryMap, todo) {
  let listItems = [];
  let isFirstCategory = true;
  for (let categoryName in categoryMap) {
    if (!categoryMap.hasOwnProperty(categoryName)) continue;
    listItems.push(renderExampleCategory(categoryName, isFirstCategory));
    listItems = listItems.concat(renderExampleItems(categoryMap[categoryName]));
    isFirstCategory = false;
  }
  listItems.push(h('li', {style: operatorsMenuCategoryStyle}, 'TODO'));
  for (let operator in todo) {
    listItems.push(h('li', {style: operatorsMenuItemStyle}, operator));
  }
  return listItems;
}

function operatorsMenuComponent() {
  let categoryMap$ = Rx.Observable.just(organizeExamplesByCategory(Examples));

  return {
    vtree$: categoryMap$.map(categoryMap =>
      h('div',
        {style: {
          paddingRight: '36px',
          boxSizing: 'border-box',
          // 100px is the estimated header page row height
          height: 'calc(100vh - 100px)'}},
        [h('ul',
          {style: {
            margin: '0',
            padding: '0',
            listStyleType: 'none',
            overflowY: 'scroll',
            height: '100%'}},
          renderMenuContent(categoryMap, Todo))])
    )
  };
}

module.exports = operatorsMenuComponent;
