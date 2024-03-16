export function clusterplot(data) {
    // Extracting data
    const clusterID = Object.values(data.ClusterID);
    const distance1 = Object.values(data.Feature1);
    const distance2 = Object.values(data.Feature2);
  
    // Set up the chart dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
  
    // Create the SVG container
    const svg = d3.select("#mdscatter")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setting up scales
    const xScale = d3.scaleLinear()
    .domain([d3.min(distance1), d3.max(distance1)+0.2])
    .range([0, width]);

    const yScale = d3.scaleLinear()
    .domain([d3.min(distance2), d3.max(distance2)+0.2])
    .range([height, 0]);
  
    // Create color scale for clusters
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Draw dots on the chart
    svg.selectAll("circle")
      .data(clusterID)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(distance1[i]))
      .attr("cy", (d, i) => yScale(distance2[i]))
      .attr("r", 5) // Adjust the radius as needed
      .style("fill", (d) => colorScale(d));
  
      svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("fill", "#000")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .text("MDS1");

     svg.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 3)
      .attr("x", -height / 2)
      .attr("dy", "0.71em")
      .attr("text-anchor", "middle")
      .text("MDS2");
  
    // Add legend
    const legend = svg.selectAll(".legend")
      .data(colorScale.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);
  
    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);
  
    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => `Cluster ${d}`);
  }
  