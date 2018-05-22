// @flow

import * as React from 'react';
import { withStyles } from 'material-ui/styles';

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

type StateT = {
  progress: number,
  example: ?Object,
  context: {
    examples: number[],
    tests: number[],
    latest: number[]
  },
  type?: string,
  item?: string,
  spinning?: boolean
};

class ActivityRunner extends React.Component<any, StateT> {
  tests: Object[];
  examples: Object[];

  state = {
    progress: -1,
    example: null,
    context: {
      examples: [],
      tests: [],
      latest: []
    }
  };

  constructor(props) {
    super(props);
    const { examples, tests } = props.activityData.config;
    this.tests = tests;
    this.examples = examples;
    this.state.context = {
      examples: examples.map(_ => 0),
      tests: tests.map(_ => 0),
      latest: tests.map(_ => 0)
    };
  }

  nextExample = () => {
    const { optimizer } = this.props;
    this.setState({ spinning: true });
    optimizer.recommend(0, (err, res) => {
      if (err) {
        console.error(err);
      } else if (res) {
        const reco = res.data.msg;
        const idx = parseInt(reco, 10);
        const newExample = this.examples[idx];
        const newContext = { ...this.state.context };
        newContext.examples[idx] += 1;
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
    this.setState({ example: this.tests[newProgress % this.tests.length] });
    this.setState({ type: 'test' });
  };

  reportScore = score => {
    const { optimizer } = this.props;
    const { item, context } = this.state;
    const newContext = { ...context };
    newContext.tests[this.state.progress % this.tests.length] =
      score > 0 ? 1 : -1;
    newContext.latest = this.tests.map(_ => 0);
    newContext.latest[this.state.progress % this.tests.length] =
      score > 0 ? 1 : -1;
    this.setState({ context: newContext });
    optimizer.report(0, item, score);
  };

  render() {
    const { activityData, classes } = this.props;
    const { categories } = activityData.config;
    const { example, spinning, type, progress } = this.state;

    if (!example) {
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

    if (progress > 21) {
      return (
        <div className={classes.container}>
          <pre className={classes.optimState}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
          <h1>Activity Completed !</h1>
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
          config={activityData.config}
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
