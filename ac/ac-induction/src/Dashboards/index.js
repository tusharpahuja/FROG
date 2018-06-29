// @flow

import React from 'react';

import type { LogDbT, DashboardViewerPropsT } from 'frog-utils';

const Viewer = ({ state }: DashboardViewerPropsT) => (
  <pre>{JSON.stringify(state, null, 2)}</pre>
);

const mergeLog = (state: any, log: LogDbT) => {
  state[log.instanceId] = state[log.instanceId] || [];
  const { type, timestamp, value, payload } = log;
  state[log.instanceId].push({ type, timestamp, value, payload });
};

const initData = {};

export default {
  raw: {
    Viewer,
    mergeLog,
    initData
  }
};
