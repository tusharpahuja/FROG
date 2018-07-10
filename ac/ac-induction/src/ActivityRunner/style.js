// @flow

export default () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    maxHeight: '100%',
    overflow: 'auto'
  },
  prompt: {
    width: '100%',
    maxWidth: '350px',
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
  },
  promptButton: {
    marginLeft: 'auto'
  }
});
