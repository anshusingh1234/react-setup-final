import React, { PureComponent, Fragment, Component, useEffect, useState, useContext } from 'react';
import Loader from "./Common/Loader"
import ErrorBoundary from "./../helpers/ErrorBoundry";

const Home = React.memo(function Home(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

	return (
		<div className="home-container">
      <div className="row">
        <div className="col-4">
            <Attributes {...props}/>
        </div>
        <div className="col-8">
          <div className="time-filter row">
            <div className="col-2"/>
            <div className="col-4">
              <div class="input-group">
                <input type="text" class="form-control"/>
                <div class="input-group-append">
                  <span class="input-group-text"><img src="images/calendar-icon.png"/></span>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div class="input-group">
                <input type="text" class="form-control"/>
                <div class="input-group-append">
                  <span class="input-group-text"><img src="images/calendar-icon.png"/></span>
                </div>
              </div>
            </div>
            <div className="col-2"/>
          </div>
          <Graph {...props}/>
        </div>
      </div>
		</div>
	)
})

const Attributes = (props) =>{
  return(
    <Fragment>
      <div className="attrib first">
        <div className="label">History Length</div>
        <div className="attrib-val">
          <select name="">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div className="attrib">
        <div className="label">Horizon(s)</div>
        <div className="attrib-val">
          <select name="">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div className="attrib">
        <div className="label">Lag</div>
        <div className="attrib-val">
          <select name="">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
      <div className="attrib">
        <button className="predict-btn">Predict</button>
      </div>
    </Fragment>
  )
}


const Graph = (props) =>{

  if(typeof document !== 'undefined'){
    const CanvasJSReact = require('./../helpers/canvasjs.react');
    var CanvasJSChart = CanvasJSReact.default.CanvasJSChart;

    let options = {
      theme: "dark1",
      title: {
        text: ""
      },
      animationEnabled: true,
	    zoomEnabled: true,
      data: [{				
        type: "area",
        dataPoints: []
      }]
    }
    addDataPoints(1000); 

    function addDataPoints (noOfDps) {
      var xVal = options.data[0].dataPoints.length + 1, yVal = 100;
      for(var i = 0; i < noOfDps; i++) {
        yVal = yVal +  Math.round(5 + Math.random() *(-5-5));
        options.data[0].dataPoints.push({x: xVal,y: yVal});	
        xVal++;
      }
    }
    
    return(
      <div className="home-graph">
        <CanvasJSChart options = {options}/>
      </div>
    )
  }
  else return null;
  
}

export default Home;