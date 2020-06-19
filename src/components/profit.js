import React, { useState, useEffect } from 'react';
import { profitClass } from '../classes/logClass'
import { ProfitChart, BTCValueChart, BarChart } from './chart';

const millisecPerDay = 1000 * 60 * 60 * 24;
const unitTime = millisecPerDay;

export default function Profit( { logs = [], prices = [] } ) {
    var cloneDeep = require('lodash.clonedeep');
    const currentCash = 0;
    const currentBtc = 0;
    const [profits, setProfits] = useState([]);

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

            profits.push(new profitClass(prices[i].date, btc, cash, btc * prices[i].price + cash));
            if(prices[i].date.getTime() === prices[0].date.getTime() + k * unitTime)i++;
        }

        setProfits(profits);
    }, [logs, prices])

    return (
        <section className="background">
            <ProfitChart profits={profits} />
            <BTCValueChart prices={prices} />
            <BarChart prices={prices} />
            <div>손익</div>
        </section>
    );
}
