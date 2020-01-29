import React from 'react';
import { mount } from 'enzyme';
import RcInput from './RcInput';

describe('when RcInput is in its default state', () => {
  let input;
  beforeEach(() => {
    input = mount(<RcInput />);
  });

  it('should render without issue', () => {
    expect(input.exists()).toBe(true);
  });

  it('should have default undefined onChange', () => {
    expect(input.props().onChange()).toBeUndefined();
  });

  it('should have default undefined onKeyDown', () => {
    expect(input.props().onKeyDown()).toBeUndefined();
  });

  it('should have default undefined onFocus', () => {
    expect(input.props().onFocus()).toBeUndefined();
  });

  it('should have default undefined onBlur', () => {
    expect(input.props().onBlur()).toBeUndefined();
  });

  describe('when the id attribute is set', () => {
    const id = 'test';
    beforeEach(() => {
      input.setProps({
        id
      });
    });

    it('should add the id attribute to the input', () => {
      expect(input.getDOMNode().getAttribute('id')).toBe(id);
    });
  });

  describe('when the name attribute is set', () => {
    const name = 'test';
    beforeEach(() => {
      input.setProps({
        name
      });
    });

    it('should add the name attribute to the input', () => {
      expect(input.getDOMNode().getAttribute('name')).toBe(name);
    });
  });

  describe('when the placeholder attribute is set', () => {
    const placeholder = 'test';
    beforeEach(() => {
      input.setProps({
        placeholder
      });
    });

    it('should add the placeholder attribute to the input', () => {
      expect(input.getDOMNode().getAttribute('placeholder')).toBe(placeholder);
    });
  });

  describe('when the user changes the input', () => {
    const mockOnChange = jest.fn();
    const value = 'lorem';
    
    beforeEach(() => {
      input.setProps({
        onChange: mockOnChange
      });

      input.simulate('change', { target: { value } });
    });

    it('should call onChange with the correct value', () => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: {value},
        })
      );
    });
  });

  describe('when the user presses a key', () => {
    const mockOnKeyDown = jest.fn();
    const key = {
      target: {
        keyCode: 13
      }
    };
    
    beforeEach(() => {
      input.setProps({
        onKeyDown: mockOnKeyDown
      });

      input.simulate('keydown', key);
    });

    it('should call onKeyDown with the expected key event', () => {
      expect(mockOnKeyDown).toHaveBeenCalledWith(
        expect.objectContaining(key)
      );
    });
  });

  describe('when the user focuses on the input', () => {
    const mockOnFocus = jest.fn();
    
    beforeEach(() => {
      input.setProps({
        onFocus: mockOnFocus
      });

      input.simulate('focus');
    });

    it('should call onFocus', () => {
      expect(mockOnFocus).toHaveBeenCalled();
    });
  });

  describe('when the user blurs on the input', () => {
    const mockOnBlur = jest.fn();
    
    beforeEach(() => {
      input.setProps({
        onBlur: mockOnBlur
      });

      input.simulate('blur');
    });

    it('should call onBlur', () => {
      expect(mockOnBlur).toHaveBeenCalled();
    });
  });
});