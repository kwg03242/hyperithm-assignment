import React, { useState, useEffect } from 'react';
import { profitClass } from '../classes/logClass'
import { ProfitChart } from './chart';
import { LineChart } from './lineChart';

const millisecPerDay = 1000 * 60 * 60 * 24;
const unitTime = millisecPerDay;

export default function Profit( { logs = [], prices = [] } ) {
    var cloneDeep = require('lodash.clonedeep');
    const initialCash = 0;
    const initialBtc = 40;
    const [profits, setProfits] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [currentBtc, setCurrentBtc] = useState(initialBtc);
    const [currentCash, setCurrentCash] = useState(initialCash);

    useEffect(() => {
        let sortedLogs = cloneDeep(logs);
        sortedLogs.sort((a, b) => a.date - b.date);
        let cash = currentCash;
        let btc = currentBtc;
        let duration = 0;
        let profits = [];


        if(prices.length){
            duration = (prices[prices.length - 1].date - prices[0].date)/unitTime;
        }
        let j = 0;
        let i = 0;
        
        for(let k = 0; k < duration; k++){
            while(sortedLogs.length > j && sortedLogs[j].date.getTime() === prices[i].date.getTime()){
                if(sortedLogs[j].side === 'sell'){
                    btc = btc - sortedLogs[j].volume;
                    cash = cash + sortedLogs[j].volume * prices[i].price;
                }
                else if(sortedLogs[j].side === 'buy'){
                    btc = btc + sortedLogs[j].volume;
                    cash = cash - sortedLogs[j].volume * prices[i].price;
                }
                j++;
            }

            profits.push(new profitClass(prices[i].date, btc, cash, btc * prices[i].price + cash - initialBtc * prices[0].price - initialCash));
            if(prices[i].date.getTime() === prices[0].date.getTime() + k * unitTime)i++;
        }

        setProfits(profits);
        setChartData(profits.map(profit => {return {"date": profit.date, "price": profit.profit}}))
    }, [logs, prices])

    return (
        <section className="chart-section">
            <div className="center">
                <LineChart logs={chartData} text="수익"/>
            </div>
        </section>
    );
}
