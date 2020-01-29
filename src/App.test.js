import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

describe('when the app is its default state', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should render without issue', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
