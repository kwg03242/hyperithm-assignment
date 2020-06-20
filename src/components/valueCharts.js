import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { priceLogClass } from '../classes/logClass';
import { priceLoader } from '../dataLoader/dataLoader';

const defaultUnitOfCoin = 'BTC'

export function ValueChart ( { prices = [], exchangeTo = "USD" } ) {
    const [lineDate, setLineData] = useState({name: '', data: []});
    const [option, setOption] = useState({
        chart: {
            type: 'line',
            stacked: false,
            height: 350,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true
            },
            toolbar: {
              autoSelected: 'zoom'
            }
          },
  
          dataLabels: {
            enabled: false
          },
  
          markers: {
            size: 0,
          },
  
          colors: ['#546E7A'],
  
          title: {
            text: 'Bitcoin 가격',
            align: 'left'
          },
  
          yaxis: { 
            title: {
              text: '$'
            },
          },
  
          xaxis: {
            type: 'datetime',
          },
  
          tooltip: {
            shared: false,
          }
    });

    const [exchangeFrom, setExchangeFrom] = useState("BTC");

    useEffect(() =>{
        let sortedPrices = prices.map((log) => new priceLogClass(log.date, log.coin, log.price, log.Volume));
        sortedPrices.sort((a, b) => a.date - b.date);
        let data = [];
        sortedPrices.map((price) => data.push({x: price.date, y: price.price}));
        console.log(sortedPrices);
        setLineData(data);
        setExchangeFrom(prices.length > 0? (prices[0].Coin == "Bitcoin"? "BTC" : defaultUnitOfCoin) : defaultUnitOfCoin );
        console.log(data);
        setLineData(
            [{
                name: `${exchangeTo}/${exchangeFrom}`,
                data: data
            }]
        );
    }, [prices])

    return (
        <div id="chart">
            <ReactApexChart options={option} series={lineDate} type="line" height={350} />
        </div>
    );
}

export function BTCToUSDChart( { pricesOfBTC = [] } ) {
    let sortedPrices = pricesOfBTC.map((log) => new priceLogClass(new Date(log.Date), log.Coin, log.Price, log.Volume));
    sortedPrices.sort((a, b) => a.date - b.date);
    let data = [];
    sortedPrices.map((price) => data.push({x: price.date, y: price.price}));

    const [btcData, setBtcData] = useState([{
        name: 'USD/BTC',
        data: data
    }]);

    const [optionOfBTCChart, setOptionOfBTCChart] = useState({
        chart: {
          type: 'line',
          stacked: false,
          height: 350,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },

        dataLabels: {
          enabled: false
        },

        markers: {
          size: 0,
        },

        colors: ['#546E7A'],

        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },

        yaxis: { 
          title: {
            text: 'Price'
          },
        },

        xaxis: {
          type: 'datetime',
        },

        tooltip: {
          shared: false,
        }
    });

  
    return (
        <div id="chart">
            <ReactApexChart options={optionOfBTCChart} series={btcData} type="line" height={350} />
            <ReactApexChart options={optionOfBTCChart} series={btcData} type="line" height={350} />
        </div>
    );
}