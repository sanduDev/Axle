import { GET_SHIPMENT_BY_DRIVER } from './constants';
import { HTTP, getStorage } from '../../../services';
import { asyncActionNames, buildAsyncActions } from '../../../Components/Common/GlobalActionCreators';
// creating action names and action creator
const getShipmentByDriverActionNames = asyncActionNames(GET_SHIPMENT_BY_DRIVER);
const getShipmentByDriverActionCreators = buildAsyncActions(getShipmentByDriverActionNames);


export function getShipmentByDriver(id) {
  let url = 'carrier/getDriverLocation/' + id;

  return function(dispatch) {
    HTTP('get', url, null, {
      'authorization': getStorage('token'),
    })
      .then((result) => {
        debugger;
        dispatch(getShipmentByDriverActionCreators.success(result.data));
      })
      .catch((error) => {
      });
  }
}
