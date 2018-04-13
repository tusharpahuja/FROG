// @flow

import { type ActivityPackageT } from 'frog-utils';

import config from './config';
import dashboard from './Dashboard';
import ActivityRunner from './ActivityRunner';

const meta = {
  name: 'Induction',
  shortDesc: 'Reasoning by induction',
  description:
    "The student has an image that corresponds to the concept he needs to define an one that doens't and he has to check the rules that fit the concept.",
  exampleData: [
    {
      title: 'SET',
      config: {
        categories: ['SET!', 'Not SET'],
        properties: [],
        examples: [ {
          url: 'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img000.png',
          category: 'SET',
          properties: '0'
        },{
          url: 'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img111.png',
          category: 'SET',
          properties: '0'
        },{
          url: 'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img012.png',
          category: 'SET',
          properties: '0'
        },
        ]
      }
    },
    {
      title: 'Elephants',
      config: {
        categories: ['Asian', 'African'],
        properties: [],
        examples: [ {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Elephas_maximus_%28Bandipur%29.jpg/1280px-Elephas_maximus_%28Bandipur%29.jpg',
            category: 'Asian',
            properties: '0'
          },{
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/ELEPHANT_IN_MUDUMALAI.jpg/220px-ELEPHANT_IN_MUDUMALAI.jpg',
            category: 'Asian',
            properties: '0'
          },{
            url: 'https://news.nationalgeographic.com/content/dam/news/photos/000/306/30651.ngsversion.1421960098780.adapt.1900.1.jpg',
            category: 'African',
            properties: '0'
          }
        ]
      }
    }
  ]
};
// exampleData is currently broken

export default ({
  id: 'ac-induction',
  type: 'react-component',
  config,
  meta,
  ActivityRunner,
  dashboard
}: ActivityPackageT);
