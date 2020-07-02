window.onload = async () => {
    let data = await d3.json('data/colors.json');

    let width = 1000;
    let height = 16500;

    let svg = d3.select('svg')
        .attr('id', 'svg')
        .attr('width', `${width}px`)
        .attr('height', `${height}px`)
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10);

    let size = Math.floor(width / 14);

    svg
        .selectAll('.cirlce-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'cirlce-group')
        .attr('id', d => d.id)
        .attr('x', (d, i) => (i % 10) * size + (size / 2))
        .attr('y', (d, i) => Math.floor(i / 10) * size + (size / 2))
        .attr('transform',
            (d, i) => `translate(${(i % 10) * size + 25}, ${Math.floor(i / 10) * size + 25})`)
        .each(simulation)

    function simulation(d, i) {
        let s = d3.select(this);
        let x = Number(s.attr('x'))
        let y = Number(s.attr('y'))

        let sim = d3.forceSimulation(d['color'])
            .force('charge', d3.forceManyBody().strength(0))
            .force('center', d3.forceCenter(x, y))
            .force('collision', d3.forceCollide().radius(d => d.percent / 2));

            sim.tick(100); // https://stackoverflow.com/questions/47510853/how-to-disable-animation-in-a-force-directed-graph

            ticked(d3.select(this), d['color']);
    }

    function ticked(selection, data) {
        let u = selection
            .selectAll('circle')
            .data(data)

        u.enter()
            .append('circle')
            .attr('r', d => d.percent / 2)
            .merge(u)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => `rgb(${d.rgb[0]}, ${d.rgb[1]}, ${d.rgb[2]})`)

        u.exit().remove()
    }
}
