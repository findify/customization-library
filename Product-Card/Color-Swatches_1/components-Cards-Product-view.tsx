/**
 * @module components/Cards/Product
 */

import React from 'react'
import classNames from 'classnames'
import Image from 'components/common/Picture'
import Truncate from 'components/common/Truncate'
import Text from 'components/Text'
import Rating from 'components/Cards/Product/Rating';
import Price from 'components/Cards/Product/Price';
import template from 'helpers/template';
import { DiscountSticker, OutOfStockSticker  } from 'components/Cards/Product/Stickers';
import { List } from 'immutable'
import { IProduct, MJSConfiguration, ThemedSFCProps } from 'types/index';
import BundleAction from 'components/Cards/Product/BundleAction';
// import a few things
import { withStateHandlers, compose, withProps, withPropsOnChange } from 'recompose';
import ColorSwatches from 'ColorSwatches';
import { Item } from 'react-connect/lib/immutable/item';

// create an enhancer
const enhancer = compose(
  // this part contains the basic states the component is going to need
  withStateHandlers(
    ({ item }) => ({
        currentVariantID: 'default',
        currentProductUrl: item.get('product_url'),
        currentImage: item.get('image_url') || item.get('thumbnail_url'),
        previousImage: item.get('image_url') || item.get('thumbnail_url')
    }),
    {
      setImage: ({currentImage}) => (nextImage) => ({currentImage: nextImage, previousImage: currentImage}),
      setCurrentVariant: ({currentVariantID, currentProductUrl, currentImage}) => (currentVariantID, currentProductUrl, currentImage) => ({
        currentVariantID: currentVariantID,
        currentProductUrl: currentProductUrl,
        currentImage: currentImage
      })
    }
  ),
  /*
    Important! - The below part is required for our analytics to work as expected.
    It's adjusting the click event on a product to send the appropriate selected variant analytics.
  */
  withProps(({ item, currentProductUrl }) => ({
      item: new Item(item.set('product_url', currentProductUrl), item.meta, item.analytics),
  })),
  withPropsOnChange(['config'], ({ config }) => ({
    // isAutocomplete is a prop that can be used to e.g. not display colorSwatches in the autocomplete
    isAutocomplete: config.get('cssSelector') && config.get('cssSelector').indexOf('findify-autocomplete') >= 0,
    // ColorMapping is required for the color swatches to work
    colorMapping: config.getIn(['features', 'search', 'facets', 'color', 'mapping']),
  })),
);


const Title: any = ({ text, theme, ...rest }) => (
  <Text display-if={!!text} className={theme.title} {...rest}>{text}</Text>
);

const Description: any = ({ text, theme, ...rest }) => (
  <p
    display-if={!!text}
    className={theme.description}
    {...rest}
  >
    <Truncate>{text}</Truncate>
  </p>
);


export interface IProductCardProps extends ThemedSFCProps {
  item: IProduct;
  config: MJSConfiguration;
}

const ProductCardView: React.SFC<IProductCardProps> = ({
  item,
  config,
  theme,

  // pass down some props of states we created above
  isAutocomplete,
  colorMapping,
  currentProductUrl,
  currentImage,
  previousImage,
  setCurrentVariant
}: any) => (
  <a
    onClick={item.onClick}
    // make sure to use the updated variant product URL to redirect to the variant PDP
    href={currentProductUrl}
    className={classNames(
      theme.root,
      config.get('simple') && theme.simple,
      theme.productCard,
    )}
  >
     <div
      className={classNames(theme.imageWrap)}>
      <BundleAction display-if={config.get('bundle')} item={item} />
      {/* This module uses a little hack to lazyload images and provide great UX while images are loading. */}
      <Image
        // add "lazy"
        lazy
        className={classNames(theme.image)}
        // adjust the next three lines
        aspectRatio={0}
        thumbnail={previousImage}
        src={currentImage}
        alt={item.get('title')}
      />
      <div display-if={config.getIn(['product', 'stickers', 'display'])}>
        <DiscountSticker
          config={config}
          className={theme.discountSticker}
          discount={item.get('discount')}
          display-if={
            config.getIn(['stickers', 'discount']) &&
            config.getIn(['product', 'stickers', 'display']) &&
            item.get('discount', List()).size &&
            item.getIn(['stickers', 'discount'])
          } />
      </div>
    </div>
    <div
      display-if={
        config.getIn(['product', 'reviews', 'display']) &&
        (!!item.getIn(['reviews', 'count']) || !!item.getIn(['reviews', 'total_reviews']))
      }
      className={theme.rating}>
      <Rating
        value={item.getIn(['reviews', 'average_score'])}
        count={item.getIn(['reviews', 'count']) || item.getIn(['reviews', 'total_reviews'])} />
    </div>
    <div
      className={theme.variants}
      display-if={
        config.getIn(['product', 'variants', 'display']) &&
        item.get('variants', List()).size > 1
      }
      >
      {
        template(config.getIn(['product', 'i18n', 'variants'], 'Available in %s variants'))(
          item.get('variants', List()).size
        )
      }
    </div>
    <div className={theme.content}>
      {/* Add the color swatches component */}
      <ColorSwatches
        display-if={!isAutocomplete}
        variants={item.get('variants')}
        colorMapping={colorMapping}
        setCurrentVariant={setCurrentVariant}
      />
      <Title
        theme={theme}
        display-if={config.getIn(['product', 'title', 'display'])}
        text={item.get('title')}
        config={config.getIn(['product', 'title'])} />
      <Description
        theme={theme}
        display-if={config.getIn(['product', 'description', 'display'])}
        text={item.get('description')}
        config={config.getIn(['product', 'description'])} />
      <Price
        className={theme.priceWrapper}
        display-if={config.getIn(['product', 'price', 'display'])}
        price={item.get('price')}
        oldPrice={item.get('compare_at')}
        discount={item.get('discount')}
        currency={config.get('currency_config').toJS()} />
      <OutOfStockSticker
        display-if={item.getIn(['stickers', 'out-of-stock'])}
        config={config} />
    </div>
  </a>
)

// add the enhancer
export default enhancer(ProductCardView);
