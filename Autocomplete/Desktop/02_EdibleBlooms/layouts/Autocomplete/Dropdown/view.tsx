Note: Basically only move <Tip /> to bottom

/**
 * @module layouts/Autocomplete/Dropdown
 */

import React, { useEffect } from 'react';
// some imports

// ... some code ...

const AutocompleteDropdownView: React.SFC<IAutocompleteDropdownProps> = ({
  config,
  theme,
  meta,
  suggestions,
  innerRef,
  closeAutocomplete,
  ...rest
}: IAutocompleteDropdownProps) => {
  const isTrendingSearches = !meta.get('q');
  const [position, register] = usePosition(config);
  return (
    <div display-if={suggestions && suggestions.size > 0} className={theme.wrapper}>
      <div className={theme.overlay} display-if={config.get('showOverlay')} onClick={closeAutocomplete}></div>
      <div
        className={theme.root}
        data-findify-autocomplete={true}
        tabIndex={0}
        ref={register}
        style={{ left: 0 }}>
        <div className={theme.container}>
          <Suggestions
            {...rest}
            theme={theme}
            config={config}
            icon={isTrendingSearches && 'Fire'}
            isTrendingSearches={isTrendingSearches}
          />
          <Products
            {...rest}
            theme={theme}
            config={config}
            isTrendingSearches={isTrendingSearches}
          />
        </div>
        {/* move <Tip /> down here */}
        <Tip
          className={theme.tip}
          title={config.getIn(['i18n', 'tipResults'])}
          widgetKey={config.get('widgetKey')} />
      </div>
    </div>
  )
}

export default AutocompleteDropdownView;
