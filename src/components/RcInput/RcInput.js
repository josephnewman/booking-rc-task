import React from 'react';
import './RcInput.scss';

function RcInput({ className, value, onChange, onKeyDown, onFocus, onBlur, ...otherProps }) {
  return (
    <input
      className={`rc-input ${className}`}
      data-qa="rc-input"
      type="text"
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus} 
      onBlur={onBlur} 
      value={value}
      {...otherProps}
    />
  );

}

RcInput.defaultProps = {
  onChange: () => {},
  onKeyDown: () => {},
  onFocus: () => {},
  onBlur: () => { },
  className: ''
};

export default RcInput;
