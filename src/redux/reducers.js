import { combineReducers } from 'redux';

import { HomeReducer,ReportsReducer, TokenReducer, LoginReducer, ShipmentSidebarReducer, ShipmentOngoingReducer, ShipmentPendingReducer, AllTrucksReducer, DriverAddReducer, CreateorderReducer, GetAddressReducer, ProfileReducer, AllDriverReducer, truckTypesReducers, RecentShipmentReducer, shipmentByDriverReducer, CarrierApprovedLeftBarReducer, SubmitRatingReducer, ShipmentInvitedReducer, BulkorderReducer, autoSuggestPlacesReducer } from '../Components/';

import { TrackReducer, UnAssignedShipmentReducer, DriverReducer, PastShipmentReducer, AcceptShipmentReducer, AssignDriverReducer, RejectShipmentReducer, notifyShipperReducer, DeleteDriverProfileReducer } from '../pages/trucker';

import { CarrierApprovedReducer, CarrierUnApprovedReducer,searchUnApprovedReducer, CarrierUnApprovedRequestReducer, CarrierRequestCountReducer } from '../pages/shipper';

export default combineReducers({
  HomeReducer,
  LoginReducer,
  TokenReducer,
  ShipmentSidebarReducer,
  ShipmentOngoingReducer,
  AllTrucksReducer,
  TrackReducer,
  UnAssignedShipmentReducer,
  DriverReducer,
  PastShipmentReducer,
  DriverAddReducer,
  CreateorderReducer,
  GetAddressReducer,
  ProfileReducer,
  AllDriverReducer,
  truckTypesReducers,
  shipmentByDriverReducer,
  autoSuggestPlacesReducer,
  RecentShipmentReducer,
  ShipmentPendingReducer,
  CarrierApprovedReducer,
  CarrierUnApprovedReducer,
  AcceptShipmentReducer,
  AssignDriverReducer,
  RejectShipmentReducer,
  notifyShipperReducer,
  CarrierApprovedLeftBarReducer,
  SubmitRatingReducer,
  DeleteDriverProfileReducer,
  CarrierUnApprovedRequestReducer,
  ShipmentInvitedReducer,
  CarrierRequestCountReducer,
  BulkorderReducer,
  searchUnApprovedReducer,
  ReportsReducer
});
