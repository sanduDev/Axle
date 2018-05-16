import React, { Component } from 'react';
import { Link } from 'react-router';
import * as $ from 'jquery';
import './style.css';
import { TrackLeftBar } from '../../../Components/trucker/TrackLeftBar'
import TrackRightBar from '../../../Components/trucker/TrackRightBar'
import PubNub from 'pubnub';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../../../Components/trucker/common-actions/shipmentByDriverAction';

 let pubnub = new PubNub({
        publishKey: 'pub-key',
        subscribeKey: 'sub key'
      });

let currentMap,
  centeredLocation = false;

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentShipment: undefined,
      selectesDriverID: undefined,
      shipmentCurrentStatus:''
    }
  }
  getShipmentDetails(driverid) {
    let self = this;
    if(driverid){
    if (!driverid) {
      //  currentMap=undefined
      centeredLocation = false

    }

    pubnub.subscribe({
      channels: ['track-driver-' + driverid],
      withPresence: true,
    });

    pubnub.addListener({
      status: function(statusEvent) {
        console.log('Event',statusEvent)
        if (statusEvent.category === "PNConnectedCategory") {
          var newState = {
            new: 'state'
          };
          pubnub.setState(
            {
              state: newState
            },
            (status) => {

            }
          );
        }
      },
      message: function(data) {
      console.log(data)
        if (data.channel == 'track-driver-' + driverid) {
         // if(data.message[driverid].shipment){
          self.setState({
            shipmentCurrentStatus: data.message[driverid]
          }) 
         
         // }
        }
      }
    });

    this.props.actions.getShipmentByDriver(driverid)
    this.setState({
      selectesDriverID: driverid
    })
    }

  }


  bindMap(nextProps) {
    let avoidedMarkers = 0;

    window.L.RotatedMarker = window.L.Marker.extend({
      options: {
        angle: 0
      },
      _setPos: function(pos) {
        window.L.Marker.prototype._setPos.call(this, pos);
        if (window.L.DomUtil.TRANSFORM) {
          // use the CSS transform rule if available
          this._icon.style[window.L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
        } else if (window.L.Browser.ie) {
          // fallback for IE6, IE7, IE8
          var rad = this.options.angle * window.L.LatLng.DEG_TO_RAD,
            costheta = Math.cos(rad),
            sintheta = Math.sin(rad);
          this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
            costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
        }
      }
    });

    let channel = [];
    if (currentMap) {
      currentMap.remove();
      centeredLocation = false
      if (this.state.selectesDriverID != undefined) {
        if(nextProps.activeShipmentByDriver && nextProps.activeShipmentByDriver.activeShipment && nextProps.activeShipmentByDriver.activeShipment.shipment && nextProps.activeShipmentByDriver.activeShipment.shipment[0]){
        channel.push('pick-up-location')
        channel.push('drop-off-location')
        }
        channel.push('track-driver-' + this.state.selectesDriverID)
      } else {
        if (nextProps.driverList.drivers.data) {
          nextProps.driverList.drivers.data.forEach(function(driver) {
            //if(driver.driver.currentDriverLocation.coordinates[0] != 0 && driver.driver.currentDriverLocation.coordinates[1] != 0){
            channel.push('track-driver-' + driver._id)
            //}
          })


        }
      }

    } else {
      if (nextProps.driverList.drivers.data) {
        nextProps.driverList.drivers.data.forEach(function(driver) {
         // if(driver.driver.currentDriverLocation.coordinates[0] != 0 && driver.driver.currentDriverLocation.coordinates[1] != 0){
          channel.push('track-driver-' + driver._id)
         // }
        })


      }
    }
   
    if (channel.length > 0) {
      //           var directions = new MapboxDirections({
      //   accessToken: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
      //   unit: 'metric',
      //   profile: 'cycling'
      // });
      
      let allMarkers = [];
      currentMap = window.eon.map({
        pubnub: pubnub,
        id: 'Trackmap',
        mbToken: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
        mbId: 'ianjennings.l896mh2e',
        channels: channel,
        rotate: true,
        history: true,
        options: {
          zoomAnimation: true,

        // center: new window.L.LatLng(22.9701593,72.8118599)
        },
        message: function(data) {
          if (data) {
            let allIds = Object.keys(data);
            if (!centeredLocation) {
              //currentMap.setView(data[allIds[allIds.length - 1]].latlng, 7);
              centeredLocation = true;
            }
          }

        },
        marker: function(latlng, data) {
          let markerClass = "";

          if(latlng[0] == 0 && latlng[1] == 0){
            markerClass = 'hideMarker'
          }
          var marker = new window.L.RotatedMarker(latlng, {
            icon: window.L.icon({
              iconUrl: data.uri,
              iconSize: data.size,
              className: markerClass
            })
          });
          marker.bindPopup(data.markerText);
          if(markerClass == ""){
          allMarkers.push(marker);
          
          }
          else{
            avoidedMarkers += 1;
          }
          if (allMarkers.length == (channel.length-avoidedMarkers) && allMarkers.length != 0) {
            var group = new window.L.featureGroup(allMarkers);

            currentMap.fitBounds(group.getBounds());
            setTimeout(()=>{
             currentMap.setZoom(9); 
            })
          }
          return marker;
         // }
        }
      });
      debugger;
      //currentMap.setStyle('mapbox://styles/mapbox/streets-v9');

      channel.forEach(function(id) {
        if (id == "pick-up-location" || id == "drop-off-location") {
          if (nextProps.activeShipmentByDriver && nextProps.activeShipmentByDriver.activeShipment && nextProps.activeShipmentByDriver.activeShipment.shipment && nextProps.activeShipmentByDriver.activeShipment.shipment.length > 0) {
            debugger;
            let currentShipment;
            if(nextProps.activeShipmentByDriver.activeShipment.shipment.length > 0){
            let liveShipment = nextProps.activeShipmentByDriver.activeShipment.shipment.filter((runningShipment)=>{
              return runningShipment.currentStatus != "ACCEPTED";
            });
            if(liveShipment.length>0){
            currentShipment = liveShipment[0]
            }
            else{
              currentShipment = nextProps.activeShipmentByDriver.activeShipment.shipment[0]
            }
            }
            
            let pickUpLocation = {
              'pickUpLocation': {
                latlng: [currentShipment.pickupLocationLat, currentShipment.pickupLocationLong],
                data: {
                  type: 'pickup',
                  uri: '/img/Location%20Map_pickup.svg',
                  size: [20, 20],
                  markerText: currentShipment.pickupCompanyAddress
                }
              }
            }
            let DropOffLocation = {
              'dropOffLocation': {
                latlng: [currentShipment.deliveryLocationLat, currentShipment.deliveryLocationLong],
                data: {
                  type: 'dropoff',
                  uri: '/img/Pin_Map.svg',
                  size: [20, 20],
                  markerText: currentShipment.deliveryCompanyAddress
                }
              }
            }
            let pickDropLocation = {}
            if (id == "pick-up-location") {
              pickDropLocation = pickUpLocation;
            } else if (id == "drop-off-location") {
              pickDropLocation = DropOffLocation
            }

            setTimeout(function() {
              pubnub.publish({
                channel: id,
                message: pickDropLocation
              });
            }, 1000);

          }
        } else {
          let getChannelID = id.split('-');
          let driverDetails = nextProps.driverList.drivers.data.filter(function(driver) {
            return driver._id == getChannelID[2];
          });
          if (driverDetails.length > 0) {
            let location = {
              [getChannelID[2]]: {
                latlng: [driverDetails[0].driver.currentDriverLocation.coordinates[1], driverDetails[0].driver.currentDriverLocation.coordinates[0]],
                data: {
                  type: 'truck',
                  uri: '/img/truck.png',
                  size: [13, 50],
                  markerText: driverDetails[0].name
                }

              }
            }
            setTimeout(function() {
              pubnub.publish({
                channel: 'track-driver-' + getChannelID[2],
                message: location
              });
            }, 1000);
          }


        // setTimeout(function() {
        //     var firstpolyline = new window.L.Polyline(pointList, {
        //         color: 'red',
        //         weight: 3,
        //         opacity: 0.5,
        //         smoothFactor: 1
        //     });
        //     console.log(map)
        //     firstpolyline.addTo(currentMap);
        // }, 2000);
        }

      })

    }
    else {
      // window.L.mapbox.accessToken = 'pk.eyJ1Ijoibml0czcwMjkiLCJhIjoiY2o1a3licW45MGJ0YjMzcXNxMW9vMW53NiJ9.bm_YZoiIy3YGiPoztMLtGg';
      //     mapBreadcrumb = window.L.mapbox.map('Trackmap', 'mapbox.streets');
      currentMap = window.eon.map({
        pubnub: pubnub,
        id: 'Trackmap',
        mbToken: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
        mbId: 'mapbox.streets',
        channels: ['test123'],
        options: {
          zoomAnimation: true,
          center: new window.L.LatLng(36.20737,-104.7782892)
        }
      });
      //currentMap.setView([36.20737,-104.7782892], 7);
    }
  }
  componentWillReceiveProps(nextProps) {
    debugger;
    if(nextProps.activeShipmentByDriver && nextProps.activeShipmentByDriver.activeShipment && nextProps.activeShipmentByDriver.activeShipment.shipment && nextProps.activeShipmentByDriver.activeShipment.shipment[0]){
      let shipmentStatus;
      let liveShipment = nextProps.activeShipmentByDriver.activeShipment.shipment.filter((runningShipment)=>{
              return runningShipment.currentStatus != "ACCEPTED";
            });
            if(liveShipment.length>0){
              shipmentStatus = liveShipment[0].currentStatus
            }
            else{
              shipmentStatus = nextProps.activeShipmentByDriver.activeShipment.shipment[0].currentStatus
            }
      this.setState({
        shipmentCurrentStatus: shipmentStatus
      })
    }
    this.bindMap(nextProps)
  }

  componentDidMount() {
    // this.props.actions.getActiveLoadList()
  }

  componentDidMount() {
    $('#Trackmap').css('height',window.innerHeight-$('nav').height()-5)
  }

  render() {
    debugger;
    let self = this;
    let activeShipmentByDriver = this.props.activeShipmentByDriver;
    let liveShipment;
    if(activeShipmentByDriver && activeShipmentByDriver.activeShipment && activeShipmentByDriver.activeShipment.shipment && activeShipmentByDriver.activeShipment.shipment.length>0){
      let filterShipment = activeShipmentByDriver.activeShipment.shipment.filter((allShipment)=>{
        return allShipment.currentStatus != 'ACCEPTED';
      })
      if(filterShipment.length>0){
      liveShipment = filterShipment[0];
      }
      else{
        liveShipment = activeShipmentByDriver.activeShipment.shipment[0];
      }
    }
    return ( <
      div >
                <
      TrackLeftBar selectDriver = {
      (id) => self.getShipmentDetails(id)
      }
      /> <
      div className = "shipment-detail col-md-7 no-padding" > {
        // activeShipmentByDriver && activeShipmentByDriver.activeShipment && activeShipmentByDriver.activeShipment.driver ?
        //   <div id="map"></div>
        //   : null
      } <
      div id = "Trackmap" > < /div>

                <
      /div> {
      activeShipmentByDriver && activeShipmentByDriver.activeShipment && activeShipmentByDriver.activeShipment.shipment && activeShipmentByDriver.activeShipment.shipment[0] ?
        <
        TrackRightBar shipmentDetails = {
        activeShipmentByDriver && activeShipmentByDriver.activeShipment && activeShipmentByDriver.activeShipment.shipment ? liveShipment : undefined
        }
        shipmentStatus={self.state.shipmentCurrentStatus}
        /> :
        <div className="shipment-detail col-md-3 no-padding no-border">
        <div className="col-sm-12 track-progress-bar no-padding">
          <div className="col-sm-4">
          </div>
          <div className="col-sm-8">Select Driver to See Load</div>
        </div>
        <div className="">
        <div className="">
        <h3 className="track-info-msg text-center">IN ORDER TO TRACK, DRIVER MUST DOWNLOAD APP AND LOGIN WITH CREDENTIALS SENT TO HIS PHONE</h3>
        </div>
        </div>
      </div>
      }

            <
      /div>
      );
  }
}

function mapStateToProps(state) {
  return {
    activeShipmentByDriver: state.shipmentByDriverReducer,
    driverList: state.AllDriverReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Track);
