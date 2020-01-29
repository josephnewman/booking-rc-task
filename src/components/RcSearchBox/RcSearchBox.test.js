import React from 'react';
import { shallow } from 'enzyme';
import RcSearchBox from './RcSearchBox';

describe('when the RcSearchBox is in its default state', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<RcSearchBox />);
  });

  it('should render without issue', () => {
    expect(wrapper.exists()).toBe(true);
  });
});