import React from 'react';

export class tradeLogClass {
    constructor (time, side, volume, idx){
        let timeArray = time.split('/');
        this.date = new Date(timeArray[2], timeArray[0] - 1, timeArray[1]);
        this.side = side;
        this.volume = volume;
        this.idx = idx;
    }
  
    print = () => {
        return (
            <li>
                {this.date.getFullYear()}.{this.date.getMonth() + 1}.{this.date.getDate()} {this.side} {this.volume}
            </li>
        );
    }
}

export class priceLogClass {
    constructor (date, coin, price, volume){
        let dateArray = date.split('-');
        this.date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
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