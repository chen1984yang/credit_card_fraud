/**
 * Follow Mike Bostock's "reusable charts" pattern returning a closure
 * to (re-)draw the d3 content.
 *
 * The outer function sets up private variables like width, height, etc.
 * and returns the inner function (closure) to draw and update the chart.
 *
 * @return {Function}   drawing function that needs to handle both initial
 *                      drawing and updating of the chart.
 */
//import DataProcessing from './DataProcessing';
const d3 = require('d3');
const DataProcessing = require('./DataProcessing');
const CreditVisWidget = require('./graphVis/CreditVisWidget');
const d3fn = function() {
  // --- define private variables
  let width;  
  let height;

  // --- set up one-time elements like scales here...

  /**
   * The inner function generates and updates the chart.
   *
   * @param selection {d3.selection}   selection containing a chart
   */
  function inner(selection) {
    selection.each(function(data) {
      if(!data.commonTranArray||!data.fraudTranArray ||!data.suspectTranArray){
        return;
      }

      var processer= DataProcessing();


      var result=processer.processData(data);
      var vis = CreditVisWidget({
            width:width,
            height:height,
            element: this,
            data: result
      });
      var t =0 ;
/*
      var t = window.VIS.CHART.WIDGET.creditVisWidget({
            data: result
        });

      var tt=0;*/

      // generate chart here: `data` is the data and `this` is the container element
      //console.log(data);
      //console.log(data.length);
      /*
      d3.select(this).selectAll('.dot').data(data)
      .enter()
      .append('rect')
      .attr('x',function(d,i){
        return i*50+5;
      })
      .attr('width',50)
      .attr('height',50)
      .style('fill','red')
      .style('stroke','black');*/
    });

  };

  // --- getter-setter functions here

  inner.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return inner;
  };

  inner.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return inner;
  };

  return inner;
}

module.exports = d3fn;