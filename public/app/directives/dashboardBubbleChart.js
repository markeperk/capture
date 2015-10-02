(function() {
  angular.module('capture')

  .directive('bubbleChart', [function (){
    return {
      scope: {
        data: '='
      },
      link: function ($scope, elem, attrs) {

        $scope.$watch("data", function() {
          updateChart();
        });

        // $scope.$on('capture.dashboard.data.new', updateChart);

        //definitions
        
        var diameter = 960,  //mobile?
            format = d3.format(",d"),
            color = d3.scale.category20c();

        var svg = d3.select(elem[0]).append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

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
        
        //accessors
        var sizeAccessors = {
          time: function(d) { return +d.time; },
          size: function(d) { return +d.response.content.size; }
        };

        var groupAccessors = {
          type: function(d) { return getType(d.response.content.mimeType); }
        };

        var filterAccessors = {
          type: function(d) { return getType(d.response.content.mimeType); }
        };       

        var tooltipAccessors = {
          name: function(d) { return getEntryName(d.request.url.toString()); },
          url: function(d) { return d.request.url.toString(); },
          size: function(d) { return formatBytes(k.response.content.size, 2); },
        };

        var packing = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .padding(1.5);


        function updateChart() {

          //insert data
          var data = (($scope.data || {}).log || {}).entries || [];
          console.log('directive data', data);

          //set packing
          packing.radius(sizeAccessors.active)
          packing.sort(filterAccessors.active) //??

          //Select all
          var node = svg.selectAll(".node")
                .data(packing.nodes(data), function(d) { return d.id; }) //do I construct the array?
                // .filter(function(d) { return !d.children; }))
          
          //Exit
          // node.exit().transition().duration(0).remove()

          //Enter
          node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

          node.append("circle")
              .attr("r", function(d) { return d.r; }) //where is this coming from
              .style("fill", function(d) { return color(d.packageName); })
              .on("mouseover", function(d) {
                  tooltip.text(d.className + ": " + format(d.value));
                  tooltip.style("visibility", "visible");
              })
              .on("mousemove", function() {
                  return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
              })
              .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

          node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .text(tooltipAccessors.name);  //add other tooltip text if you want




          //Transition
          // node.transition().duration(500)


        } //end of update function

      d3.select(self.frameElement).style("height", diameter + "px");

      } //end of link
    }; //end of return
  }]) //end of directive

})();





//functions

function getType(ct, url) {
    if (ct === undefined) {
      return 'other';
    }
    ct = ct.toLowerCase();
    if (ct.substr(0, 8) === 'text/css') {
      return 'css';
    }
    if (/javascript/.test(ct)) {
      return 'script';
    }
    if (/\/json/.test(ct)) {
      return 'xhr';
    }
    if (ct.substr(0, 5) === 'font/' ||
        /(\/|-)font-/.test(ct) || /\/font/.test(ct) ||
        /\.((eot)|(otf)|(ttf)|(woff))($|\?)/i.test(url)) {
      return 'font';
    }
    if (ct.substr(0, 6) === 'image/' ||
        /\.((gif)|(png)|(jpe)|(jpeg)|(jpg)|(tiff))($|\?)/i.test(url)) {
      return 'img';
    }
    if (ct.substr(0, 6) === 'audio/' || ct.substr(0, 6) === 'video/' ||
        /\.((flac)|(ogg)|(opus)|(mp3)|(wav)|(weba))($|\?)/i.test(url) ||
        /\.((mp4)|(webm))($|\?)/i.test(url)) {
      return 'other';
    }
    if (ct.substr(0, 9) === 'text/html' ||
        ct.substr(0, 10) === 'text/plain') {
      return 'document';
    }
    return 'other';
  }


function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
}


function getEntryName(string) {
  if(string.lastIndexOf('/') === string.length - 1) {
    var nUrl = string.slice(0, string.length - 1)
    return (nUrl.substring(nUrl.lastIndexOf('/') + 1, nUrl.length)).trim()
  } else {
    return (string.substring(string.lastIndexOf('/') + 1, string.length)).trim()
  }
}















