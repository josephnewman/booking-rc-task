import React from 'react';
import { mount } from 'enzyme';
import RcLocationLookup, {KEYS} from './RcLocationLookup';
import Api from '../../services/Api';
import lookupMock from '../../../tests/mocks/lookupMock.json';

const BLOCK_NAME = '.rc-location-lookup';

jest.mock('lodash.debounce', () => fn => fn);

describe('when the RcLocationLookup is in its default state', () => {
  let rcLocationLookup;
  let mockLocationLookupResponse;
  let resolvePromise;
  let spy;

  beforeEach(() => {
    rcLocationLookup = mount(<RcLocationLookup />);

    mockLocationLookupResponse = new Promise(resolve => {
      resolvePromise = resolve;
    });

    spy = jest.spyOn(Api, 'get').mockReturnValue(mockLocationLookupResponse);
  });

  it('should render without issue', () => {
    expect(rcLocationLookup.exists()).toBe(true);
  });

  describe('when the user inputs a single character', () => {
    const value = 'm';

    beforeEach(() => {
      rcLocationLookup
        .find(`${BLOCK_NAME}__input`)
        .hostNodes()
        .simulate('change', { target: { value } });
    });

    it('should match the input', () => {
      expect(
        rcLocationLookup
          .find(`${BLOCK_NAME}__input`)
          .hostNodes()
          .props().value
      ).toBe(value);
    });

    it('should not show dropdown', () => {
      expect(rcLocationLookup.find(`${BLOCK_NAME}__dropdown-visible`).exists()).toBe(false);
    });

    it('should NOT call the api', () => {
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('when the user inputs Man', () => {
    const value = 'Man';

    beforeEach(() => {
      rcLocationLookup
        .find(`${BLOCK_NAME}__input`)
        .hostNodes()
        .simulate('change', { target: { value } });
    });

    afterEach(() => {
      spy.mockClear();
    });

    it('should match the input', () => {
      expect(
        rcLocationLookup
          .find(`${BLOCK_NAME}__input`)
          .hostNodes()
          .props().value
      ).toBe(value);
    });

    it('should call api', () => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        `https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=${value}`
      );
    });

    describe('when the api returns', () => {
      beforeEach(callback => {
        resolvePromise({ data: lookupMock });

        setImmediate(() => {
          rcLocationLookup.update();
          callback();
        });
      });

      it('should show dropdown', () => {
        expect(rcLocationLookup.find(`${BLOCK_NAME}__dropdown-visible`).exists()).toBe(true);
      });

      it('should have 3 items in the dropdown', () => {
        expect(rcLocationLookup.find(`${BLOCK_NAME}__dropdown-item`).length).toBe(4);
      });

      it('should have IATA code for airport', () => {
        expect(
          rcLocationLookup
            .find(`${BLOCK_NAME}__dropdown-item`)
            .at(0)
            .text()
        ).toContain(lookupMock.results.docs[0].iata);
      });

      it('should have highlighted name for first address item', () => {
        expect(
          rcLocationLookup
            .find(`${BLOCK_NAME}__dropdown-item`)
            .at(0)
            .html()
        ).toContain('<mark>Man</mark>');
      });

      it('should NOT have highlighted name for fourth address item', () => {
        expect(
          rcLocationLookup
            .find(`${BLOCK_NAME}__dropdown-item`)
            .at(3)
            .html()
        ).not.toContain('<mark>');
      });

      it('should have first address item highlighted', () => {
        expect(
          rcLocationLookup
            .find(`${BLOCK_NAME}__dropdown-item`)
            .at(0)
            .hasClass('rc-location-lookup__dropdown-item-focused')
        ).toBe(true);
      });

      lookupMock.results.docs.forEach((doc, index) => {
        it(`should have correct name in the dropdown item ${doc.name}`, () => {
          expect(
            rcLocationLookup
              .find(`${BLOCK_NAME}__dropdown-item`)
              .at(index)
              .text()
          ).toContain(doc.name);
        });
      });

      describe('when the user blurs from the input', () => {
        beforeEach(() => {
          rcLocationLookup
            .find(`${BLOCK_NAME}__input`)
            .hostNodes()
            .simulate('blur');
        });

        it('should NOT show dropdown', () => {
          expect(rcLocationLookup.find(`${BLOCK_NAME}__dropdown-visible`).exists()).toBe(false);
        });

        describe('when the user focuses on the input', () => {
          beforeEach(() => {
            rcLocationLookup
              .find(`${BLOCK_NAME}__input`)
              .hostNodes()
              .simulate('focus');
          });

          it('should show dropdown', () => {
            expect(rcLocationLookup.find(`${BLOCK_NAME}__dropdown-visible`).exists()).toBe(true);
          });
        });

        describe('when the user clicks on the input', () => {
          beforeEach(() => {
            rcLocationLookup
              .find(`${BLOCK_NAME}__input`)
              .hostNodes()
              .simulate('mouseDown');
          });

          it('should show dropdown', () => {
            expect(rcLocationLookup.find(`${BLOCK_NAME}__dropdown-visible`).exists()).toBe(true);
          });
        });
      });

      describe('when the user clicks on the first address item', () => {
        beforeEach(() => {
          rcLocationLookup
            .find(`${BLOCK_NAME}__dropdown-item`)
            .at(1).simulate('mousedown');
        });

        it('should NOT show dropdown', () => {
          expect(rcLocationLookup.find(`${BLOCK_NAME}__dropdown-visible`).exists()).toBe(false);
        });

        it('should have selected field in the input', () => {
          expect(
            rcLocationLookup
              .find(`${BLOCK_NAME}__input`)
              .hostNodes()
              .props().value
          ).toBe('Manchester, Greater Manchester, United Kingdom');
        });
      });

      describe('when the user hovers over the second address item', () => {
        beforeEach(() => {
          rcLocationLookup
            .find(`${BLOCK_NAME}__dropdown-item`)
            .at(2).simulate('mouseover');
        });

        it('should have second address item highlighted', () => {
          expect(
            rcLocationLookup
              .find(`${BLOCK_NAME}__dropdown-item`)
              .at(2)
              .hasClass('rc-location-lookup__dropdown-item-focused')
          ).toBe(true);
        });
      });

      describe('when the user focuses on the third address item', () => {
        beforeEach(() => {
          rcLocationLookup
            .find(`${BLOCK_NAME}__dropdown-item`)
            .at(3).simulate('focus');
        });

        it('should have third address item highlighted', () => {
          expect(
            rcLocationLookup
              .find(`${BLOCK_NAME}__dropdown-item`)
              .at(3)
              .hasClass('rc-location-lookup__dropdown-item-focused')
          ).toBe(true);
        });

        describe('when the user presses enter', () => {
          beforeEach(() => {
            rcLocationLookup
              .find(`${BLOCK_NAME}__input`)
              .hostNodes().simulate('keydown', {
                keyCode: KEYS.ENTER
              });
          });
  
          it('should NOT show dropdown', () => {
            expect(rcLocationLookup.find('.rc-location-lookup__dropdown-visible').exists()).toBe(false);
          });
  
          it('should have selected field in the input', () => {
            expect(
              rcLocationLookup
                .find(`${BLOCK_NAME}__input`)
                .hostNodes()
                .props().value
            ).toBe('Ronaldsway Airport (IOM), Isle of Man');
          });
        });
      });

      describe('when the user presses the up key', () => {
        beforeEach(() => {
          rcLocationLookup
            .find(`${BLOCK_NAME}__input`)
            .hostNodes().simulate('keydown', {
              keyCode: KEYS.UP
            });
        });

        it('should loop to bottom and have last address item highlighted', () => {
          expect(
            rcLocationLookup
              .find(`${BLOCK_NAME}__dropdown-item`)
              .at(3)
              .hasClass('rc-location-lookup__dropdown-item-focused')
          ).toBe(true);
        });

        describe('when the user presses the down key', () => {
          beforeEach(() => {
            rcLocationLookup
              .find(`${BLOCK_NAME}__input`)
              .hostNodes().simulate('keydown', {
                keyCode: KEYS.DOWN
              });
          });
  
          it('should loop to top and have first address item highlighted', () => {
            expect(
              rcLocationLookup
                .find(`${BLOCK_NAME}__dropdown-item`)
                .at(0)
                .hasClass('rc-location-lookup__dropdown-item-focused')
            ).toBe(true);
          });
        });
      });

      describe('when the user presses the down key', () => {
        beforeEach(() => {
          rcLocationLookup
            .find(`${BLOCK_NAME}__input`)
            .hostNodes().simulate('keydown', {
              keyCode: KEYS.DOWN
            });
        });

        it('should NOT have first address item highlighted', () => {
          expect(
            rcLocationLookup
              .find(`${BLOCK_NAME}__dropdown-item`)
              .at(0)
              .hasClass('rc-location-lookup__dropdown-item-focused')
          ).toBe(false);
        });

        it('should have second address item highlighted', () => {
          expect(
            rcLocationLookup
              .find(`${BLOCK_NAME}__dropdown-item`)
              .at(1)
              .hasClass('rc-location-lookup__dropdown-item-focused')
          ).toBe(true);
        });

        describe('when the user presses the up key', () => {
          beforeEach(() => {
            rcLocationLookup
              .find(`${BLOCK_NAME}__input`)
              .hostNodes().simulate('keydown', {
                keyCode: KEYS.UP
              });
          });

          it('should NOT have first address item highlighted', () => {
            expect(
              rcLocationLookup
                .find(`${BLOCK_NAME}__dropdown-item`)
                .at(0)
                .hasClass('rc-location-lookup__dropdown-item-focused')
            ).toBe(true);
          });
        });
      });
    });
  });
});
