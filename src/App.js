import React, { useState, useEffect } from 'react';
import TradeLog from './components/tradeLog';
import './components/general.css'
import './App.css';
import { LineChart } from './components/lineChart'
import { priceLogClass } from './classes/logClass'
import { btcValueLogs } from './promises/btcLogs';

const priceDateFormatting = (date) =>{
  let dateArray = date.split('-');
  let formattedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);

  return formattedDate;
}

function App() {
  const [pricesOfBitcoin, setPriceOfBitcoin] = useState([]);
  const [openChart, setOpenChart] = useState(true);

  useEffect(() =>{
    btcValueLogs()
    .then(res =>{
      let priceData = res;
      let sortedBitcoinPrices = priceData.map((log) => new priceLogClass(priceDateFormatting(log.Date), log.Coin, log.Price, log.Volume));
      sortedBitcoinPrices.sort((a, b) => a.date - b.date);
      setPriceOfBitcoin(sortedBitcoinPrices);
    })
  }, [])

  return (
    <>
      <section className="menu-section">
        <h2 className="center">Bitcoin Trading Info</h2>
      </section>
      <TradeLog prices={pricesOfBitcoin}/>
      <section className="chart-section">
        <div className="center">
          <button onClick={() => {setOpenChart(prev => !prev);setPriceOfBitcoin(pricesOfBitcoin);}} className="center">{openChart? `차트 닫기` : `차트 열기`}</button>
        </div>
        <div className="center">
          <div className={openChart? "fadeIn":"fadeOut"}>
            <LineChart logs={pricesOfBitcoin} text="USD/BTC" width={openChart? 800 : 0} height={openChart? 350 :0}/>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;