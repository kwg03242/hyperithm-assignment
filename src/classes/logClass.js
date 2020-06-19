import React from 'react';

export class tradeLogClass {
    constructor (time, side, volume, unit, idx){
        this.date = time;
        this.side = side;
        this.volume = volume;
        this.unit = unit;
        this.idx = idx;
    }
  
    print = () => {
        return (
            <li className="trade-log">
                <div className="trade-log-date">{this.date.getFullYear()}.{this.date.getMonth() + 1}.{this.date.getDate()}</div>
                <div className="trade-log-side">{this.side}</div> 
                <div className="trade-log-volume">{this.volume} {this.unit}</div>
            </li>
        );
    }
}

export class priceLogClass {
    constructor (date, coin, price, volume){
        this.date = date;
        this.coin = coin;
        this.price = parseInt(price, 10);
        this.volume = volume;
    }
    
    print = () => {
        return (
            <li>
                {this.date.getFullYear()}.{this.date.getMonth() + 1}.{this.date.getDate()} {this.price} {this.volume}
            </li>
        );
    }
}

export class profitClass {
    constructor (date, btc, cash, profit){
        this.date = date;
        this.btc = btc;
        this.cash = cash;
        this.profit = profit;
    }

    print = () => {
        return (
            <li>
                {this.date.getFullYear()}.{this.date.getMonth() + 1}.{this.date.getDate()} BTC: {this.btc} USD: {this.cash} Profit: {this.profit}
            </li>
        );
    }
}