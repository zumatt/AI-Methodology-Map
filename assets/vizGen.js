/*
   Data visualization for the project Designing With.

       Created by Matteo Subet (link.zumat.ch) - Last version 10th july 2023

   SUPSI - Scuola Universitaria della Svizzera Italiana
   DACD  - Dipartimento Architettura Costruzioni e Design
   IDe   - Istituto di Design
*/

//Declare dimensions for the viewport of the dendrogram
if (window.innerWidth <= 1200) {
  var width = 1200;
} else {
  var width = window.innerWidth;
}

  var height = 2200;
  
  if (screen.width > 500) {
    var legend = d3.select("body")
      .append("div")
      .attr("width", width)
      .attr("class", "sticky-legend")
      .attr("style", "background-color: white; z-index: 4; float: left; position:fixed; top: 0px; left: 0px; padding-left: 10px;");
  
    legend.append("text")
      .attr("style", "margin-right:10px")
      .attr("class", "text-legend")
      .html("AI Methoology Map");
  }
  
  var legend = d3.select("body")
    .append("div")
    .attr("width", width)
    .attr("class", "sticky-legend")
    .attr("style", "background-color: white; z-index: 4; float: left; position:fixed; bottom: 0px; left: 0px; padding-bottom:5px; padding-left: 10px;");
  
  legend.append("text")
    .attr("style", "margin-right:10px")
    .attr("class", "text-legend")
    .html("<a href='http://www.designingwithai.ch'>Check the Designing With Project Webpage</a>");
  
  if (screen.width > 500) {
    var legend = d3.select("body")
      .append("div")
      .attr("width", width)
      .attr("class", "sticky-legend")
      .attr("style", "background-color: white; z-index: 4; float: left; position:fixed; bottom: 0px; right: 0px; padding-bottom:5px; padding-left: 10px;");
  
  }
  
  var legend = d3.select("body")
    .append("div")
    .attr("width", width)
    .attr("class", "sticky-legend")
    .attr("style", "background-color: white; z-index: 4; float: right; position:fixed; top: 0px; right: 0px; padding-right: 10px;");
  
  legend.append("text")
    .attr("style", "margin-right:10px")
    .attr("class", "text-legend")
    .html("Tools access legend ->");
  
  legend.append("div")
    .attr("class", "free-legend");
  legend.append("text")
    .attr("class", "text-legend")
    .html("Free");
  
  legend.append("div")
    .attr("class", "freemium-legend");
  legend.append("text")
    .attr("class", "text-legend")
    .html("Freemium");
  
  legend.append("div")
    .attr("class", "premium-legend");
  legend.append("text")
    .attr("class", "text-legend")
    .html("Premium");
  
  // Add a scroll event listener
  window.addEventListener("scroll", function () {
    var legendDiv = document.querySelector(".sticky-legend");
    var rect = legendDiv.getBoundingClientRect();
  
    if (rect.top <= 0) {
      // When the top of the div touches or goes above the top of the screen
      legendDiv.classList.add("sticky-legend-fixed");
    } else {
      // When the div is below the top of the screen
      legendDiv.classList.remove("sticky-legend-fixed");
    }
  });
  
  //Create the html elements to visualize the dataset
  var svg = d3.select("body")
    .append("svg")
    .attr("id", "toolsViz")
    .attr("width", width)
    .attr("height", height);
    svg.attr("style", "z-index: 3; position: absolute; left: 0; top: 50px;");

  g = svg.append("g").attr("transform", "translate(-180,0)");
  
  var cluster = d3.cluster()
    .size([height, width - 150]);
  
  var stratify = d3.stratify()
    .parentId(function (d) {
      return d.id.substring(0, d.id.lastIndexOf("."));
    });
  
  d3.csv("assets/tools.csv", function (error, data) {
    if (error) throw error;
  
    var root = stratify(data);
  
    cluster(root);
  
    var link = g.selectAll(".link")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);
  
    link.style("display", function (d) { if (d.depth == 1) { return "none" } });
  
    var Tooltip = d3.select("body")
      .append("div")
      .style("position", "fixed")
      .style("top", "0")
      .style("right", "0")
      .style("height", "100vh")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "rgb(255 255 255)")
      .style("border-left", "solid 2px")
      .style("font", "16px sans-serif")
      .style("line-height", "32px")
      .style("padding", "30px")
      .style("width", "40vw")
      .on("click", function(d){mouseleave(d);});
  
    var mouseover = function (d) {
      Tooltip
        .style("opacity", 1)
        .style("z-index", "10")
    }
    var mousemove = function (d) {
      Tooltip
        .html("<p style='font-size: 20px; cursor: pointer;'> x </p><p><span style='font-weight: bold;'>" + d.id.substring(d.id.lastIndexOf(".") + 1) + "</span><br><span >Code:</span> " + d.data.code + "<br><span >Accessibility:</span> " + d.data.cost + "<br><span >Use mode:</span> " + d.data.usage + "<br><span >Skills:</span> " + d.data.skills + "</p>" + "<br><a href='" + d.data.link + "' target='_blank' style='text-decoration: underline;'>Tool link</a>" + (d.data.api ? "<br><a href='" + d.data.api + "' target='_blank' style='text-decoration: underline;'>API Documentation</a>" : "") + (d.data.apinote ? "<br><span>API note:</span> " + d.data.apinote + "</p>" : ""))
        //.style("left", (event.pageX - Tooltip.node().offsetWidth - 15) + "px")
        //.style("top", (event.pageY + 15) + "px")
    }
    var mouseleave = function (d) {
      Tooltip
        .style("opacity", 0)
        .style("z-index", "-1")
    }
  
    var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .style("display", function (d) { return d.parent ? "" : "none"; })
      .attr("class", function (d) { if (d.data.cost == "Free") { return "node free" + (d.children ? " node--internal" : " node--leaf"); } else if (d.data.cost == "Premium") { return "node premium" + (d.children ? " node--internal" : " node--leaf"); } else if (d.data.cost == "Freemium") { return "node freemium" + (d.children ? " node--internal" : " node--leaf"); } else { return "node" + (d.children ? " node--internal" : " node--leaf"); } })
      .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
      .on("click", function(d){mouseover(d);})
      //.on("mouseover", function (d) { if (d.data.cost) { mouseover(d); } })
      .on("mousemove", function (d) { if (screen.width >= 1000) { if (d.data.cost) { mousemove(d); } } })
      //.on("mouseleave", function (d) { if (d.data.cost) { mouseleave(d); } });
      ;
  
    g.selectAll(".box")
      .attr("transform", function (d) { return "translate(" + d.y + "," + 0 + ")"; });
  
    node.append("rect")
      .attr("display", function (d) { if (d.depth != 1) { return "none" } else { return "block" } })
      .attr("x", -5)
      .attr("y", -5)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", "1.5");
  
    node.append("rect")
      .attr("display", function (d) { if (d.depth != 2) { return "none" } else { return "block" } })
      .attr("x", -5)
      .attr("y", -5)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", "1.5")
      .attr("style", "transform: rotate(45deg);");
  
    node.append("circle")
      .attr("display", function (d) { if (d.depth != 3) { return "none" } else { return "block" } })
      .attr("style", "stroke:#000000; stroke-width:1.5px; fill: #ffffff;")
      .attr("r", 3.5);
  
    node.append("circle")
      .attr("display", function (d) { if (d.depth != 4) { return "none" } else { return "block" } })
      .attr("style", "stroke:#000000; stroke-width:1.5px; fill: #000000;")
      .attr("r", 3.5);
  
    node.append("circle")
      .attr("display", function (d) { if (d.depth != 5) { return "none" } else { return "block" } })
      .attr("r", 3.5);
  
    node.append("text")
      .attr("dy", 3)
      .attr("x", function (d) { return d.children ? -8 : 8; })
      .style("text-anchor", function (d) { return d.children ? "end" : "start"; })
      .html(function (d) { return "<a" + ">" + d.id.substring(d.id.lastIndexOf(".") + 1); + "</a>" });
  });
  
  function diagonal(d) {
    return "M" + d.y + "," + d.x
      + "C" + (d.parent.y + 100) + "," + d.x
      + " " + (d.parent.y + 100) + "," + d.parent.x
      + " " + d.parent.y + "," + d.parent.x;
  }  

  var movetiaDisclaimer =     d3.select("body")
                              .append("div")
                              .style("margin-top", function(){return height + 200 + "px"} )
                              .attr("class", "container");
    
    const div1 = document.createElement("div");
                div1.className = "textBody";
                div1.style.margin = "3vh 1vw 0vw 1vw";
                div1.innerHTML = `
                    <p>This project is financially supported by Movetia. Movetia promotes exchange, mobility and cooperation within the fields of education, training and youth work – in Switzerland, Europe and worldwide. <a class="movetiaLink" href="https://www.movetia.ch/" target="_blank">wwww.movetia.ch</a></p>
                `;

                // Create the second div element with the provided HTML
                const div2 = document.createElement("div");
                div2.className = "textBody";
                div2.style.margin = "0vw 1vw 0vw 1vw";
                div2.innerHTML = `
                    <img class="movetiaImg" src="https://www.movetia.ch/fileadmin/user_upload/Dokumente/Bereich_4/Movetia_Logos/Logo_Movetia_RGB_Red_Green.png" alt="Movetia Logo">
                `;

                // Create the third div element with the provided HTML
                const div3 = document.createElement("div");
                div3.className = "textBody";
                div3.style.margin = "0vw 1vw 0.5vw 1vw";
                div3.innerHTML = `
                    <p><span style="font-weight: bold;">Project Coordination</span><br><a href="https://www.supsi.ch/home_en.html" target="_blank">SUPSI</a> - University of Applied Sciences and Arts of Southern Switzerland</p>
                    <p><span style="font-weight: bold;">Project Partners</span><br><a href="https://www.unl.pt/en" target="_blank">NOVA</a> - Universidade NOVA de Lisboa<br><a href="https://www.epfl.ch/en/" target="_blank">EPFL</a> - École polytechnique fédérale de Lausanne</p>
                    <p>© 2022. This project is licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>.</p>
                `;

                // Find the location where you want to insert the new elements (e.g., a parent element with class "container")
                const container = document.querySelector(".container");

                // Append the newly created div elements to the container
                container.appendChild(div1);
                container.appendChild(div2);
                container.appendChild(div3);