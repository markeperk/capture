(function() {
  angular.module('capture')

  .directive('bubbleChart', [function (){
    return {
      scope: {
        data: '='
      },
      link: function ($scope, elem, attrs) {

        var count = 0;
        $scope.$watch("data", function(n, o) {
          if(n !== o) {
            updateChart();
            count++;
            console.log(count)
          }
        });

        //definitions
        
        var diameter = 600,  //mobile?
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

          var data = extractBubbleData((($scope.data || {}).log || {}).entries || []);
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




//functions

function extractBubbleData(arr) {
//bubble array data(bad), request network phases(rnp), request-initiated requests(rir)
 var bad = [], rnp = [], rir = []
  result = arr.map(function(k) {
    console.log("time", k.time)
    //all object data(aod)
    var aod = {}, url = k.request.url.toString();
    if(url.lastIndexOf('/') === url.length - 1) url = url.slice(0, url.length - 1);
    aod.name = (url.substring(url.lastIndexOf('/') + 1, url.length)).trim()
    // aod.title = k.pages.title; //not on entries
    aod.url = url;
    aod.sdt = moment(k.startedDateTime).format('1111');
    aod.time = moment(k.time).valueOf();
    aod.type = getType(k.response.content.mimeType);
    aod.size = k.response.content.size;
    aod.sizelabel = formatBytes(k.response.content.size, 2);
    aod.blocked = moment(k.timings.blocked).format('SSSS');
    aod.dns = moment(k.timings.dns).format('SSSS');
    aod.connect = moment(k.timings.connect).format('SSSS');
    aod.send = moment(k.timings.wait).format('SSSS');
    aod.receive = moment(k.timings.receive).format('SSSS');
    bad.push({packageName: aod.type, className: aod.name, value: aod.time});
   })
   console.log(bad)
   return {children: bad}
}



function getType(ct, url) {
    if (!ct || ct === undefined) {
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
      return 'image';
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


        
  //accessors
  // var sizeAccessors = {
  //   time: function(d) { console.log(d.time); return +d.time; },
  //   size: function(d) { return +d.response.content.size; }
  // };

  // var groupAccessors = {
  //   type: function(d) { return getType(d.response.content.mimeType); }
  // };

  // var filterAccessors = {
  //   all: function(d) { return getType(d.response.content.mimeType); },
  //   other: function(d) { return getType(d.response.content.mimeType); },
  //   css: function(d) { return getType(d.response.content.mimeType); },
  //   script: function(d) { return getType(d.response.content.mimeType); },
  //   xhr: function(d) { return getType(d.response.content.mimeType); },
  //   font: function(d) { return getType(d.response.content.mimeType); },
  //   image: function(d) { return getType(d.response.content.mimeType); }
  // };       

  // var tooltipAccessors = {
  //   name: function(d) { return getEntryName(d.request.url.toString()); },
  //   url: function(d) { return d.request.url.toString(); },
  //   size: function(d) { return formatBytes(k.response.content.size, 2); }
  // };










