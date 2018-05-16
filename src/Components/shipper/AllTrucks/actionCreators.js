import { GET_ALLTRUCKS } from './constants';
import { HTTP,getStorage } from '../../../services';

import { asyncActionNames, buildAsyncActions } from '../../Common/GlobalActionCreators';

// creating action names and action creator
const actionNames = asyncActionNames(GET_ALLTRUCKS);
const actionCreators = buildAsyncActions(actionNames);

export function getAllTracks(formData) {
 const url = 'shipment/getOngoingShipment';
  return function(dispatch) {
    // we can dispatch progress
    HTTP('get', url, null,
    {'Authorization': getStorage('token')})
      .then((result) => {
        console.log("Response: ", result);
        dispatch(actionCreators.success(result.data.data));
      })
      .catch((error) => {
         console.log(error.message);
         dispatch(actionCreators.failure(error))
      });
  }
}
