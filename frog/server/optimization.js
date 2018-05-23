// @flow

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const url = 'http://128.179.162.123:8000';

Meteor.methods({
  'optim.recommend': (sessionId, context) => {
    if (Meteor.isServer) {
      const result = HTTP.post(url, {
        data: {
          sessionId,
          requestType: 'RECO',
          context
        }
      });
      return result;
    }
  },
  'optim.report': (sessionId, context, item, score) => {
    if (Meteor.isServer) {
      const result = HTTP.post(url, {
        data: {
          sessionId,
          requestType: 'SCOR',
          context,
          item,
          score
        }
      });
      return result;
    }
  }
});
