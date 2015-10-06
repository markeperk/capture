(function() {
  angular.module('capture')

  .directive('barChart', [function (){
    return {
      scope: {
        data: '='
      },
      link: function ($scope, elem, attrs) {

        $scope.$watch("data", function(n, o) {
          if(n !== o) { updateChart(); }
        });
 
        var margin = {top: 20, right: 20, bottom: 20, left: 20},
        // var margin = {top: 20, right: 10, bottom: 20, left: 2},
            width = 220 - margin.left - margin.right,
            height = 100 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .3);
        var y = d3.scale.linear()
            .range([height, 0]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            // .tickFormat(10,"");
        var svg = d3.select(elem[0])
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(xAxis)
       
        var tooltip = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("visibility", "hidden")
          .style("color", "white")
          .style("padding", "8px")
          .style("margin", "5px")
          .style("background-color", "rgba(44, 44, 44, 0.8)")
          .style("border-radius", "6px")
          .style("font", "12px sans-serif")
          .text("tooltip");

        var label = function(d) { return d.label;},
            padding = 1;
        
       
        function updateChart() {
          var d = $scope.data;           
          var data = [
              {label: "Sent", duration: +d.childrenStats.avgSend },  
              {label: "Waiting", duration: +d.childrenStats.avgWait },   
              {label: "Received", duration: +d.childrenStats.avgReceive }
            ];

          x.domain(data.map(function(d) { return d.label; }));
          y.domain([0, d3.max(data, function(d) { return data; })]);
            
          var rect = svg.selectAll("rect").data(data)
       
          rect.transition().duration(0)          
          rect.exit().transition().duration(0).remove();
          rect.selectAll('text').remove();

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")

          rect.enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.label); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.duration); })
              .attr("height", function(d, i) { return height - y(d.duration); })

          var xAxis = d3.svg.axis().scale(x).orient("bottom");
          var yAxis = d3.svg.axis().scale(y).orient("left");

          svg.selectAll(".y.xis")
              .call(yAxis)

          svg.selectAll(".xAxis")
              .call(xAxis);

          // svg.selectAll(".bar")
          //     .data(data)
          //   .enter().append("rect")
          //     .attr("class", "bar")
          //     .attr("x", function(d) { return x(d.label); })
          //     .attr("width", x.rangeBand())
          //     .attr("y", function(d) { return y(d.duration); })
          //     .attr("height", function(d, i) { return height - y(d.duration); })
        // .transition().duration(1500)
        //   .attr("y", function(d) { return y(d.label); })
        //   .attr("height", function(d) { return height - y(d.duration);})
        // .on("mouseover", function(d) {
        //     tooltip.html( "Average" + ': ' + d.duration)               
        //       .style("left", (d3.event.pageX) + "px")      
        //       .style("top", (d3.event.pageY - 28) + "px");
        //     tooltip.style("visibility", "visible");
        //     })
        //     .on("mousemove", function() {
        //       return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        //     })
        //     .on("mouseout", function() {return tooltip.style("visibility", "hidden");})

          // svg.selectAll("text")
          //     .data(data)
          //   .enter().append("text")
          //    .text(function(d) { return d })
          //    // .attr("text-anchor", "middle")
          //    // .attr("x", function(d) { return x(d.label); })
          //    // .attr("y", function(d) { return y(d.duration) ; })
          //    .attr("x", function(d, i) {return i * (width / data.length) + 5; })
          //    .attr("y", function(d) { return height - (d.duration) + 15; })
          //    .attr("x", function(d) { return x(d.label); })
          //    .attr("font-family", "sans-serif") 
          //    .attr("font-size", "10px")
          //    .attr("color", "black");
          //    // .attr("fill", "white");

        };
        function formatTime(milliseconds) {
          var time = new Date(milliseconds),
          duration = time.getUTCSeconds() + "." + time.getUTCMilliseconds() + " ms";
          return duration;
        };
      }
    };
  }]) 
})();



