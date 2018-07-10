// @flow

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const url = 'http://159.69.15.228:8000';

Meteor.methods({
  'optim.recommend': sessionId => {
    if (Meteor.isServer) {
      const query = HTTP.post(url, {
        data: {
          sessionId,
          requestType: 'RECO'
        }
      });
      return query;
    }
  },
  'optim.report': (sessionId, sequence, result) => {
    if (Meteor.isServer) {
      const query = HTTP.post(url, {
        data: {
          sessionId,
          requestType: 'SCOR',
          sequence,
          result
        }
      });
      return query;
    }
  }
});
