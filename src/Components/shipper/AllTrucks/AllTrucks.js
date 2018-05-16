import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from './actionCreators';
import './alltruck.css';
import moment from 'moment';
import PubNub from 'pubnub';
import { Link } from 'react-router';
import * as actionDriverPlaceCreators from '../../trucker/common-actions/autoSuggestPlaces';
import { SHIPMENTS_STATUS } from '../../../Components/Common/shipmentStatus'
var Loader = require('react-loader');
let currentMap;
let self;
let countShipments = 0;
let pubnub = new PubNub({
    publishKey: 'pub key',
    subscribeKey: 'sub-key'
});
let channel = [];
let markersLayer;
class AllTrucks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allshipments: {},
            shipments: {},
            selectedShipment: {},
            loads: {},
            searchShipments: {},
            totalTrucks: 0,
            checkClear: false,
            width: 0,
            height: 0,
            loaded: false,
            shipmentCurrentStatus: '',
            driverPlaces: {}
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        // this.createMap = this.createMap.bind(this);

    }

    componentDidMount() {
        this.props.actions.getAllTracks();
        self = this;
        countShipments = 0;
        channel = [];
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    createSimpleMap() {
        var channel = 'pubnub-mapbox';
        currentMap = window.eon.map({
            pubnub: pubnub,
            id: 'truckmap',
            mbToken: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
            mbId: 'ianjennings.l896mh2e',
            channels: [channel]

        });
    }
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight - 54 });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shipments.Shipment !== undefined) {
            let shipmentsWithDriver = [];
            nextProps.shipments.Shipment.forEach(function (driver) {
                if (driver.driver != null) {
                    shipmentsWithDriver.push(driver);
                    console.log(driver);
                   if(driver.driver.driver != null){
                    if (driver.driver.driver.currentDriverLocation.coordinates[0] != 0 && driver.driver.driver.currentDriverLocation.coordinates[1] != 0) {
                        actionDriverPlaceCreators.getAddress(driver.driver.driver.currentDriverLocation.coordinates, driver.driver._id).then((result) => {
                            let objDriverPlaces = self.state.driverPlaces;
                            let city = '';
                            let state = '';
                            result.data.features.forEach((feature) => {
                                if (feature.id.indexOf('place') == 0) {
                                    city = feature.text;
                                }
                                if (feature.id.indexOf('region') == 0) {
                                    state = feature.text;
                                }
                            })
                            objDriverPlaces[result.data.driverID] = city + ', ' + state;
                            self.setState({
                                driverPlaces: objDriverPlaces
                            })
                        })
                    }
                   }
                    
                }


            })
            if (nextProps.shipments.Shipment.length === 0) {
                this.setState({
                    loaded: true,
                    totalTrucks: shipmentsWithDriver.length
                },
                    () => {
                        self.createSimpleMap()
                    }
                )
            } else {
                this.setState({
                    loaded: true,
                    allshipments: shipmentsWithDriver,
                    shipments: shipmentsWithDriver,
                    totalTrucks: shipmentsWithDriver.length
                },
                    () => {
                        self.createMap(shipmentsWithDriver)
                    }
                )
            }

        }
    }

    createMap(ships, selected) {
        console.log('Selected', selected)
        window.L.RotatedMarker = window.L.Marker.extend({
            options: {
                angle: 0
            },
            _setPos: function (pos) {
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
        let allmarkers = [];
        let currentShipment = ships;
        if (currentMap, selected) {
            currentMap.remove();
            channel.push('pick-up-location');
            channel.push('drop-off-location');
        } else {
            currentShipment.forEach(function (driver) {
                channel.push('track-driver-' + driver.driver._id);
            })
        }

        if (channel.length > 0) {
            currentMap = window.eon.map({
                pubnub: pubnub,
                id: 'truckmap',
                mbToken: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
                mbId: 'ianjennings.l896mh2e',
                channels: channel,
                history: true,
                rotate: true,
                options: {
                    zoomAnimation: true,
                },
                message: function (data) {
                    if (data) {


                    }

                },
                marker: function (latlng, data) {
                    console.log(latlng)
                    var marker = new window.L.RotatedMarker(latlng, {
                        icon: window.L.icon({
                            iconUrl: data.uri,
                            iconSize: data.size
                        })
                    });
                    allmarkers.push(marker);
                    console.log(allmarkers.length, countShipments)
                    if (allmarkers.length === countShipments) {
                        var group = new window.L.featureGroup(allmarkers);
                        currentMap.fitBounds(group.getBounds());
                    }
                    marker.bindPopup(data.markerText);
                    return marker;

                }
            });
            if (selected) {

                let pickUpLocation = {
                    ['pick-up-location']: {
                        latlng: [selected.pickupLocationLat, selected.pickupLocationLong],
                        data: {
                            type: 'pickup',
                            uri: '/img/Location%20Map_pickup.svg',
                            size: [20, 20],
                            markerText: selected.pickupCompanyAddress
                        }
                    }
                }
                let DropOffLocation = {
                    ['drop-off-location']: {
                        latlng: [selected.deliveryLocationLat, selected.deliveryLocationLong],
                        data: {
                            type: 'dropoff',
                            uri: '/img/Pin_Map.svg',
                            size: [20, 20],
                            markerText: selected.deliveryCompanyAddress
                        }
                    }
                }

                if (selected.driver != null && selected.driver.driver != null) {

                    console.log('track-driver-' + selected.driver.driver._id)
                    let truckLocation = {
                        [selected.driver._id]: {
                            latlng: [selected.driver.driver.currentDriverLocation.coordinates[1], selected.driver.driver.currentDriverLocation.coordinates[0]],
                            data: {
                                type: 'truck',
                                uri: '/img/truck.png', size: [13, 50],
                                markerText: selected.driver.name
                            }

                        }
                    }
                    setTimeout(function () {
                        pubnub.publish({
                            channel: 'track-driver-' + selected.driver._id,
                            message: truckLocation
                        });
                    }, 1000);
                    countShipments++;//for truck
                }



                setTimeout(function () {
                    pubnub.publish({
                        channel: 'pick-up-location',
                        message: pickUpLocation
                    });
                }, 1000);
                setTimeout(function () {
                    pubnub.publish({
                        channel: 'drop-off-location',
                        message: DropOffLocation
                    });
                }, 1000);
                countShipments = countShipments + 2;
            } else {
                channel.forEach(function (id) {
                    if (id !== "pick-up-location" && id !== "drop-off-location") {
                        let getChannelID = id.split('-');
                        let driverDetails = currentShipment.filter(function (driver) {
                            return driver.driver._id === getChannelID[2];
                        });
                        if (driverDetails[0].driver.driver.currentDriverLocation) {
                            let location = {
                                [getChannelID[2]]: {
                                    latlng: [driverDetails[0].driver.driver.currentDriverLocation.coordinates[1], driverDetails[0].driver.driver.currentDriverLocation.coordinates[0]],
                                    data: {
                                        type: 'truck',
                                        uri: '/img/truck.png', size: [13, 50],
                                        markerText: driverDetails[0].driver.name
                                    }

                                }
                            }
                            setTimeout(function () {
                                pubnub.publish({
                                    channel: 'track-driver-' + getChannelID[2],
                                    message: location
                                });
                            }, 1000);
                            countShipments++;
                        }

                    }
                })
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    selectShipment(ship) {
        countShipments = 0;
        this.setState({
            selectedShipment: ship,
            loads: ship.loadingDetails,
            shipmentCurrentStatus: ship.currentStatus
        }, () => {
            self.createMap(this.state.shipments, ship)
        });
        pubnub.subscribe({
            channels: ['track-driver-' + ship.driver._id],
            withPresence: true,
        });

        pubnub.addListener({
            status: function (statusEvent) {
                console.log('Event', statusEvent)
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
            message: function (data) {
                console.log('Data', data);
                if (data.channel == 'track-driver-' + ship.driver._id) {
                     /* self.setState({
                                 shipmentCurrentStatus: data.message[ship.driver._id]
                        })  */
                }
            }
        });
    }

    searchByRef(event) {
        let shipers = [];
        this.state.allshipments.forEach(function (ship) {
            if (ship.customId.toLowerCase().indexOf(event.target.value) !== -1)
                shipers.push(ship);
        });
        this.setState({ shipments: shipers });

    }

    showAll() {
        currentMap.remove();
        this.createMap(this.state.shipments);
        let markers = [];
        let allmarkers = [];
        let group;
        self.state.shipments && Object.keys(self.state.shipments).map(function (ship, id) {
            let shipData = self.state.shipments[ship];
            if (shipData.driver.driver.currentDriverLocation) {
                markers.push({ lat: shipData.driver.driver.currentDriverLocation.coordinates[1], long: shipData.driver.driver.currentDriverLocation.coordinates[0] });
            }
        });

        markers.forEach(function (mar) {
            let latlng = [mar.lat, mar.long];
            var marker = new window.L.Marker(latlng);
            allmarkers.push(marker)
        })
        group = new window.L.featureGroup(allmarkers);
        currentMap.fitBounds(group.getBounds());

    }
    render() {
        var shipments = this.state.shipments && Object.keys(this.state.shipments).map(function (ship, id) {

            let shipData = this.state.shipments[ship];

            if (shipData.driver != null) {
                return <div><a key={id} className="left_nav truck-left" onClick={this.selectShipment.bind(this, shipData)}>
                    <h4>Ref# {shipData.customId}</h4>
                    <span>{SHIPMENTS_STATUS[shipData.currentStatus]}  {shipData.milesLeft && shipData.milesLeft !== '' ? shipData.milesLeft + ' Miles left' : ''}</span>
                    <div className="track-time-place">
                        {self.state.driverPlaces[shipData.driver._id] ? self.state.driverPlaces[shipData.driver._id] : ''}
                    </div>
                </a>
                    
                </div>
            }

        }.bind(this))

        let shipData = this.state.selectedShipment;
        let loads = this.state.loads;
        return (
            <div>
                <div className="left_side_bar" style={{
                    height: this.state.height + 'px'
                }}>
                    <div className="side_bar_head">
                        <p className="trucks-p">{this.state.totalTrucks} trucks on the road<span className="clear" onClick={this.showAll.bind(this)}>Clear</span></p>

                    </div>
                    <div className="left_nav truck-t">
                        <form>
                            <div className="form-group">
                                <label>Search</label>
                                <input className="inp" type="search" placeholder="Reference #" onChange={this.searchByRef.bind(this)} />
                            </div>
                        </form>
                    </div>
                    <div className="track-single" style={{
                        height: this.state.height - 180 + 'px'
                    }}>
                        {shipments}
                    </div>

                </div>
                <Loader loaded={this.state.loaded}>
                    <main>

                        <div className="all-truck-map">
                            <div id='truckmap' style={{
                                height: this.state.height + 'px'
                            }}></div>
                        </div>
                    </main>
                </Loader>

                <div className="right-side-bar" style={{
                    height: this.state.height + 'px'
                }}>
                    {Object.keys(this.state.shipments).length === 0 ?
                        <form>
                            <div className="recent_order_sec">
                                <div className="btn_grp">
                                    <Link to="/create-order" className="btn button_primary btn_full">Create Your First Order</Link>
                                </div>
                            </div>

                        </form>
                        :
                        <div className="order_cofm">
                            {typeof shipData.currentStatus !== 'undefined' ?
                                <div>
                                    <h2 className="order_cofm_head">{SHIPMENTS_STATUS[this.state.shipmentCurrentStatus]}</h2>
                                    <div className="order_cofm_box right_all_truck" style={{
                                        height: this.state.height - 48 + 'px'
                                    }}>
                                        <div className="order_box_pd">
                                            <div className="order_loc">
                                                <h5><img src="/img/Dot.svg" alt="circle" />Pickup</h5>
                                                <address>
                                                    {shipData.pickupCompanyName}<br />
                                                    {shipData.pickupCompanyAddress},<br />
                                                    {shipData.pickupCity}, {shipData.pickupState}   {shipData.pickupZipcode}<br />
                                                    {moment(shipData.pickupDateTimeFrom).format("MMMM Do YYYY, h:mm a")} {moment(shipData.pickupDateTimeFrom).format("h:mm a") === moment(shipData.pickupDateTimeTo).format("h:mm a") ? '' : '- ' + moment(shipData.pickupDateTimeTo).format("h:mm a")}<br />
                                                    Phone : {shipData.pickupMobile}</address>
                                                <h5><img src="/img/Small Pin.svg" alt="circle" />Drop Off</h5>
                                                <address>
                                                    {shipData.deliveryCompanyName}<br />
                                                    {shipData.deliveryCompanyAddress},<br />
                                                    {shipData.deliveryCity}, {shipData.deliveryState}   {shipData.deliveryZipcode}<br />
                                                    {moment(shipData.deliveryDateTimeFrom).format("MMMM Do YYYY, h:mm a")}<br />
                                                    Phone : {shipData.deliveryMobile}
                                                </address>
                                            </div>
                                        </div>


                                        <div className="order_box_pd">
                                            <table className="ship_table table">
                                                <thead>
                                                    <tr>
                                                        {/*<th>Deadhead</th>*/}
                                                        <th>Price</th>
                                                        <th>Distance</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {/*<td>20mi</td>*/}
                                                        <td>${shipData.lowPrice}</td>
                                                        <td>{shipData.distance}mi</td>

                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className="ship_table table">
                                                <thead>
                                                    <tr>
                                                        <th>Commodity</th>
                                                        <th>Reference #</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{loads.commodity}</td>
                                                        <td>{shipData.customId}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className="ship_table table">
                                                <thead>
                                                    <tr>
                                                        <th>Weight</th>
                                                        <th>Pallets</th>
                                                        <th>Trailer</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{loads.weight}lbs</td>
                                                        <td>{loads.pallets}</td>
                                                        <td>{shipData.truckType}  -{loads.temperature}°</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="order_box_pd">
                                            <div className="msg">
                                                MESSAGES : {shipData.specialComment}<br />
                                                BOL No. : {shipData.bolNumber}<br />
                                                Pickup No. : {shipData.pickupNumber}<br />
                                                Delivery No. : {shipData.deliveryNumber}<br />
                                                PO No. : {shipData.poNumber}<br />
                                                Carrier Company Name: {typeof shipData.carrier !== 'undefined' && shipData.carrier !== null ? shipData.carrier.carrier.company_name : ''}<br />
                                                Email : {typeof shipData.carrier !== 'undefined' && shipData.carrier !== null ? shipData.carrier.email : ''}<br />
                                                Mobile : {typeof shipData.carrier !== 'undefined' && shipData.carrier !== null ? shipData.carrier.mobile : ''}<br />
                                                <span>{moment(shipData.createdAt).format("MMMM Do YYYY | h:mm a")}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                :
                                <h2 className="order_cofm_head">Select a Truck</h2>
                            }
                        </div>
                    }

                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actionCreators, dispatch) }
}

function mapStateToProps(state) {
    return {
        shipments: state.AllTrucksReducer.alltrucks
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllTrucks);
