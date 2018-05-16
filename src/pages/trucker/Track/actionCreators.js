import { notify } from 'react-notify-toast';
import { GET_ACTIVE_LOADS } from './constants';
import { HTTP, getStorage } from '../../../services';
import { asyncActionNames, buildAsyncActions } from '../../../Components/Common/GlobalActionCreators';
import jsonToQueryParams from '../../../Components/Common/jsonToQueryParams'
// creating action names and action creator
const getActiveLoadsActionNames = asyncActionNames(GET_ACTIVE_LOADS);
const getActiveLoadsActionCreators = buildAsyncActions(getActiveLoadsActionNames);


export function getActiveLoadList(params) {
  let url = 'carrier/assignedShipment';
  url = params ? url + "?" + jsonToQueryParams(params) : url;

  return function(dispatch) {
    HTTP('get', url, null, {
      'authorization': getStorage('token')
    })
      .then((result) => {
        dispatch(getActiveLoadsActionCreators.success(result.data.data));
      })
      .catch((error) => {
        if (error.message) {
          console.log(error.message);
        } else {
          notify.show('something went wrong, please try again', 'error');
        }
      });
  }
}
