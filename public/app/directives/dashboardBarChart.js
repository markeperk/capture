(function() {
  angular.module('capture')

  .directive('barChart', [function (){
    return {
      scope: {
        data: '='
      },
      template: "<div class='center-block chart'><label class='chartSort'><input class='chartInput' type='checkbox' />Sort</label></div>",
      link: function ($scope, elem, attrs) {
        console.log($scope.data);
        var data = $scope.data.barChart;
       
        data.map(function(i) {
          if (i.day.toLowerCase() === "Sent") {
              i.order = 1;
          }          
          else if (i.day.toLowerCase() === "Wait") {
              i.order = 2;
          }          
          else if (i.day.toLowerCase() === "Download") {
              i.order = 3;
          }          
          else if (i.day.toLowerCase() === "thu") {
              i.order = 4;
          }         
          return;
        });
        console.log(data);
        var margin = {top: 4, right: 4, bottom: 4, left: 4},
            width = 180 - margin.left - margin.right,
            height = 120 - margin.top - margin.bottom;
        var format = d3.format("");
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, .7);
        var y = d3.scale.linear()
            .range([height, 0]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(format);
        var svg = d3.select(".chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // var sortTimeout = setTimeout(function() {
        //       d3.select("input").property("checked", true).each(change);
        //     }, 4000);

      function updateRequestData(data) {
          data.forEach(function(d) {
            d.count = +d.count;
          });

          x.domain(data.map(function(d) { return d.day; }));
          y.domain([0, d3.max(data, function(d) { return d.count + 1; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Average Request in Stages");

          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.day); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(0); })
              .attr("height", function(d) { return height - y(0); })
              .transition().duration(1500)
              .attr("y", function(d) { return y(d.count); })
              .attr("height", function(d) { return height - y(d.count); })

            d3.select("input").on("change", change);
        };
        updateRequestData(data);


      // function change() {
      //     clearTimeout(sortTimeout);

      //     // Copy-on-write since tweens are evaluated after a delay.
      //     var x0 = x.domain(data.sort(this.checked
      //       ? function(a, b) { return b.count - a.count; }
      //       : function(a, b) { return d3.ascending(a.order, b.order); })
      //       .map(function(d) { 
      //         return d.day; }))
      //       .copy();


      //     svg.selectAll(".bar")
      //       .sort(function(a, b) { return x0(a.day) - x0(b.day); });

      //     var transition = svg.transition().duration(750),
      //         delay = function(d, i) { return i * 50; };

      //     transition.selectAll(".bar")
      //       .delay(delay)
      //       .attr("x", function(d) { return x0(d.day); });

      //     transition.select(".x.axis")
      //       .call(xAxis)
      //       .selectAll("g")
      //       .delay(delay);
      //   };
        
      }
    };
  }]) 

})();
