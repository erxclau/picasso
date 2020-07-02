window.onload = async () => {
    let data = await d3.json('data/colors.json');

    let width = 1200;
    let height = 86700;

    let svg = d3.select('svg')
        .attr('id', 'svg')
        .attr('width', `${width}px`)
        .attr('height', `${height}px`)
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10);

    let rowSize = 4;
    let size = Math.floor(width / (rowSize * 2));

    let getX = i => (i % rowSize) * size;
    let getY = i => Math.floor(i / rowSize) * size;

    let works = svg
        .selectAll('.cirlce-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'cirlce-group')
        .attr('id', d => d.id)
        .attr('x', (d, i) => getX(i) + (size / 2))
        .attr('y', (d, i) => getY(i) + (size / 2) + 30)
        .attr('transform',
            (d, i) => `translate(${getX(i) + 25}, ${getY(i) + 25})`)
        .each(simulation)

    let titles = works
        .append('text')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('font-size', '10')
        .attr('x', (d, i) => getX(i) + (size / 2))
        .attr('y', (d, i) => getY(i))
        .text(d => `${d.title} (${d.year})`)

    titles.call(wrap, size);

    function simulation(d) {
        let s = d3.select(this);
        let x = Number(s.attr('x'))
        let y = Number(s.attr('y'))

        let sim = d3.forceSimulation(d['color'])
            .force('charge', d3.forceManyBody().strength(0))
            .force('center', d3.forceCenter(x, y))
            .force('collision', d3.forceCollide().radius(d => d.percent / 2));

        sim.tick(100);
        // https://stackoverflow.com/questions/47510853/how-to-disable-animation-in-a-force-directed-graph

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

    // https://bl.ocks.org/mbostock/7555321
    function wrap(text, width) {
        text.each(function () {
            let text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1, // ems
                y = text.attr("y"),
                x = text.attr("x")
                dy = 1,
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}
