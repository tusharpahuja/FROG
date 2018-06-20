// @flow

import * as React from 'react';
import { withState } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
import Card, { CardActions, CardContent } from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import styles from './style';

const Feedback = ({ correct, next, classes }) => (
  <React.Fragment>
    <CardContent>
      <Typography paragraph variant="body1">
        {(correct && 'Bravo, you are right!') || 'Uh oh, that was incorrect!'}
      </Typography>
    </CardContent>
    <CardActions>
      <Button
        key="idk"
        color="primary"
        onClick={next}
        className={classes.button}
      >
        Next
      </Button>
    </CardActions>
  </React.Fragment>
);

const StatelessTest = props => {
  const {
    example,
    withFeedback,
    categories,
    next,
    classes,
    reportScore,
    feedback,
    setFeedback,
    config
  } = props;
  const onClick = category => {
    const correct = category === example.category ? 1 : 0;
    const expected = example.category;
    reportScore(correct);
    setFeedback({ selected: category, expected, correct });

    if (!withFeedback) {
      next();
    }
  };

  const getButtonStyle = category => {
    if (!feedback) {
      return {};
    } else if (category === example.category) {
      return { backgroundColor: green[700], color: 'white' };
    } else if (category === feedback.selected) {
      return { backgroundColor: red[700], color: 'white' };
    }
  };

  return (
    <Card className={classes.card}>
      <div className={classes.media}>
        <img src={example.url} className={classes.image} alt="example" />
      </div>
      <CardContent>
        <Typography gutterBottom variant="headline" component="h3">
          {config.question}
        </Typography>
      </CardContent>
      <CardActions>
        {categories.map(category => (
          <Button
            key={category}
            color="primary"
            variant="raised"
            onClick={() => onClick(category)}
            className={classes.button}
            disabled={!!feedback}
            style={getButtonStyle(category)}
          >
            {config.answers[config.categories.indexOf(category)] || category}
          </Button>
        ))}
      </CardActions>
      <Collapse in={!!feedback} timeout="auto" unmountOnExit>
        <Feedback {...feedback} next={next} classes={classes} />
      </Collapse>
    </Card>
  );
};

const Test = withState('feedback', 'setFeedback', null)(StatelessTest);

export default withStyles(styles)(Test);
