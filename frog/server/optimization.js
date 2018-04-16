// @flow

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

const recommend = () => {
  if(Meteor.isServer) {
    console.log('Recommend')
    const url = Meteor.settings.OPTIM_URL;
    console.log(url)
    const result = HTTP.post( url, {
      data: { sessionId: 'json', requestType: 'RECO' }
    })
    console.log(result)
    return result
  }
}

const report = () => {
  if(Meteor.isServer) {
    console.log('Report')
    const url = "http://localhost:8000";
    const result = HTTP.post( url, {
      data: { sessionId: 'json', requestType: 'RECO' }
    })
    console.log(result)
    return result
  }
}

Meteor.methods({
  'optim.recommend': recommend,
  'optim.report': report
});
