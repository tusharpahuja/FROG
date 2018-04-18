// @flow

import * as React from 'react';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = () => ({
  card: {
    width: 400
  },
  media: {
    height: 400
  },
  next: {
    marginLeft: 'auto'
  }
});

const Example = ({ example, next, classes }) => (
  <Card className={classes.card}>
    <CardMedia className={classes.media} image={example.url} title="Example" />
    <CardContent>
      <Typography gutterBottom variant="headline" component="h2">
        {example.category}
      </Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" onClick={next} className={classes.next}>
        Next
      </Button>
    </CardActions>
  </Card>
);

export default withStyles(styles)(Example);
