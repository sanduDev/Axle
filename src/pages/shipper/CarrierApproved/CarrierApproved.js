import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CarrierApprovedLeftBar, CarrierReview } from '../../../Components/shipper/';
import * as actionCreators from './actionCreater';
import './style.css';
import { notify } from 'react-notify-toast';
import { Modal } from 'react-bootstrap';
var Loader = require('react-loader');
class CarrierApproved extends Component {

    constructor(props) {
        super(props)
        this.state = {
            carriers: {},
            showReview: false,
            selectedCarrier: {},
            loaded: false
        };
        this.close = this.close.bind(this);
       
    }

    componentDidMount() {
        this.props.actions.getApprovedCarrier();
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.carriers !== undefined) {
            this.setState({
                loaded: true,
                carriers: nextProps.carriers
            })
        }
    }

    onReviewClick(carrier) {
        this.setState({ showReview: true, selectedCarrier: carrier });
    }

    close() {
        this.setState({ showReview: false })
    }

    approveCarrier(cid) {
        this.setState({ showReview: false })
        notify.show('Carrier Already Approved', 'success');
    }

    unapprove(id) {
        let unapprovearr = [];
        this.props.actions.setUnApprove(id);
        // this.props.actions.getApprovedCarrier();
        this.state.carriers.forEach(function (carrier) {
            if (typeof carrier._id !== "undefined" && carrier._id.indexOf(id) === -1) {
                unapprovearr.push(carrier);
            }
        });
        this.setState({ carriers: unapprovearr,showReview: false });
        notify.show('Carrier Unapprove successfully', 'success');
    }

    searchCarrier(mc) {
        let carriers = [];
        this.state.allCarriers.forEach(function (car) {
            if (typeof car.carrier !== 'undefined') {
                let carrierD = car.carrier;
                if (carrierD.MCNumber.toString().toLowerCase().indexOf(mc) !== -1)
                    carriers.push(car);
            }
        });
        this.setState({ carriers: carriers });
    }

    render() {

        var allcarriers = this.state.carriers && Object.keys(this.state.carriers).map(function (carrier, id) {
            let carrierData = this.state.carriers[carrier];
            return <tr key={id}>
                <td>
                    <div>
                        {/*<span className="ship_user_img">
                                    <img alt="img" src="/img/user.jpg" />
                        </span>*/}
                        <span className="carrier_user_img_left">
                            <div className="carrier_user_img_name">{typeof carrierData.carrier !== 'undefined' ? (
                                carrierData.carrier.company_name
                            ) : typeof carrierData.driver !== 'undefined' ? (
                                carrierData.driver.company_name
                            ):''}</div>
                            <div className="carrier_mc">MC#: {typeof carrierData.carrier !== 'undefined' ? (
                carrierData.carrier.MCNumber
              ) :typeof carrierData.driver !== 'undefined' ? (
                                carrierData.driver.MCNumber
                            )  :''
              }</div>
                        </span>
                    </div>
                </td>
                <td className="carrier_mail_text">{carrierData.email}</td>
                <td className="carrier_mail_text">{typeof carrierData.carrier !== 'undefined' ? (
          carrierData.carrier.mobile
        ) : typeof carrierData.driver !== 'undefined' ? (
                                carrierData.driver.mobile
                            )  :''}</td>
                <td className="carrier_mail_text">
                    <div className="col-xs-2">
                        <div className="oval progress-color"></div>
                    </div>
                    <div className="col-xs-10">
                        Load in progress
                                    </div>
                </td>
                <td className="aprroved_edit_delete pt-15 align-text-center">
                    <div className="col-xs-6 clickable">
                        <img src="/img/Pen.svg" alt="Edit mode" onClick={this.onReviewClick.bind(this, carrierData)} />
                    </div>
                    <div className="col-xs-6 clickable">
                        <img src="/img/Trash.svg" alt="Delete mode" onClick={this.unapprove.bind(this, carrierData._id)} />
                    </div>
                </td>
            </tr>
        }.bind(this))
        return (
            <div>
             
                <div className="row">

                    {/*<!-- Left Side Bar -->*/}
                    <div className="col-xs-12 col-sm-12 col-md-2 carrier-approved sidebar-left">
                        <CarrierApprovedLeftBar />
                    </div>
                    {/*<!-- End left side bar -->*/}

                    {/*<!-- Content -->*/}
                       <Loader loaded={this.state.loaded}>
                    <div className="col-xs-12 col-sm-12 col-md-9 mt-27">

                        <div className="table-responsive">

                            <table className="table table-bordered">

                                <tbody>
                                    {allcarriers}
                                </tbody>

                            </table>

                        </div>

                    </div>
                       </Loader>
                    {/*<!-- End content -->*/}

                </div>
                {/*<!-- End content -->*/}
                <Modal show={this.state.showReview} className="modal right" onHide={this.close} id="submit-rating">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body no-padding">
                                {/*<!-- sidenav content -->*/}
                                <CarrierReview close={this.close} detail={this.state.selectedCarrier} onApprove={this.approveCarrier.bind(this)} onUnapprove={this.unapprove.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
           

        )
    }
}

function mapStateToProps(state) {
    return {
        carriers: state.CarrierApprovedReducer.carriers
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarrierApproved);
