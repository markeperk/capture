(function() {
  angular.module('capture')

  .directive('bubbleChart', [function (){
    return {
      scope: {
        data: '=',
        labelAccessor: '=',
        tooltip: '='
      },
      link: function ($scope, elem, attrs) {

        $scope.$watch("data", function(n, o) {
          if(n !== o) {updateChart(); }
        });
        $scope.$watch("labelAccessor", function(n, o) {
          if(n !== o) { updateChart(); }
        });

        //definitions
        var diameter = 800,
            format = d3.format(",d"),
            color = d3.scale.category20c();

        var svg = d3.select(elem[0]).append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble") 

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
        //define pack
        var packing = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .padding(1.5);

        $scope.tooltip = tooltip;

        function updateChart(is_resize) {
          tooltip.style("visibility", "hidden");
          var data = $scope.data;
          if(data && data.children.length > 0) {
            // packing.radius()
            // packing.sort(function(a, b) {
            //     return -(b.value - a.value);
            // })

            var node = svg.selectAll(".node")
                  .data(packing.nodes(data)
                  .filter(function(d) { return !d.children; }));
            
            node.exit().transition().duration(0).remove()
            node.select("text").remove()

            node.enter().append("g")
                  .classed("node", true)
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                .append("circle")       
                  .style("fill", function(d) { return color(d.packageName); })
                  .on("mouseover", function(d) {
                      tooltip.html(
                        "<a style='color: #e8ca14; ' target='_blank' href=" + d.url + 
                        ">" + d.className +
                        "</a>" +                          
                        "<br/>"  + d.packageName +
                        "<br/>"  + d.contentSize +
                        "<br/>"  + d.time + 
                        "<span style='color: lightgray;'> (Latency: " + d.latency + 
                        "</span>)" + 
                        "<br/><span style='color: lightgray;'>Sent (" + d.send + 
                        "), Waiting (" + d.wait + 
                        "), Downloaded (" + d.receive + 
                        ")</span><br/>"  + d.classNameMs)  
                        .style("left", (d3.event.pageX) + "px")      
                        .style("top", (d3.event.pageY - 28) + "px");
                      tooltip.style("visibility", "visible");
                  })
                  .on("mousemove", function() {
                      return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                  })
                  .on("mouseout", function() {return tooltip.style("visibility", "visible");})
                  .attr("r", function(d) { return d.r; });

            node.transition()
                .duration(is_resize ? 0 : 1000)
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

            node.select("circle")
                .transition()
                .duration(is_resize ? 0 : 1000)
                .attr("r", function (d) { return d.r; })

            node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .style("pointer-events", "none")
                .text(function(d) { 
                  return $scope.labelAccessor(d).substring(0, d.r / 3); 
                });
          } //end of if statement  
        } //end of update function
      } //end of link
    }; //end of return
  }]) //end of directive
})();







