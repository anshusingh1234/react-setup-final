import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import config from "../../config/index"
import AuthContext from "../helpers/authContext";
import Header from "../components/partials/header";
import Footer from "../components/partials/footer";
import Global from "../components/partials/global";
import Metadata from '../helpers/metadata';

class App extends Component {
	static fetching(ssr) {
		return [
		
		];
	}

	constructor(props) {
		super(props);
		this.state = {
			status: props.status,
			serverRequest: props.serverRequest,
			mobile: {
        isMobile: props.isMobile,
      }
		}
	}

	componentDidMount(){}

	componentWillReceiveProps(nextProps){}

	changeServerStatus(){
		this.setState({serverRequest: false})
	}

	scrollTop(divId = ''){
		if(divId) document.getElementById(divId).scrollTo(0, 0);
		setTimeout(()=>{
			window.scrollTo(0, 0);
		}, 500)
	}

	getSEOData(){
		let seometa = {};
		return seometa;
	}

	render() {
		const Routes = this.props.route.routes;
		let header = <Header {...this.props}/>
    let global = <Global {...this.props}/>
    let footer = <Footer {...this.props}/>

		return ( 
			<Fragment>
				<Metadata seo={this.getSEOData()}/>
				<AuthContext.Provider value={{
					scrollTop: this.scrollTop.bind(this),
					serverRequest: this.state.serverRequest,
				}}>
					<Fragment>
						<div>
							{header}
							{renderRoutes(Routes, {mobile: this.state.mobile, serverRequest: this.state.serverRequest, changeServerStatus: this.changeServerStatus.bind(this)})}
							{global}
							{footer}
						</div>
					</Fragment>
				</AuthContext.Provider>
			</Fragment>
		)
	}
}

const mapStateToProps = (state) => ({
	
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(App);