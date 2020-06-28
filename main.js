window.onload = async () => {
    let data = await d3.json('data/colors.json');
    for (let i = 0; i < data.length; i++) {
        data[i].year = new Date(`${data[i].year}T12:00:00`)
    }
    let extent = d3.extent(data, d => d.year);
    console.log(extent);

    let margin = { 'top': 10, 'right': 20, 'bottom': 25, 'left': 20 };

    let width = 500;
    let height = 750;

    let svg = d3.select('body')
        .append('svg')
        .attr('id', 'svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10);

    let pseudo = svg._groups[0][0];
    width = pseudo.clientWidth;

    let xScale = d3.scaleUtc()
        .domain(extent)
        .range([margin.left, width - margin.right]);

    let yScale = d3.scaleLinear()
        .domain([100, 0])
        .range([height - margin.bottom, margin.top]);

    let xAxis = g => g
        .attr('id', `svg`)
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom()
                .scale(xScale)
                .tickFormat(d3.timeFormat("%Y"))
                .ticks(width / 50)
                .tickSizeOuter(0)
                );

    svg.append('g')
        .attr('id', 'x-axis')
        .call(xAxis);

    let works = svg.selectAll('.cirlce-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'circle-group')
        .attr('id', d => d.id)
        .attr('transform', d => `translate(${xScale(d.year)}, 0)`)

    works.selectAll('circle')
        .data(d => d.color)
        .enter()
        .append('circle')
        .attr('r', d => d.percent / 3)
        .attr('cy', d => {
            // console.log(yScale(d.percent))
            return yScale(d.percent)
        })
        .attr('fill', d => d.html)
}