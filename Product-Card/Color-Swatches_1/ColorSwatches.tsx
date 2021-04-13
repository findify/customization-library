import React from 'react';
import { List, Map } from 'immutable';
import { withStateHandlers, compose } from 'recompose';

const enhancer = compose(
withStateHandlers(
  () => ({
      isListOpen: false,
  }),
  {
    openList: ({ isListOpen }) => (open) => ({ isListOpen: typeof open === 'boolean' ? open : !isListOpen }),
  }
));

const Swatch = ({ color, tooltipText, variantId, productUrl, currentImage, setCurrentVariant }) => (
  <div className="findify-components--cards-product__color-item">
    <div
      className="findify-components--cards-product__color-ball"
      style={{ background: color }}
      onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setCurrentVariant(variantId, productUrl, currentImage);
      }}
    >
    </div>

    <span
      display-if={tooltipText}
      className="findify-components--color-swatch-tooltip"
    >
      {tooltipText}
    </span>
  </div>
);

const ColorSwatches = ({ variants, colorMapping, openList, isListOpen, setCurrentVariant }) => {
  const { swatches } = variants.reduce(({ swatches, colors }, v, i) => {
    const color = v.get('color') && v.get('color').get(0).toLowerCase();
    if (!colors.has(color) && colorMapping.has(color)) {
      return {
        swatches: swatches.push(
          <Swatch
            key={i}
            tooltipText={color}
            color={colorMapping.get(color)}
            variantId={v.get('id')}
            productUrl={v.get('product_url')}
            currentImage={v.get('image_url')}
            setCurrentVariant={setCurrentVariant}
          />
        ),
        colors: colors.set(color, true)
      }
    }
    return { colors, swatches };
  }, { swatches: List([]), colors: Map({}) });

  if (swatches.size <= 0) {
    return <div className="findify-empty-variant-container"></div>;
  }

  if (swatches.size <= 5) {
    return (
      <div className="findify-variant-container-small">
        {swatches}
      </div>
    );
  }

  if (swatches.size > 5) {
    const limitedSwatches = swatches.slice(0, 5)
    const toggleSwatch = isListOpen ? swatches : limitedSwatches

    return (
      <div className="findify-variant-container" onClick={e => {e.preventDefault(); e.stopPropagation()}}>
        {toggleSwatch}
         <button display-if={!isListOpen} onClick={openList} className='findify-swatch--button'>+{swatches.size - 6}</button>
      </div>
    )
  }
};

export default enhancer(ColorSwatches);
