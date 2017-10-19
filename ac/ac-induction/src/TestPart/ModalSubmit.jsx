// @flow

import React from 'react';
import Modal from 'react-modal';

import {
  ExButton,
  TestCorrectionDiv,
  TestCorrectionCircle
} from '../StyledComponents';

export default ({
  //  examples,
  properties,
  dataFn,
  data,
  nbTestFeedback
}: Object) => {
  const clickHandler = () => {
    dataFn.objInsert(false, 'feedbackOpen');
    if (data.indexCurrent === nbTestFeedback - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else {
      dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
  };
  const { result, reason, propertiesIndex } = data.listIndexTestWithFeedback[
    data.indexCurrent
  ].correction || {
    result: 2,
    reason: 'NotAnswered',
    propertiesIndex: []
  };
  return (
    <Modal isOpen={data.feedbackOpen} contentLabel="Modal">
      <h1>{'Solution : Example n°' + (data.indexCurrent + 1)}</h1>
      <TestCorrectionDiv>
        <TestCorrectionCircle
          style={{
            backgroundColor:
              result === 0 ? '#00CC00' : result === 1 ? '#FF9933' : '#CC0000'
          }}
        />
        <h3 style={{ marginLeft: '10px' }}>
          {'Your answer was ' +
            (result === 0
              ? 'correct'
              : result === 1 ? 'almost correct' : 'incorrect')}
        </h3>
      </TestCorrectionDiv>
      <div>
        {'You have selected that this image was: ' +
          (data.listIndexTestWithFeedback[data.indexCurrent].selectedChoice
            ? 'True'
            : 'False')}
      </div>
      <div>
        You have selected the following properties :
        <ul>
          {data.listIndexTestWithFeedback[
            data.indexCurrent
          ].selectedProperties.map(x => <li key={x}>{properties[x]}</li>)}
        </ul>
      </div>
      {result !== 0 && (
        <div>
          {"The reason why it's incorrect is " + reason}
          <br />
          {propertiesIndex !== undefined &&
            propertiesIndex.map(x => <li key={x}>{properties[x]}</li>)}
        </div>
      )}
      <ExButton className="btn btn-default" onClick={clickHandler}>
        {data.indexCurrent === nbTestFeedback - 1 ? 'Next part' : 'Next test'}
      </ExButton>
    </Modal>
  );
};