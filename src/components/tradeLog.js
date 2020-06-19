import React, { useState, useEffect } from 'react';
import { tradeLogLoader, priceLoader } from '../dataLoader/dataLoader';
import { tradeLogClass, priceLogClass } from '../classes/logClass'
import { AvailableDate } from './availableDate'
import Profit from './profit';

let defaultEditTrade = [];
for(let i = 0; i < 10; i++){
    defaultEditTrade.push({"date": null, "side": null, "volume": null});
}


const tradeLogDateFormatting = (date) =>{
    let timeArray = date.split('/');
    let formattedDate = new Date(timeArray[2], timeArray[0] - 1, timeArray[1]);

    return formattedDate;
}

const priceDateFormatting = (date) =>{
    let dateArray = date.split('-');
    let formattedDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);

    return formattedDate;
}

export default function TradeLog () {
    var cloneDeep = require('lodash.clonedeep');
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [logs, setLogs] = useState([]);
    const [addTrade, setAddTrade] = useState({"date": null, "side": null, "volume": null});
    const [editTrade, setEditTrade] = useState(defaultEditTrade);
    const [prices, setPrices] = useState([]);

    useEffect (() => {
        let idx = 0;
        let tradeLogs = tradeLogLoader(); 
        let unpagedLogs = tradeLogs.map((log) => new tradeLogClass(tradeLogDateFormatting(log.time), log.side, log.volume, 0));
        unpagedLogs.sort((a, b) => b.date - a.date);
        for(let i = 0; i < unpagedLogs.length; i++){
            unpagedLogs[i].idx = idx++;
        }

        setLogs(unpagedLogs);

        let page = [];
        setMaxPage(Math.floor((unpagedLogs.length - 1) / 10) + 1);

        for(let i = 0; i < Math.floor((unpagedLogs.length - 1) / 10) + 1; i++){
            page.push([]);
        }
        
        for(let i = 0; i < unpagedLogs.length; i++){
            page[Math.floor(i / 10)].push(unpagedLogs[i]);
        }

        setPages(page);

        let priceLogs = priceLoader();
        let sortedPrices = priceLogs.map((log) => new priceLogClass(priceDateFormatting(log.Date), log.Coin, log.Price, log.Volume));
        sortedPrices.sort((a, b) => a.date - b.date);
        setPrices(sortedPrices);  
    }, [])
    
    const onPrev = () =>{
        if(currentPage > 0){
            setCurrentPage((prevPage) => prevPage - 1);
            setEditTrade(prev => defaultEditTrade)
        }
    }

    const onNext = () =>{
        if(currentPage < maxPage - 1){
            setCurrentPage((prevPage) => prevPage + 1);
            setEditTrade(prev => defaultEditTrade)
        }
    }

    const onSetPage = (e) =>{
        if(e.target.value < maxPage - 1 && e.target.value > 0)setCurrentPage(() => e.target.value - 1);
    }

    const onDelete = (e) =>{
        e.preventDefault();
        let prevLogs = logs;
        prevLogs.splice(e.target.value, 1);
        for(let i = 0; i < prevLogs.length; i++){
            prevLogs[i].idx = i;
        }
        setLogs(cloneDeep(prevLogs));
        setMaxPage(Math.floor((prevLogs.length - 1) / 10) + 1);
    }

    const onEdit = (e, idx) =>{
        e.preventDefault();
        let prevLogs = logs;
        console.log(idx);
        console.log(currentPage);
        console.log(editTrade);
        prevLogs[idx] = new tradeLogClass (editTrade[idx - 10 * currentPage].date,editTrade[idx - 10 * currentPage].side, editTrade[idx - 10 * currentPage].volume, idx);
        
        console.log(prevLogs[idx]);
        console.log(editTrade[idx - 10 * currentPage]);
        prevLogs.sort((a, b) => b.date - a.date);
        for(let i =0; i < prevLogs.length; i++){
            prevLogs[i].idx = i;
        }
        setLogs(cloneDeep(prevLogs));
    }

    const onAdd = (e) =>{
        e.preventDefault();
        if(addTrade.date != null && addTrade.side != null && addTrade.volume != null){
            let prevLogs = logs;
            console.log(addTrade.volume, typeof(addTrade.volume))
            prevLogs.push(new tradeLogClass (addTrade.date, addTrade.side, addTrade.volume, 0));
            prevLogs.sort((a, b) => b.date - a.date);
            for(let i =0; i < prevLogs.length; i++){
                prevLogs[i].idx = i;
            }
            setLogs(cloneDeep(prevLogs));
            setMaxPage(Math.floor((prevLogs.length - 1) / 10) + 1);
        }
    }

    const onDate = (date) =>{
        setAddTrade(prev => {prev.date = date; return prev;})
    }
    
    return (
        <>
            <Profit logs={logs} prices={prices}/>
            <section>
                <div>매매 기록</div>
                <ul>
                    {logs.length > 0 &&
                        logs.slice(currentPage * 10, currentPage * 10 + 10).map((log) => {
                            let idx = log.idx;
                            return (
                                <>
                                    {log.print()}
                                    <button onClick={onDelete} value={idx}>삭제하기</button>
                                    {/* <form onSubmit={(e) => {console.log(idx);onEdit(e, idx);}} >
                                        <label>날짜{`${idx}`}:</label>
                                        <input type="text" onChange={(e) => setEditTrade(prev => {console.log(e.target);prev[idx - 10 * currentPage].date = e.target.value; return prev;})}  />
                                        <label>거래내용:</label>
                                        <input type="text" onChange={(e) => setEditTrade(prev => {console.log(e.target);prev[idx - 10 * currentPage].side = e.target.value; return prev;})} />
                                        <label>개수:</label>
                                        <input type="text" onChange={(e) => setEditTrade(prev => {console.log(e.target);prev[idx - 10 * currentPage].volume = Number(e.target.value); return prev;})} />
                                        <input type="submit" value={"수정하기"} />
                                    </form> */}
                                </>  
                            );
                        })
                    }
                    {logs.length === 0 &&
                        <div>거래 내역이 없습니다.</div>
                    }
                </ul>
                <button onClick={onPrev}>뒤로</button>
                <button onClick={onNext}>앞으로</button>
                <form onSubmit={onAdd}>
                    <label>날짜:</label>
                    {/* <input type="text" onChange={(e) => setAddTrade(prev => {prev.date = e.target.value; return prev;})} /> */}
                    {prices.length > 0 &&
                        <AvailableDate begin={prices[0].date} end={prices[prices.length - 1].date} onSubmit={onDate}/>
                    }
                    <label>거래내용:</label>
                    <select onChange={(e) => setAddTrade(prev => {prev.side = e.target.value; return prev;})}>
                        <option value="">거래내용</option>
                        <option value="buy">구매</option>
                        <option value="sell">판매</option>
                    </select>
                    {/* <input type="text" onChange={(e) => setAddTrade(prev => {prev.side = e.target.value; return prev;})} /> */}
                    <label>개수:</label>
                    <input type="text" onChange={(e) => setAddTrade(prev => {prev.volume = Number(e.target.value); return prev;})} />
                    <input type="submit" value="거래 내역 추가" />
                </form>
            </section>
        </>
    );
}