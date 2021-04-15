/**
 * @module layouts/Autocomplete/Fullscreen
 */

import React from 'react'
import Drawer from 'components/common/Drawer'
import Icon from 'components/Icon'
import Suggestions from 'components/autocomplete/SearchSuggestions'
import * as emmiter from 'helpers/emmiter';
import cx from 'classnames';
// import the ProductMatches component
import ProductMatches from 'components/autocomplete/ProductMatches';
// import the Tip component
import Tip from 'components/autocomplete/Tip';

export default ({ config, theme, meta, suggestions, innerRef, position, isMobile, ...rest }) =>
<div display-if={suggestions && suggestions.size > 0} className={theme.wrapper}>
  <div
    className={theme.root}
    data-findify-autocomplete={true}
    tabIndex={0}>
    <div className={theme.container}>
      <h4 className={cx(theme.typeTitle, theme.suggestionsTitle)}>
        { config.getIn(['i18n', 'suggestionsTitle']) }
      </h4>
      <Suggestions
        className={theme.searchSuggestions}
        widgetKey={config.get('widgetKey')}
        {...rest} />
    {/* include the ProductMatches component here */}
    <ProductMatches isMobile={true} className={theme.productMatches} config={config} {...rest}/>
    {/* include the Tip component here */}
    <Tip
      className={theme.tip}
      title={config.getIn(['i18n', 'tipResults'])}
      zeroResultsTitle={config.getIn(['i18n', 'tipTrendingResults'], 'View All Results')}
      widgetKey={config.get('widgetKey')} />
    </div>
  </div>
</div>
