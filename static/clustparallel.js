export function cluster_PCP(data) {

    const margin = { top: 30, right: 10, bottom: 50, left: 70 };
    const width = Math.max(800, Object.keys(data).length * 100) - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const container = d3.select("#clustparallel")
        .append("div")
        .style("width", "800px")
        .style("overflow-x", "scroll");

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const dimensions = Object.keys(data).filter(key => key !== 'ClusterID');
    const clusterIds = Object.values(data.ClusterID);
    const keys = Object.keys(data[dimensions[0]]);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 2500]); // Adjusted domain to range from 0 to 3000

    const x = d3.scalePoint()
        .range([0, dimensions.length * 100]) // Adjusted range based on number of dimensions
        .padding(0.1)
        .domain(dimensions);

    const line = d3.line()
        .x((_, i) => x(dimensions[i]))
        .y(d => y(parseFloat(d)));


    // Define colors for each cluster
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(clusterIds);

    keys.forEach((key, index) => {
        svg.append("path")
            .datum(dimensions.map(dim => data[dim][key]))
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", colorScale(clusterIds[index])) // Color based on cluster ID
            .style("opacity", 0.5);
    });

    svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", d => `translate(${x(d)})`)
        .each(function(d) {
            d3.select(this).call(d3.axisLeft().scale(y));
            d3.select(this).append("text")
                .style("text-anchor", "middle")
                .attr("y", -20)
                .text(d)
                .attr("fill", "black");
        });
}
