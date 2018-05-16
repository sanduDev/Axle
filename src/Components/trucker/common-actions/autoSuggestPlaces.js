import { AUTO_SUGGEST_PLACES } from './constants';
import { HTTP } from '../../../services';
import axios from 'axios';
import { asyncActionNames, buildAsyncActions } from '../../../Components/Common/GlobalActionCreators';
// creating action names and action creator
const autoSuggestPlacesActionNames = asyncActionNames(AUTO_SUGGEST_PLACES);
const autoSuggestPlacesActionCreators = buildAsyncActions(autoSuggestPlacesActionNames);


export function getPlace(searchTerm, driverID) {
  debugger;
  const latlng = searchTerm.join(',');
  console.log('latlng', latlng);
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${latlng}.json?access_token=pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg`;

  return function (dispatch) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url
      })
        .then((result) => {
          result.data.driverID = driverID;
          resolve(result)
          //dispatch(autoSuggestPlacesActionCreators.success(result.data));
        })
        .catch((error) => {
          debugger;
          reject(error);
        });
    })
  }
}

export function getAddress(searchTerm, driverID) {
  const latlng = searchTerm.join(',');
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${latlng}.json?access_token=pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg`;
  return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url
      })
        .then((result) => {
          result.data.driverID = driverID;
          resolve(result)
          //dispatch(autoSuggestPlacesActionCreators.success(result.data));
        })
        .catch((error) => {
          debugger;
          reject(error);
        });
    })
}
