// @flow

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Accounts } from 'meteor/accounts-base';

import { Activities } from './activities';
import {
  Sessions,
  updateSessionState,
  updateOpenActivities,
  sessionCancelCountDown
} from './sessions';
import { engineLogger } from './logs';
import { calculateNextOpen } from './graphSequence';

export const runSession = (sessionId: string) =>
  Meteor.call('run.session', sessionId);

export const nextActivity = (sessionId: string) =>
  Meteor.call('next.activity', sessionId);

export const runNextActivity = (sessionId: string) => {
  if (Meteor.isServer) {
    sessionCancelCountDown(sessionId);
    const session = Sessions.findOne(sessionId);
    const oldOpen = [...session.openActivities];
    const activities = Activities.find({ graphId: session.graphId }).fetch();

    const [newTimeInGraph, openActivities] = calculateNextOpen(
      session.timeInGraph,
      activities
    );
    const openActivityIds = openActivities.map(x => x._id);
    updateOpenActivities(sessionId, openActivityIds, newTimeInGraph);
    if (openActivities.some(x => x.plane === 2)) {
      Sessions.update(sessionId, { $set: { tooLate: true } });
    }

    engineLogger(sessionId, 'nextActivity', newTimeInGraph);
    const justClosedActivities = oldOpen.filter(
      act => !openActivities.includes(act)
    );
    justClosedActivities.forEach(act =>
      Meteor.call('reactive.to.product', act)
    );
  }
};

export const runSessionFn = (sessionId: string) => {
  updateSessionState(sessionId, 'STARTED');
  Sessions.update(sessionId, { $set: { startedAt: Date.now() } });
  engineLogger(sessionId, 'startSession');
  const session = Sessions.findOne(sessionId);
  if (Meteor.isServer) {
    if (session.studentlist) {
      session.studentlist.forEach(student => {
        const { userId } = Accounts.updateOrCreateUserFromExternalService(
          'frog',
          {
            id: student
          }
        );
        Meteor.users.update(userId, { $set: { username: student } });
        const joined = Meteor.users.findOne(userId).joinedSessions;
        if (!joined || !joined.includes(session.slug)) {
          Meteor.users.update(userId, {
            $push: { joinedSessions: session.slug }
          });
        }
      });
    }
  }
};

const test = () => {
  if (Meteor.isServer) {
    console.log('Request');
    // const http = new XMLHttpRequest();
    const url = 'http://localhost:8000';
    // const params = '{ "requestType": "INIT", "sessionId": "A" }';
    // http.open("POST", url, true);
    //
    //
    // // var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    // // xmlhttp.open("POST", "localhost:8000", true);
    // // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // // xmlhttp.send(JSON.stringify({ email: "hello@user.com", response: { name: "Tester" } }));
    //
    //
    // // Send the proper header information along with the request
    // http.setRequestHeader("Content-type", "application/json");
    //
    // http.onreadystatechange = function() {
    //     console.log('http')
    //     console.log(http)
    //     if(http.readyState == 4 && http.status == 200) {
    //         alert(http.responseText);
    //     }
    // }
    // console.log('Sending')
    // http.send(params);
    const result = HTTP.post(url, {
      data: { sessionId: 'json', requestType: 'RECO' }
    });
    console.log(result);
    return result;
  }
};

Meteor.methods({
  'run.session': runSessionFn,
  'next.activity': runNextActivity,
  optim: test
});
