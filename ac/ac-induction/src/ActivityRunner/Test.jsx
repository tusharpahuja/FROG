// @flow

import * as React from 'react';
import { withState } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Collapse from 'material-ui/transitions/Collapse';

const styles = () => ({
  card: {
    width: 400
  },
  media: {
    height: 400
  },
  button: {
    margin: 'auto'
  }
});

const Feedback = ({ correct, expected, next, classes }) => (
  <React.Fragment>
    <CardContent>
      <Typography paragraph variant="body1">
        {correct
          ? 'Bravo, you are right!'
          : 'The correct answer was ' + expected}
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
    feedback,
    setFeedback
  } = props;
  const { report } = props.optimizer
  const onClick = category => {
    const correct = category === example.category ? 1: 0
    const expected = example.category
    report(0, expected, correct)
    setFeedback({ selected: category, expected, correct });

    if (!withFeedback) {
      next();
    }
  };
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={example.url}
        title="Example"
      />
      <CardContent>
        <Typography gutterBottom variant="headline" component="h3">
          Which category is that example from?
        </Typography>
      </CardContent>
      <CardActions>
        {categories.map(category => (
          <Button
            key={category}
            color="primary"
            onClick={() => onClick(category)}
            className={classes.button}
            variant={feedback && feedback.selected === category? 'raised': 'flat'}
            disabled={!!feedback}
          >
            {category}
          </Button>
        ))}
        <Button
          key="idk"
          color="primary"
          onClick={() => onClick('idk')}
          className={classes.button}
          variant={feedback && feedback.selected === 'idk' ? 'raised': 'flat'}
          disabled={!!feedback}
        >
          I don't know
        </Button>
      </CardActions>
      <Collapse in={!!feedback} timeout="auto" unmountOnExit>
        <Feedback {...feedback} next={next} classes={classes} />
      </Collapse>
    </Card>
  );
};

const Test = withState('feedback', 'setFeedback', null)(StatelessTest);

export default withStyles(styles)(Test);
