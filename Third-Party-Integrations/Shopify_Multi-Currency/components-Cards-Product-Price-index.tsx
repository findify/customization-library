/**
 * @module components/Cards/Product/Price
 */

import cx from 'classnames';
import { getPrice } from 'helpers/getPrice';
import { IProduct, ThemedSFCProps } from 'types';
import { priceIsSampleArray } from 'helpers/getPrice';
import { useConfig } from '@findify/react-connect';
import styles from 'components/Cards/Product/Price/styles.css';
// import custom currencies and the helper function to convert prices
import currency from 'currency';
import convertPrice from 'convertPrice';

/** List of props that Price component accepts */
export interface IPriceProps extends ThemedSFCProps {
  item: IProduct;
}

export default ({ className, theme = styles, item }: IPriceProps) => {
  const { config } = useConfig();

  const hasDiscount =
    !item.get('compare_at') &&
    item.get('discount') &&
    item.get('discount').size > 0 &&
    priceIsSampleArray(item.get('price'));

  const hasCompare = !!item.get('compare_at');

  // define the variables we will need to convert below
  const price = item.get('price');
  const compare_at = item.get('compare_at');

  // update both price and sale prices
  const updated_price = price.size > 0 && price.setIn([0], convertPrice(price.get(0))).setIn([price.size-1],convertPrice(price.get(price.size-1)));
  const updated_compare_at = compare_at != -1 && convertPrice(compare_at);

  // grab Shopify currencies
  const multiCurrency = currency[Shopify.currency.active] || config.get('currency');

  return (
    <div className={cx(theme.priceWrapper, className)}>
      <span
        className={cx(
          theme.price,
          (hasDiscount || hasCompare) && theme.salePrice
        )}
      >
        {/* pass the updated values */}
        {getPrice(updated_price, multiCurrency)}
      </span>
      <span display-if={hasCompare} className={cx(theme.compare)}>
        {/* pass the updated values */}
        {getPrice(updated_compare_at, multiCurrency)}
      </span>
    </div>
  );
};
