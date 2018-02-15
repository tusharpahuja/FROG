// @flow

import React, { Component } from 'react';

import { Activities, activitiesDBFn } from '/imports/api/activities';
import { ActivityLibrary, addActivityToLibrary, removeActivity } from '/imports/api/activityLibrary';
import ChooseActivity from './ChooseActivity';
import EditActivity from './EditActivity';

type StateT = { // fake store
  
};

// need props func to tell to the graphEditor when something is happening
// or do everything in the graph from the DB
class ActivityCreator extends Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = props.store ? props.store : {

    };
  }

  render() {
    const activity = this.props.id ? Activities.findOne(this.props.id) : {id: '1', activityType: ''}
    if (activity.activityType && activity.activityType !== '') {
      return <EditActivity store={this.state} storeFn={this.setState} {...{activity, activitiesDBFn, addActivityToLibrary}} />;
    } else {
      return <ChooseActivity store={this.state} storeFn={this.setState}
        onSelect={e => activity.activityType = e}
        {...{activity, ActivityLibrary, activitiesDBFn, removeActivity}} />;
    }
  }
}

export default ActivityCreator
