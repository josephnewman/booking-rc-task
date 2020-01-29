import React from 'react';
import debounce from 'lodash.debounce';
import RcInput from '../RcInput';
import Api from '../../services/Api';
import PLACE_TYPES from '../../constants/placeTypes';

import './RcLocationLookup.scss';

export const KEYS = {
  UP: 38,
  DOWN: 40,
  ENTER: 13
};

class RcLocationLookup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lookupResult: [],
      locationInput: '',
      locationFocusedIndex: 0,
      dropdownVisible: false
    };

    this.getResults = debounce(this.getResults.bind(this), 700);
    this.onInputChange = this.onInputChange.bind(this);
    this.setLocationFocused = this.setLocationFocused.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  async onInputChange(evt) {
    const { value } = evt.target;
    this.setState({ locationInput: value });

    this.getResults(value);
  }

  onInputKeyDown(evt) {
    const { locationFocusedIndex, lookupResult } = this.state;
    const { keyCode } = evt;

    let index = locationFocusedIndex;

    if (keyCode === KEYS.DOWN) {
      // Moving focused row down and relooping if we reach the end
      index = locationFocusedIndex + 1 < lookupResult.length ? locationFocusedIndex + 1 : 0;
    } else if (keyCode === KEYS.UP) {
      // Moving focused row up and relooping if we reach the first
      index = locationFocusedIndex > 0 ? locationFocusedIndex - 1 : lookupResult.length - 1;
    } else if (keyCode === KEYS.ENTER) {
      this.selectItem(index);
    }

    if (keyCode === KEYS.DOWN || keyCode === KEYS.UP) {
      this.setState({ locationFocusedIndex: index, dropdownVisible: true });
    }
  }

  async getResults(val) {
    let results = [];

    if (val.length > 1) {
      try {
        const response = await Api.get(
          `https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=${val}`
        );

        if (response) {
          results = response.data.results.docs;
        }

        this.setState({ lookupResult: results, locationFocusedIndex: 0, dropdownVisible: true });
      } catch (e) {
        // In a production app this would be handled.
      }
    } else {
      this.setState({ lookupResult:[], dropdownVisible: false });
    }
  }

  getPlaceTitleLine = item => {
    return item.iata ? `${item.name} (${item.iata})` : item.name;
  };

  getPlaceLocationLine = item => {
    if (item.country) {
      return item.region ? `${item.region}, ${item.country}` : item.country;
    }
    return item.region ? item.region : '';
  };

  setLocationFocused(index) {
    this.setState({ locationFocusedIndex: index });
  }

  selectItem(index) {
    const { lookupResult } = this.state;
    const item = lookupResult[index];
    const locationLine = this.getPlaceLocationLine(item);
    let text = this.getPlaceTitleLine(item);
    
    if (locationLine.length) {
      text += `, ${locationLine}`;
    }

    this.setState({ locationInput: text, dropdownVisible: false });
  }

  showDropdown(val) {
    const { lookupResult } = this.state;

    this.setState({ dropdownVisible: val && lookupResult.length });
  }

  highlightText(text) {
    const { locationInput } = this.state;
    const index = text.toLowerCase().indexOf(locationInput.toLowerCase());
    const locationInputLength = locationInput.length;

    if (index >= 0) {
      return (
        <span>
          {text.substring(0, index)}
          <mark>{text.substring(index, index + locationInputLength)}</mark>
          {text.substring(index + locationInputLength)}
        </span>
      );
    }
    return text;
  }

  render() {
    const { locationInput, locationFocusedIndex, lookupResult, dropdownVisible } = this.state;
    let dropdownVisibleClass;

    const getPlaceIndicator = item => {
      const placeName = PLACE_TYPES[item.placeType] || '';

      if (item.placeType) {
        return (
          <div className="rc-location-lookup__place-container">
            <div className={`rc-location-lookup__place rc-location-lookup__place-${placeName.toLowerCase()}`}>
              {PLACE_TYPES[item.placeType]}
            </div>
          </div>
        );
      }
      return '';
    };

    const dropdownItems = lookupResult.map((item, index) => {
      const selectedClass = index === locationFocusedIndex ? 'rc-location-lookup__dropdown-item-focused' : null;
      const row = (
        <li
          id={`item-${index}`}
          className={`rc-location-lookup__dropdown-item ${selectedClass}`}
          role="option"
          tabIndex="-1"
          aria-selected={!!selectedClass}
          key={`${item.placeKey}-${item.bookingId}`}
          onMouseOver={() => this.setLocationFocused(index)}
          onFocus={() => this.setLocationFocused(index)}
          onMouseDown={() => {
            this.selectItem(index);
          }}
        >
          {getPlaceIndicator(item)}
          <div className="rc-location-lookup__description-container">
            <div>{this.highlightText(this.getPlaceTitleLine(item), locationInput)}</div>
            <div className="rc-location-lookup__location-line">{this.getPlaceLocationLine(item)}</div>
          </div>
        </li>
      );

      return row;
    });

    if (dropdownVisible) {
      dropdownVisibleClass = 'rc-location-lookup__dropdown-visible';
    }

    return (
      <div className="rc-location-lookup">
        <label className="rc-location-lookup__label" htmlFor="rc-lookup-input">
          Pick-up location
        </label>
        <RcInput
          className="rc-location-lookup__input"
          id="rc-lookup-input"
          name="rc-lookup-input"
          value={locationInput}
          role="combobox"
          aria-owns="rcLookupDropdownList"
          aria-activedescendant={`item-${locationFocusedIndex}`}
          aria-expanded={ dropdownVisible }
          placeholder="city, airport, station, region and district..."
          onChange={this.onInputChange}
          onKeyDown={this.onInputKeyDown}
          onMouseDown={() => this.showDropdown(true)}
          onFocus={() => this.showDropdown(true)}
          onBlur={() => this.showDropdown(false)}
        />
        <ul id="rcLookupDropdownList" role="listbox" className={`rc-location-lookup__dropdown ${dropdownVisibleClass}`}>
          {dropdownItems}
        </ul>
      </div>
    );
  }
}

export default RcLocationLookup;
