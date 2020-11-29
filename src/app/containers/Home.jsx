import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import config from "../../config/index";
import Home from "../components/Home"
import AuthContext from "../helpers/authContext";
import { loadBigStory} from "../data/ducks/home/actions";


class HomeContainer extends PureComponent {
	static contextType = AuthContext;
	static fetching( ssr ) {
		let storeData = ssr.getState();
		return [
			//ssr.dispatch(loadAMPTrail()),
			
		];
	}

	constructor(props) {
		super(props);
		this.state = {
			loading:false
		}
	}

	componentDidMount() {}



	render() {
    return (
      <div className="text-center">
        <Home {...this.props} loading={this.state.loading}/>
      </div>
    )
	}

};

const mapStateToProps = (state) => ({
	home: state.home
});

const mapDispatchToProps = {
	loadBigStory
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);