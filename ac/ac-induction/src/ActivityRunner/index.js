// @flow

import * as React from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import { compose, withState } from 'recompose'
import { withStyles } from 'material-ui/styles';

import Example from '../Components/Example';
import Test from '../Components/Test';

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const ActivityRunner = (props: ActivityRunnerT & {classes: Object}) => {
  const { activityData, classes, ex, setEx, type, setType } = props
  const { examples, categories } = activityData.config;

  const next = () => {
    setEx((ex + 1)% examples.length)
    setType(type === 'example' ? 'test' : 'example')
  }

  const Comp = { example: Example, test: Test }[type]

  return (
    <div className={classes.container}>
      <Comp example={examples[ex]} next={next} categories={categories} withFeedback />
    </div>
  );
};

const AR = compose(
  withState('ex', 'setEx', 0),
  withState('type', 'setType', 'example')
)(ActivityRunner)

export default withStyles(styles)(AR)
