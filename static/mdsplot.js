export function scatterplot(data) {
    // Extracting data
    const distance1 = Object.values(data.distance1);
    const distance2 = Object.values(data.distance2);
    
    // Setting up the dimensions and margins for the plot
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Appending SVG to the body
    const svg = d3.select("#mdsplot")
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

    // Creating circles for each data point
    svg.selectAll("circle")
        .data(distance1)
        .enter().append("circle")
        .attr("cx", d => xScale(d))
        .attr("cy", (d, i) => yScale(distance2[i]))
        .attr("r", 5)
        .attr("fill", "steelblue");

    // Adding labels to axes
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
}
