// @flow

export default () => ({
  card: {
    width: '100%',
    maxWidth: '500px',
    maxHeight: '100%',
    overflow: 'auto'
  },
  media: {
    position: 'relative',
    height: 0,
    paddingTop: '100%'
  },
  image: {
    position: 'absolute',
    maxWidth: '99%',
    maxHeight: '99%',
    width: 'auto',
    height: 'auto',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  },
  button: {
    margin: 'auto',
    width: '28%'
  }
});
