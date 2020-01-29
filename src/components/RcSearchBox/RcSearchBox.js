import React from 'react';
import './RcSearchBox.scss';
import RcLocationLookup from '../RcLocationLookup';

function RcSearchBox() {
  return (
      <div className="app">
        <div className="rc-search-box">
          <h1>Let&apos;s find your ideal car</h1>
          <RcLocationLookup />
        </div>
      </div>
  );
}


export default RcSearchBox;
