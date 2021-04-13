import React from 'react';
import { List, Map } from 'immutable';
import { withStateHandlers, compose } from 'recompose';

// create an enhancer that handles a state used below to show more colors
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

  /*
    This container is used as a placeholder to render whenever there are no colors showing but there should be some spacing to keep the design consistent.
  */
  if (swatches.size <= 0) {
    return <div className="findify-empty-variant-container"></div>;
  }

  /*
    This container is showing when there are less or equal to 5 color variants showing. The number can be adjusted accordingly to show more or less colors by default.
  */
  if (swatches.size <= 5) {
    return (
      <div className="findify-variant-container-small">
        {swatches}
      </div>
    );
  }

  /*
    This container is showing when there are more than 5 color variants available to include a "more" button in order to show all available color variants.
    The number can be adjusted accordingly.
  */
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

// add the enhancer
export default enhancer(ColorSwatches);
