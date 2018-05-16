import { notify } from 'react-notify-toast';
import { LIST_ALL_DRIVER } from './constants';
import { HTTP, getStorage } from '../../../services';
import { asyncActionNames, buildAsyncActions } from '../../../Components/Common/GlobalActionCreators';
import jsonToQueryParams from '../../../Components/Common/jsonToQueryParams'
// creating action names and action creator
const listAllDriverActionNames = asyncActionNames(LIST_ALL_DRIVER);
const listAllDriverActionCreators = buildAsyncActions(listAllDriverActionNames);

export function listAllDriver(params) {
  let url = 'carrier/getAllDriver';
  url = params ? url + "?" + jsonToQueryParams(params) : url;
  debugger;
  return function(dispatch) {
    HTTP('GET', url, null, {
      'authorization': getStorage('token')
    })
      .then((result) => {
        dispatch(listAllDriverActionCreators.success(result.data.data));
      })
      .catch((error) => {
        if (error.response) {
          notify.show(error.response.data.message, 'error');
        } else {
          notify.show('something went wrong, please try again', 'error');
        }
      });
  }
}
