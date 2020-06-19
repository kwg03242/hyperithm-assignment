import React, { useRef, useState, useEffect } from 'react';
import { profitClass } from '../classes/logClass'
import { priceLoader } from '../dataLoader/dataLoader';
import { priceLogClass } from '../classes/logClass';
import { ProfitChart, BTCValueChart } from './chart';

const millisecPerDay = 1000 * 60 * 60 * 24;
const unitTime = millisecPerDay;



export default function Profit( { logs = [], prices = [] } ) {
    var cloneDeep = require('lodash.clonedeep');
    const [currentCash, setCurrentCash] = useState(0);
    const [currentBtc, setCurrentBtc] = useState(0);
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
        console.log(logs);
        setProfits(profits);
    }, [logs, prices])

    // console.log(profits);
    return (
        <section>
            {/* {profits.length > 0 &&
                profits.map((profit) => profit.print())
            } */}
            <ProfitChart profits={profits} />
            <BTCValueChart prices={prices} />
            <div>손익</div>
        </section>
    );
}
