import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import { createUrl } from './helpers';


const Metadata = (props) => {
	if(typeof props.seo !== 'undefined' && typeof props.seo !== 'undefined'){
		let seodata = props.seo;
		//console.log(seodata);
		let seometa = [];
		let linkUrl = [];

		if(typeof seodata !== 'undefined'){
			if(seodata.keyword)
				seometa.push(<meta name="keywords" content={seodata.keyword} key={0}/>);

			if(seodata.description)
				seometa.push(<meta name="description" content={seodata.description} key={1}/>);

			if(seodata.social_title){
				seometa.push(<meta property="og:title" content={seodata.social_title} key={2}/>);
				seometa.push(<meta property="twitter:title" content={seodata.social_title} key={3}/>);
			}
				
			if(seodata.social_description){
				seometa.push(<meta property="og:description" content={seodata.social_description} key={4} />);
				seometa.push(<meta property="twitter:description" content={seodata.social_description} key={5}/>);
			}else if(seodata.description){
				seometa.push(<meta property="og:description" content={seodata.description} key={4} />);
				seometa.push(<meta property="twitter:description" content={seodata.description} key={5}/>);
			}

			if(seodata.media && seodata.media.media_path){
				seometa.push(<meta property="og:image" content={createUrl(seodata.media.media_path, 'imageUrl')} key={6}/>);
				seometa.push(<meta property="twitter:image" content={createUrl(seodata.media.media_path, 'imageUrl')} key={7}/>);
			}
				
			if(seodata.media && seodata.media.media_metadata){
				if(seodata.media.media_metadata.width)
					seometa.push(<meta property="og:image:width" content={seodata.media.media_metadata.width} key={8}/>)
				if(seodata.media.media_metadata.height)
					seometa.push(<meta property="og:image:height" content={seodata.media.media_metadata.height} key={9}/>);
			}	
			
			if(seodata.time_data){
				if(seodata.time_data.publish_date)
					seometa.push(<meta property="article:published_time" content={seodata.time_data.publish_date} key={10}/>);

				if(seodata.time_data.modified_date)
					seometa.push(<meta property="article:modified_time" content={seodata.time_data.modified_date} key={11}/>);
			}
			if(typeof seodata.canonical !== 'undefined' && seodata.canonical != ''){
				linkUrl.push(<link rel="canonical" href={createUrl(seodata.canonical)} key={0}/>);
			}
			if(typeof seodata.url !== 'undefined' && seodata.url != ''){
				seometa.push(<meta property="og:url" content={createUrl(seodata.url)} key={12}/>);
				//linkUrl.push(<link rel="alternate" href={createUrl(seodata.url, 'canonical')} hreflang={"en-"+seodata.locale.locale_label} key={1}/>);
			}
				
			if(typeof seodata.is_amp !== 'undefined' && seodata.is_amp == 1){
				linkUrl.push(<link rel="amphtml" href={createUrl(getAMPURL(seodata.url, seodata.locale))} key={13}/>);
			}
			
			if(typeof seodata.alternate !== 'undefined'){
				linkUrl.push(<link rel="alternate" href={createUrl(seodata.alternate)} key={14}/>);
			}

			if(typeof seodata.robots !== 'undefined'){
				seometa.push(<meta name="robots" content={seodata.robots} key={15}/>);
			}

			if(typeof seodata.preconnect !== 'undefined'){
				for (let index = 0; index < seodata.preconnect.length; index++) {
					linkUrl.push(<link rel="preconnect" href={seodata.preconnect[index]} key={15+index}/>);
				}
			}

			return (
				<Helmet>
					<title>{seodata.title}</title>
					{seometa}
					{linkUrl}
				</Helmet>
			)
		}else{
			return null;
		}
	}
	return null;
}
export default Metadata;