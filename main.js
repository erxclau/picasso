window.onload = async () => {
    let data = await d3.json('data/colors.json');
    for (let i = 0; i < data.length; i++) {
        data[i].year = new Date(`${data[i].year}T12:00:00`)
    }
    let extent = d3.extent(data, d => d.year);

    let margin = { 'top': 10, 'right': 20, 'bottom': 25, 'left': 20 };

    let width = 500;
    let height = 750;

    let svg = d3.select('svg')
        .attr('id', 'svg')
        .attr('width', '1000px')
        .attr('height', '16500px')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10);

    let pseudo = svg._groups[0][0];
    width = pseudo.clientWidth;
    height = pseudo.clientHeight;

    let size = Math.floor(width / 14);

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

    let simulation = function (d, i) {
        let x = Number(d3.select(this).attr('x')) + size / 2
        let y = Number(d3.select(this).attr('y')) + size / 2
        console.log(x, y);
        return d3.forceSimulation(d['color'])
            .force('charge', d3.forceManyBody().strength(1))
            .force('center', d3.forceCenter(x, y))
            .force('collision', d3.forceCollide().radius(function (d) {
                return d.percent / 2
            }))
            .on('tick', () => ticked(d3.select(this), d['color']));
    }

    let works = svg
        .selectAll('.cirlce-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'cirlce-group')
        .attr('id', d => d.id)
        .attr('x', (d,i) => (i % 10) * size)
        .attr('y', (d,i) => Math.floor(i / 10) * size)
        .attr('transform',
            (d,i) => `translate(
                ${(i % 10) * size + 25},
                ${Math.floor(i / 10) * size + 25}
            )`)
        .each(simulation)
}