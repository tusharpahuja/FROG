// @flow

import * as React from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import { compose, withState } from 'recompose';
import { withStyles } from 'material-ui/styles';
import { shuffle } from 'lodash';

import Example from '../Components/Example';
import Test from '../Components/Test';

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
});

const ActivityRunner = (props: ActivityRunnerT & { classes: Object }) => {
  const { activityData, classes, example, setExample, type, setType } = props;
  const { examples, categories } = activityData.config;
  const { recommend, report } = props.optimizer;

  const next = () => {
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
        setType(type === 'example' ? 'test' : 'example');
      }
    });
  };

  if (example === null) {
    return (
      <div className={classes.container}>
        <p>Placeholder for consent form</p>
        <button onClick={next}>
          I want to participate
        </button>
      </div>
    );
  }

  if (example.spinning) {
    return (
      <div className={classes.container}>
        <h1>PLEASE WAIT</h1>
      </div>
    );
  }



  const Comp = { example: Example, test: Test }[type];

  return (
    <div className={classes.container}>
      <Comp
        example={example}
        next={next}
        categories={categories}
        withFeedback
      />
    </div>
  );
};

const AR = compose(
  withState('example', 'setExample', null),
  withState('type', 'setType', 'example')
)(ActivityRunner);

export default withStyles(styles)(AR);
