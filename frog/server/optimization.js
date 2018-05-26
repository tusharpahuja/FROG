// @flow

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const url = 'http://159.69.15.228:8000';

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
