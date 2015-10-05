(function() {
  angular.module('capture')

  .directive('bubbleChart', [function (){
    return {
      scope: {
        data: '='
      },
      link: function ($scope, elem, attrs) {

        $scope.$watch("data", function(n, o) {
          if(n !== o) {
            updateChart();
          }
        });
        //definitions
        var diameter = 800,  //mobile?
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
            .style("background-color", "rgba(0, 0, 0, 0.75)")
            .style("border-radius", "6px")
            .style("font", "12px sans-serif")
            .text("tooltip");
        //define pack
        var packing = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .padding(1.5);

        function updateChart() {
          var data = $scope.data;
          console.log(data);
          if(data.children.length > 0) {
            // packing.radius(sizeAccessors.time)
            // packing.sort(filterAccessors.active)

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
                      tooltip.text(d.className + ": " + format(d.value));
                      tooltip.style("visibility", "visible");
                  })
                  .on("mousemove", function() {
                      return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                  })
                  .on("mouseout", function() {return tooltip.style("visibility", "hidden");})
                  .attr("r", function(d) { return d.r; });

            node.transition()
                .duration(1000)
                .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

            node.select("circle")
                .transition()
                .duration(1000)
                .attr("r", function (d) { return d.r; })

            node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .style("pointer-events", "none")
                .text(function(d) { return d.className.substring(0, d.r / 3); });
          } //end of if statement  
        } //end of update function
      } //end of link
    }; //end of return
  }]) //end of directive
})();



// var classNameAccessors = {
//   name: function(d) { return d.request.url.toString(); },
//   type: function(d) { return formatBytes(k.response.content.size, 2); }
// };   
// var valueAccessors = {
//   time: function(d) { return +d.time; },
//   size: function(d) { return +d.response.content.size; }
// };






