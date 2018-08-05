// @flow

import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './style';

const Test = props => {
  const {
    example,
    categories,
    next,
    classes,
    submitResult,
    config,
    skip
  } = props;
  const onClick = category => {
    submitResult(category === example.category ? 1 : 0);
    next();
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
        {[...categories, 'Skip'].map(category => (
          <Button
            key={category}
            color="primary"
            variant="raised"
            onClick={() => onClick(category)}
            className={classes.button}
          >
            {config.answers[config.categories.indexOf(category)] || category}
          </Button>
        ))}
      </CardActions>
      {skip && (
        <CardActions>
          <Button size="small" onClick={skip} style={{ marginLeft: 'auto' }}>
            I don't know anything, skip the test
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default withStyles(styles)(Test);
