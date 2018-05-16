import {
    HTTP,getStorage
} from '../../../services';

import {
    asyncActionNames,
    buildAsyncActions
} from '../../../Components/Common/GlobalActionCreators';

const requestCarrierCountName = asyncActionNames('GET_COUNT_REQUESTED_CARRIER');
const requestCarrierNameCOuntActionCreators = buildAsyncActions(requestCarrierCountName);

export function getCountRequestedCarrier() {
    let url = 'countCarrier/false';
    return function (dispatch) {
        HTTP('get', url, null, {
            'authorization': getStorage('token')
        })
            .then((result) => {
                dispatch(requestCarrierNameCOuntActionCreators.success(result.data.data));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}
