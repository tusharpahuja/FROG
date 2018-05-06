// @flow

import * as React from 'react';
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

const N_TESTS = 5;

class ActivityRunner extends React.Component {
  state = {
    progress: -1,
    example: null,
    context: null
  };

  constructor(props) {
    super(props);
    const { examples } = props.activityData.config;
    this.tests = examples.slice(0, N_TESTS);
    this.examples = examples.slice(N_TESTS);
    this.state.context = examples.map(_ => 0);
  }

  nextExample = () => {
    const { optimizer } = this.props;
    this.setState({ spinning: true });
    optimizer.recommend(0, (err, res) => {
      if (err) {
        console.log('----------ERROR----------');
        console.log(err);
      } else if (res) {
        console.log(res);
        const reco = res.data.msg;
        const [newExample, idx] = shuffle(
          this.examples.map((x, i) => [x, i])
        ).find(ex => ex[0].category === reco);
        const newContext = [...this.state.context];
        newContext[N_TESTS + idx] += 1;
        this.setState({ context: newContext });
        this.setState({ example: newExample });
        this.setState({ type: 'example' });
        this.setState({ item: reco });
        this.setState({ spinning: false });
      }
    });
  };

  nextTest = () => {
    const newProgress = this.state.progress + 1;
    this.setState({ progress: newProgress });
    this.setState({ example: this.tests[newProgress % N_TESTS] });
    this.setState({ type: 'test' });
  };

  reportScore = score => {
    const { optimizer } = this.props;
    const { item } = this.state;
    const newContext = [...this.state.context];
    newContext[this.state.progress % N_TESTS] = score > 0 ? 1 : -1;
    this.setState({ context: newContext });
    optimizer.report(0, item, score);
  };

  render() {
    console.log(this.state);

    const { activityData, classes } = this.props;
    const { categories } = activityData.config;

    const { example, spinning, type } = this.state;
    if (example === null) {
      return (
        <div className={classes.container}>
          <pre className={classes.optimState}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
          <p>Placeholder for consent form</p>
          <button onClick={this.nextExample}>I want to participate</button>
        </div>
      );
    }

    if (spinning) {
      return (
        <div className={classes.container}>
          <pre className={classes.optimState}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
          <h1>PLEASE WAIT</h1>
        </div>
      );
    }

    const Comp = { example: Example, test: Test }[type];
    const next = { example: this.nextTest, test: this.nextExample }[type];

    return (
      <div className={classes.container}>
        <pre className={classes.optimState}>
          {JSON.stringify(this.state, null, 2)}
        </pre>
        <Comp
          example={example}
          next={next}
          categories={categories}
          withFeedback
          optimizer={this.props.optimizer}
          reportScore={this.reportScore}
        />
      </div>
    );
  }
}

const AR = withStyles(styles)(ActivityRunner);

export default AR;
