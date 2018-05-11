// @flow

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const url = 'http://128.179.163.44:8000';

Meteor.methods({
  'optim.recommend': context => {
    if (Meteor.isServer) {
      const result = HTTP.post(url, {
        data: {
          sessionId: 'EXPERIMENT_0',
          requestType: 'RECO',
          context
        }
      });
      return result;
    }
  },
  'optim.report': (context, item, score) => {
    if (Meteor.isServer) {
      const result = HTTP.post(url, {
        data: {
          sessionId: 'EXPERIMENT_0',
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
