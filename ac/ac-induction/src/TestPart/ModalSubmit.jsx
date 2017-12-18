// @flow

import React from 'react';
import Modal from 'react-modal';
import { stringToArray, arrayMinus, arrayEquals } from '../ArrayFun';
import ImgBis from '../ImgBis';

import {
  ExDiv,
  ExButton,
  TestCorrectionDiv,
  TestCorrectionCircle
} from '../StyledComponents';

export default ({
  examples,
  properties,
  dataFn,
  data,
  logger,
  nbTestFeedback
}: Object) => {
  const clickHandler = () => {
    logger({ type: 'subPart', value: 'TestFeedback' });
    dataFn.objInsert(false, 'feedbackOpen');
    if (data.indexCurrent === nbTestFeedback - 1) {
      logger({ type: 'part', value: 'TestFeedback' });
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else {
      dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
  };
  const { result, show, propertiesIndex } = data[
    'listIndexTestWithFeedback' + data.indexPart
  ][data.indexCurrent].correction || {
    result: 2,
    show: 0,
    propertiesIndex: []
  };
  return (
    <Modal isOpen={data.feedbackOpen} contentLabel="Modal">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <div>
            <h1>{'Solution : Example n°' + (data.indexCurrent + 1)}</h1>
            <TestCorrectionDiv>
              <TestCorrectionCircle
                style={{
                  backgroundColor:
                    result === 0
                      ? '#00CC00'
                      : result === 1 ? '#FF9933' : '#CC0000'
                }}
              />
              <h3 style={{ marginLeft: '10px' }}>
                {'Your answer is ' +
                  (result === 0
                    ? 'correct'
                    : result === 1 ? 'almost correct' : 'incorrect')}
              </h3>
            </TestCorrectionDiv>
          </div>
          {result < 2 && (
            <div>
              You have selected the following properties :
              <ul>
                {data['listIndexTestWithFeedback' + data.indexPart][
                  data.indexCurrent
                ].selectedProperties.map(x => <li key={x}>{properties[x]}</li>)}
              </ul>
            </div>
          )}
          {result === 2 && (
            <div>
              {'You have selected that this image was ' +
                data['listIndexTestWithFeedback' + data.indexPart][
                  data.indexCurrent
                ].selectedChoice +
                " but it wasn't"}
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            left: '500px'
          }}
        >
          <ImgBis
            url={
              examples[
                data['listIndexTestWithFeedback' + data.indexPart][
                  data.indexCurrent
                ].realIndex
              ].url
            }
          />
        </div>
      </div>
      {result === 1 && (
        <ChooseImg
          {...{ show, propertiesIndex, examples, properties }}
          currentIndex={
            data['listIndexTestWithFeedback' + data.indexPart][
              data.indexCurrent
            ].realIndex
          }
        />
      )}
      <ExDiv style={{ position: 'absolute', bottom: '20px', width: '98%' }}>
        <ExButton className="btn btn-default" onClick={clickHandler}>
          {data.indexCurrent === nbTestFeedback - 1 ? 'Next part' : 'Next test'}
        </ExButton>
      </ExDiv>
    </Modal>
  );
};

const ChooseImg = ({
  show,
  propertiesIndex,
  examples,
  properties,
  currentIndex
}: Object) => {
  const str =
    show === 1
      ? "An image can be part of the concept and contains the property: ' " +
        properties[propertiesIndex[0]] +
        "'"
      : show === 3
        ? "An image can respect the property '" +
          properties[propertiesIndex[0]] +
          "' and not be part of the concept:"
        : "An image can be part of the concept but not respect the  property: '" +
          properties[propertiesIndex[0]] +
          "'";
  const urls = examples
    .filter(
      (y, i) =>
        i !== currentIndex && (show < 3 ? !y.isIncorrect : y.isIncorrect)
    )
    .filter(
      x =>
        show !== 2
          ? arrayMinus(propertiesIndex, stringToArray(x.respectedProperties))
              .length === 0
          : arrayEquals(
              arrayMinus(propertiesIndex, stringToArray(x.respectedProperties)),
              propertiesIndex
            )
    );
  return (
    <div style={{ height: '200px', width: '100%' }}>
      {str}
      <ImgBis
        url={urls.length === 0 ? '/no_image_available.jpeg' : urls[0].url}
        color={show !== 3 ? '#00CC00' : '#CC0000'}
      />
    </div>
  );
};
