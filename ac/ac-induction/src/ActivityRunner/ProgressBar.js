import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    position: 'absolute',
    width: '100%',
    top: '48px',
    display: 'flex'
  },
  bar: {
    width: '33%',
    height: '16px',
    flexGrow: 1
  }
};

const ProgressBar = ({ classes, progress }) => (
  <div className={classes.root}>
    <LinearProgress
      variant="determinate"
      color="secondary"
      value={100 * progress / (3 + 8 + 5 + 8 + 1)}
      className={classes.bar}
    />
  </div>
);

export default withStyles(styles)(ProgressBar);
