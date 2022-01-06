/**
 * @module components/RangeFacet
 */

import unescape from 'lodash/unescape';
import formatCurrency from 'helpers/formatCurrency';

// import custom currencies
import currency from 'currency';

const identity = (i) => i;

const createLabel = (from, to, config, fx) =>
  (from && to && `${fx(from)} - ${fx(to)}`) ||
  (from &&
    !to &&
    `${fx(from)} ${unescape(config.getIn(['translations', 'range.up']))}`) ||
  (!from &&
    to &&
    `${unescape(config.getIn(['translations', 'range.under']))} ${fx(to)}`);

export default ({ item, config }) =>
  createLabel(
    item.get('from'),
    item.get('to'),
    config,
    (item.get('name') === 'price' &&
      formatCurrency(currency[Shopify.currency.active] || config.get('currency').toJS())) ||
      identity
  );
