// @flow

import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ImageReload } from 'frog-utils';

import ToolBar from './ToolBar';

class ImageEditor extends React.Component<*,{status: 'none' | 'line' | 'comment'}>{
  state={
    status: 'none'
  }

  render(){
    console.log(this.state.status)
    return (
      <Paper
        elevation={24}
        style={{
          margin: '20px',
          overflow: 'scroll',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <ToolBar data={this.props.data} dataFn={this.props.dataFn} setStatus={x => this.setState({status: x})} />
        <div
          style={{width: 'fit-content', height: 'fit-content'}}
          onMouseDown={
            e => {
              console.log(e)
              console.log(e.target)
            }
          }
          onMouseUp={
            e => {
              console.log(e)
            }
          }
          >
        {this.props.data.annotations.map(x => <div/>)}
        <ImageReload
          style={{
            margin: '10px',
            width: 'fit-content',
            height: 'fit-content',
            transform: 'rotate(' + (this.props.data.rotation || 0) + 'deg)'
          }}
          src={this.props.data.url}
        />
      </div>
      </Paper>
    )
  }
}

export default ImageEditor
