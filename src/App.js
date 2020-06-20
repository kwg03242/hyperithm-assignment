import React, { useState, useEffect } from 'react';
import TradeLog from './components/tradeLog';
import './components/general.css'
import './App.css';
import { LineChart } from './components/lineChart'
import { priceLoader } from './dataLoader/dataLoader';
import { priceLogClass } from './classes/logClass'

function App() {
  const [pricesOfBitcoin, setPriceOfBitcoin] = useState([]);
  const [openChart, setOpenChart] = useState(false);

  useEffect(() =>{
    let priceData = priceLoader();
    let sortedBitcoinPrices = priceData.map((log) => new priceLogClass(new Date(log.Date), log.Coin, log.Price, log.Volume));
    sortedBitcoinPrices.sort((a, b) => a.date - b.date);
    setPriceOfBitcoin(sortedBitcoinPrices);
  }, [])

  return (
    <>
      <section className="menu-section">
        <h2 className="center">Bitcoin Trading Info</h2>
      </section>
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
      <TradeLog />
    </>
  );
}

export default App;