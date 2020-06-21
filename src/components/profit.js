import React, { useState, useEffect } from 'react';
import { profitClass } from '../classes/logClass'
import { LineChart } from './lineChart';
import { TiDelete, TiEdit, TiArrowLeftThick, TiArrowRightThick, TiPlus } from "react-icons/ti";

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
    const [isProfitsOpen, setIsProfitsOpen] = useState(false);
    const [isProfitChartOpen, setIsProfitChartOpen] = useState(false);
    const [profitsPage, setProfitsPage] = useState(0);
    const [maxProfitsPage, setMaxProfitsPage] = useState(0);

    useEffect(() => {
        let sortedLogs = cloneDeep(logs);
        sortedLogs.reverse();
        let cash = currentCash;
        let btc = currentBtc;
        let duration = 0;
        let profits = [];


        if(prices.length){
            duration = (prices[prices.length - 1].date - prices[0].date + 1)/unitTime;
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
        setMaxProfitsPage(Math.ceil(profits.length / 10));
    }, [logs, prices])

    return (
        <>
            <section className="chart-section">
                <button onClick={() => setIsProfitsOpen(prev => !prev)} className="button">{isProfitsOpen? `손익표 닫기` : `손익표 열기`}</button>
                <div className={isProfitsOpen? "fadeIn":"fadeOut"}>
                    {isProfitsOpen === true &&
                        (profits.slice(profits.length - 10 * (profitsPage + 1) < 0? 0 : profits.length - 10 * (profitsPage + 1), profits.length - 10 * profitsPage)).reverse().map(profit => profit.print())
                    }
                    <div className="row">
                        <div onClick={() => setProfitsPage(prev => prev > 0? prev - 1 : 0)} className="pointer"><TiArrowLeftThick /></div>
                        <div onClick={() => setProfitsPage(prev => prev < maxProfitsPage - 1 ? prev + 1 : maxProfitsPage - 1)} className="pointer"><TiArrowRightThick /></div>
                    </div>
                </div>
            </section>
            <section className="chart-section">
                    <button onClick={() => setIsProfitChartOpen(prev => !prev) } className="button">{isProfitChartOpen? `손익 차트 닫기` : `손익 차트 열기`}</button>
                    <div className="center">
                        <div className={isProfitChartOpen? "fadeIn":"fadeOut"}>
                            <LineChart logs={chartData} text="수익" width={isProfitChartOpen? 800 : 0} height={isProfitChartOpen? 350 :0}/>
                        </div>
                    </div>
            </section>
        </>
    );
}