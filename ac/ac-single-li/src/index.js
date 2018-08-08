// @flow

import { type ActivityPackageT, uuid, ProgressDashboard } from 'frog-utils';

const meta = {
  name: 'Add/edit single LI',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Testing li image',
      config: { title: 'Example image li', liType: 'li-image' },
      data: {li: "cjkl9rpns00033g6jqv2z852s"}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Title' },
    instructions: { type: 'string', title: 'Instructions' },
    liType: {
      title: 'Learning Item Type',
      type: 'learningItemType'
    },
    allowEditing: {
      title: 'Allow editing after submission',
      default: true,
      type: 'boolean'
    }
  }
};

const formatProduct = (_, product) => {
  const id = uuid();
  return product.li ? { [id]: { id, li: product.li } } : {};
};

const configUI = { instructions: { 'ui:widget': 'textarea' } };

const dataStructure = {};

const mergeFunction = (object, dataFn) => {
  if(object.data)
    dataFn.objInsert(object.data.li,'li')
}

export default ({
  id: 'ac-single-li',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  mergeFunction,
  configUI,
  formatProduct,
  dashboards: { progress: ProgressDashboard },
  dataStructure
}: ActivityPackageT);
