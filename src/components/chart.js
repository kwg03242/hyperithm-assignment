import React, { useRef, useEffect, useState } from 'react';
import * as d3 from "d3";

const margin = ({top: 40, right: 50, bottom: 50, left: 60});
const height = 500;
const width = 700;


export function ProfitChart( { profits = [] } ) {
    const d3Container = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (profits.length > 0 && d3Container.current) {           
            if(!loaded){
                let line = d3.line()
                    .defined(d => !isNaN(d.value))
                    .x(d => x(d.date))
                    .y(d => y(d.value));
                let data = Object.assign(profits.map(({date, profit}) => ({date, value: profit})), {y: "$"});

                let x = d3.scaleUtc()
                    .domain(d3.extent(data, d => d.date))
                    .range([margin.left, width - margin.right]);

                let absMax = Math.abs(d3.min(data, d => d.value)) > Math.abs(d3.max(data, d => d.value))? Math.abs(d3.min(data, d => d.value)):Math.abs(d3.max(data, d => d.value));

                let y = d3.scaleLinear()
                    .domain([d3.min(data, d => d.value) < 0? -absMax:0, absMax]).nice()
                    .range([height - margin.bottom, margin.top]);
                let xAxis = g => g
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
    
                let yAxis = g => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.select(".tick:last-of-type text").clone()
                        .attr("x", 3)
                        .attr("text-anchor", "start")
                        .attr("font-weight", "bold")
                        .text(data.y));

                const svg = d3.select(d3Container.current)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("width", width)
                    .attr("height", height);


                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("d", line);

                svg.append("g")
                    .call(yAxis);

                svg.append("g")
                    .call(xAxis);

                setLoaded(true);
            }

            else{
                console.log("chart");
                let data = Object.assign(profits.map(({date, profit}) => ({date, value: profit})), {y: "$"});
                let line = d3.line()
                    .defined(d => !isNaN(d.value))
                    .x(d => x(d.date))
                    .y(d => y(d.value));

                let x = d3.scaleUtc()
                    .domain(d3.extent(data, d => d.date))
                    .range([margin.left, width - margin.right]);

                let absMax = Math.abs(d3.min(data, d => d.value)) > Math.abs(d3.max(data, d => d.value))? Math.abs(d3.min(data, d => d.value)):Math.abs(d3.max(data, d => d.value));

                let y = d3.scaleLinear()
                    .domain([d3.min(data, d => d.value) < 0? -absMax:0, absMax]).nice()
                    .range([height - margin.bottom, margin.top]);

                let yAxis = g => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.select(".tick:last-of-type text").clone()
                        .attr("x", 3)
                        .attr("text-anchor", "start")
                        .attr("font-weight", "bold")
                        .text(data.y));

                const svg = d3.select(d3Container.current);

                svg.select("g")
                    .call(yAxis);

                svg.select("path")
                    .datum(data)
                    .attr("d", line);
            }
        }
    }, [profits])
    
    return (
        <svg ref={d3Container} />
    );
}