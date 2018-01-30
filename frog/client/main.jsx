import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import flexibility from 'flexibility';

import App from '../imports/ui/App';

Meteor.startup(() => {
  flexibility(document.getElementById('render-target'))
  render(<App />, document.getElementById('render-target'));
});
