import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {
  Login,
  Home,
  SignUp,
  Token,
  Forget
} from './Components';
import { Provider } from 'react-redux';
//Routes for shipper

import {
  ShipmentOngoing,
  AllTrucks,
  CreateOrder,
  PickupLocation,
  DeliveryLocation,
  Specification,
  AccountProfile,
  ShipmentConfirm,
  RecentShipment,
  ShipmentPending,
  TermsConditions,
  Policy,
  Otp,
  ShipmentReports
} from './Components/shipper'

import {
  ListCustomer,
  CustomerShipments
} from './Components/Customer';


import ShipmentProcessing from './Components/shipper/ShipmentProcessing';

// import pages from shipper
import { AccountPastShipment } from './pages/shipper/AccountPastShipment';
import { AccountPayment } from './pages/shipper/AccountPayment';
import { EditProfile } from './pages/shipper/EditProfile';
import { AccountContact } from './pages/shipper/AccountContact';
import { AccountReferral } from './pages/shipper/AccountReferral';
import { ConfirmShipment } from './pages/shipper/ConfirmShipment';
import { CarrierApproved } from './pages/shipper/CarrierApproved';
import { CarrierUnApproved } from './pages/shipper/CarrierUnApproved';


//Routes for Trucker

import { Track } from './pages/trucker/Track';
import { TruckAccountPastShipment } from './pages/trucker/TruckAccountPastShipment'
import { TruckShipmentAssigned } from './pages/trucker/TruckShipmentAssigned'

import { TruckAccountDriver } from './pages/trucker/TruckAccountDriver'
import { TruckAccountReferral } from './pages/trucker/TruckAccountReferral'
import { TruckShipmentUnAssigned } from './pages/trucker/TruckShipmentUnAssigned'
import { TruckerAccountPayment } from './pages/trucker/TruckerAccountPayment';
import { AccountContactTrucker } from './pages/trucker/AccountContactTrucker';
import { EditProfileTrucker } from './pages/trucker/EditProfileTrucker';

import CarrierAuthorization from './Components/Common/CarrierAuthorization';

import store from './redux/store';

class Routes extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path='/' component={Home}>
            <IndexRoute component={Login} />
            <Route path='/register' component={SignUp} />
            <Route path='/getresetToken' component={Token} />
            <Route path='/forget' component={Forget} />
            {/* for shipper*/}
            <Route path='/shipment-reports' component={ShipmentReports} />
            <Route path='/shipment-pending' component={ShipmentPending} />
            <Route path='/shipment-ongoing' component={ShipmentOngoing} />
            <Route path='/create-order' component={CreateOrder} />
            <Route path='/pickup-location' component={PickupLocation} />
            <Route path='/specification' component={Specification} />
            <Route path='/delivery-location' component={DeliveryLocation} />
            <Route path='/recent-shipments' component={RecentShipment} />
            <Route path="/shipment" component={AccountPastShipment} />
            <Route path="/shipment-processing" component={ShipmentProcessing} />
            <Route path='/alltrucks' component={AllTrucks} />
            <Route path="/payment" component={AccountPayment} />
            <Route path="/shipment-confirm" component={ShipmentConfirm} />
            <Route path="/edit-profile" component={EditProfile} />
            <Route path="/account-contact" component={AccountContact} />
            <Route path="/profile" component={AccountProfile} />
            <Route path="/referral" component={AccountReferral} />
            <Route path="/confirm-shipment" component={ConfirmShipment} />
            <Route path="/carrier-approved" component={CarrierApproved} />
            <Route path="/carrier-unapproved" component={CarrierUnApproved} />
            <Route path="/terms-conditions" component={TermsConditions} />
            <Route path="/privacy-policy" component={Policy} />
            <Route path="/verify-otp" component={Otp} />
            <Route path="/customers" component={ListCustomer} />


            {/* for trucker */}
            <Route path="/account-driver" component={TruckAccountDriver} />
            <Route path="/account-referral" component={TruckAccountReferral} />
            <Route path='/track' component={Track} />
            <Route path='/truck-account-past-shipment' component={TruckAccountPastShipment} />
            <Route path='/truck-shipment-assigned' component={TruckShipmentAssigned} />
            <Route path='/truck-shipment-unassigned' component={TruckShipmentUnAssigned} />
            <Route path='/truck-account-payment' component={TruckerAccountPayment} />
            <Route path='/truck-account-contact' component={AccountContactTrucker} />
            <Route path='/truck-account-profile' component={EditProfileTrucker} />



            {/* for customer */}
            <Route path="/customer-shipments" component={CustomerShipments} />

          </Route>
        </Router>
      </Provider>
    )
  }
}

export default Routes;
