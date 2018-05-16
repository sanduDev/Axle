import { DRIVER_SHIPMENT_LOG } from './constants';
import { HTTP, getStorage } from '../../../services';
import { asyncActionNames, buildAsyncActions } from '../../../Components/Common/GlobalActionCreators';
// creating action names and action creator
const DriverShipmentLogActionNames = asyncActionNames(DRIVER_SHIPMENT_LOG);
const DriverShipmentLogActionCreators = buildAsyncActions(DriverShipmentLogActionNames);


export function DriverShipmentLog(shipmentId) {
  let url = 'shipment/getShipmentRouteDetails/' + shipmentId;

  return function(dispatch) {
      return new Promise((resolve, reject) => {
          HTTP('get', url, null, {
      'authorization': getStorage('token'),
    })
      .then((result) => {
          resolve(result)
      })
      .catch((error) => {
          reject(error);
      });
      })
    
  }
}
