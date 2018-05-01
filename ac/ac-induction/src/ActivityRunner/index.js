// @flow

import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';
import { compose, withState } from 'recompose';
import { withStyles } from 'material-ui/styles';
import { shuffle } from 'lodash';

import Example from './Example';
import Test from './Test';

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  optimState: {
    position: 'fixed',
    top: '50px',
    left: '10px'
  }
});

const ActivityRunner = (props: ActivityRunnerPropsT & { classes: Object }) => {
  const {
    activityData,
    classes,
    example,
    setExample,
    type,
    setType,
    dataFn,
    optimState,
    setOptimState
  } = props;
  const { examples, categories } = activityData.config;

  const tests = examples;

  const { progress } = props.data || 0;
  const { recommend } = props.optimizer;

  const nextExample = () => {
    setExample({ spinning: true });
    recommend(0, (err, res) => {
      if (err) {
        console.log('----------ERROR----------');
        console.log(err);
      } else if (res) {
        console.log(res);
        const reco = res.data.msg;
        const newExample = shuffle(examples).find(ex => ex.category === reco);
        setExample(newExample);
        setType('example');
      }
    });
  };

  const nextTest = () => {
    dataFn.numIncr(1, 'progress');
    setExample(tests[progress % tests.length]);
    setType('test');
  };

  if (example === null) {
    return (
      <div className={classes.container}>
        <p className={classes.optimState}>
          {JSON.stringify(optimState, null, 2)}
        </p>
        <p>Placeholder for consent form</p>
        <button onClick={nextExample}>I want to participate</button>
      </div>
    );
  }

  if (example.spinning) {
    return (
      <div className={classes.container}>
        <p className={classes.optimState}>
          {JSON.stringify(optimState, null, 2)}
        </p>
        <h1>PLEASE WAIT</h1>
      </div>
    );
  }

  const Comp = { example: Example, test: Test }[type];
  const next = { example: nextTest, test: nextExample }[type];

  return (
    <div className={classes.container}>
      <p className={classes.optimState}>
        {JSON.stringify(optimState, null, 2)}
      </p>
      <Comp
        example={example}
        next={next}
        categories={categories}
        withFeedback
        optimizer={props.optimizer}
      />
    </div>
  );
};

const AR = compose(
  withStyles(styles),
  withState('example', 'setExample', null),
  withState('optimState', 'setOptimState', {
    context: [0, 0, 0, 0],
    item: null,
    result: null
  }),
  withState('type', 'setType', 'example')
)(ActivityRunner);

export default AR;
