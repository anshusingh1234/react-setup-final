import React, {Fragment, useState, useEffect } from 'react';
import { getPageNo } from "../helpers/helpers";
import Loader from '../components/Common/Loader';
import { useContext } from 'react';
import authContext from './authContext';

export const Pagination = React.memo(function(props){
    const context = useContext(authContext);
    const [loading , setloading ] = useState(false);
    const type = props.type || ''; 
    useEffect(() => {
        window['page'+type] = getPageNo(props.pathname);
        initiateObserver();
	}, [])

	const initiateObserver = () => {
        Util.Observe('.pagination-loader'+type,400, ()=>{
            loadMoreItems(props);
        });
	}

	const loadMoreItems = (props) => {
        if(!loading){
            setloading(true);
            let params = props.actionParams;
            params.page = window['page'+type] + 1;

            props.loadMoreAction && props.loadMoreAction(params).then(()=>{
                window['page'+type] = params.page;
                context.sendAnalytics({type:'pageviews'});
                setPagination(props);
                setloading(false);
                initiateObserver();
            })
        }
    }

    const setPagination = (props) => {
        if(props.pagination){
            //console.log(props)
        }
    }
    
    return(
		<Fragment>
            {props.children}
            <div className="clearfix"></div>
            {props.isPaginate && <Fragment>{(!loading) ? <div className={"pagination-loader"+type} style={{height:2}}></div> : <Fragment>{props.loaderComponent ? props.loaderComponent : <Loader style={{padding: '15% 40%'}}/>}</Fragment>}</Fragment>}
		</Fragment>
	)
});