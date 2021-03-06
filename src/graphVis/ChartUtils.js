'use strict';

    const $ = require('jquery');
    const d3 = require('d3');
    const ChartUtils = function() {

            var calculateDistance = function(p1,p2){
                var val = (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y)
                return Math.sqrt(val);
            };

            var toHex = function(n) {
               n = parseInt(n,10);
               if (isNaN(n)) return "00";
               n = Math.max(0,Math.min(n,255));
               return "0123456789ABCDEF".charAt((n-n%16)/16)
                    + "0123456789ABCDEF".charAt(n%16);
              };

            var rgbToHex = function(R,G,B) {return toHex(R)+toHex(G)+toHex(B)};

            var getRGBComponents = function (color) {
                var r = color.substring(1, 3);
                var g = color.substring(3, 5);
                var b = color.substring(5, 7);
                return {
                    R: parseInt(r, 16),
                    G: parseInt(g, 16),
                    B: parseInt(b, 16)
                };
            }            
        return {
            getGrayScale:function(color){
              var components = getRGBComponents(color); 
              var grey = (components.R + components.G + components.B )/3;
              var c = "#"+rgbToHex(grey,grey,grey);
              return c;
            },
            getTimeByIndex:function(start, end, index, width, minWidth){
              var timeInterval = 86400000;
              var buckets = d3.time.day.range(start,end);
              var tickLen = Math.round((buckets.length*minWidth)/width)* timeInterval;
              return start+index*tickLen;              
            },
            getTimeIndexByTick:function(start, end, time,width, minWidth){
              var timeInterval = 86400000;
              var buckets = d3.time.day.range(start,end);
              var tickLen = Math.round((buckets.length*minWidth)/width)* timeInterval;
              var timeIndex = Math.floor((time-start)/tickLen);
              return timeIndex;
            },
            getTimeTicks:function(start, end, width, minWidth){
              var buckets = d3.time.day.range(start,end);
              var tickLen = Math.round((buckets.length*minWidth)/width);
              var tickCnt = buckets.length/tickLen;
              var ticks = [];
              for(var i=0;i<=tickCnt;i+=1){
                  //var t = start_time+tickLen*timeInterval*i;
                  ticks.push(i);
              }
              return ticks;
            },
        wrapSVGText:function(text, width, lineNum) {
            var lineNumber = 0;
            text.each(function() {
              var text = d3.select(this),
                  words = text.text().split(/\s+/).reverse(),
                  word,
                  line = [],
                  //lineNumber = 0,
                  y = Number(text.attr("y")),
                  dy = parseFloat(text.attr("dy")),
                  size =parseFloat(text.style("font-size")),
                  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y)
                  .attr('class','rowlabel row'+line.length);

                  var lineHeight=Number(size)*0.68;
              while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                //var tt=tspan.node().getComputedTextLength();
                if (tspan.node().getComputedTextLength() > width && line.length>1) {
                  if(!lineNum||(lineNum&&lineNum>=line.length)){
                    var t=++lineNumber*lineHeight+y;
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr('class','rowlabel row'+line.length)
                    .attr("x", 0).attr("y", ++lineNumber*lineHeight+y)
                    .text(word);                    
                  }

                }
              }
            });
            return lineNumber;
        }            
      };
    };
    
module.exports = ChartUtils;

/*
var timeformat = d3.time.format("%b %d %Y")
function getTicks(chart, min, max){
    var chartHeight = 220;
    var tickSize=(chartHeight/nv.tickNumHeight);
    var scale = d3.scale.linear().domain([min,max]);
    var ticks=scale.ticks(tickSize);
    var len1=ticks.length;
    var maxTick=0;
    if(len1>1){
        maxTick=ticks[len1-1]*2-ticks[len1-2];
        if(maxTick!=0 && maxTick){
          ticks.push(maxTick);
        }
        if(ticks[0]>min){
          var minticks=ticks[0]-(ticks[len1-1]-ticks[len1-2]);
          ticks.splice(0, 0, minticks);
        }
    }
    return ticks;
}

function formatBigValue(val, needInt) {
    var f = (val < 1000 || needInt) ? d3.format('1f') : d3.format('.1f');
    var prefix = d3.formatPrefix(val);
    var symbol = prefix.symbol === 'G' ? 'B' : prefix.symbol;
    var t = f(prefix.scale(val));
    return f(prefix.scale(val)) + symbol;
}

function getRGBComponents (color) {
        var r = color.substring(1, 3);
        var g = color.substring(3, 5);
        var b = color.substring(5, 7);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
}


function idealTextColor (bgColor) {
        var nThreshold = 105;
        var components = getRGBComponents(bgColor);
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}

function getGrayScale(color){
        var components = getRGBComponents(color); 
        var grey = (components.R + components.G + components.B )/3;
        var c = "#"+rgbToHex(grey,grey,grey);
        return c;
}

function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
     n = parseInt(n,10);
     if (isNaN(n)) return "00";
     n = Math.max(0,Math.min(n,255));
     return "0123456789ABCDEF".charAt((n-n%16)/16)
          + "0123456789ABCDEF".charAt(n%16);
}*/

/* Since the IE browser (v10 & above) does not support the foreign object, 
     the wrap function is manually done with SVG function. The function splits 
     the SVG text into words vector and wraps them into lines within the constrained width.
     */

