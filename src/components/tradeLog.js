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
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
    const [logs, setLogs] = useState([]);
    const [addTrade, setAddTrade] = useState({"date": null, "side": null, "volume": null});
    const [editTrade, setEditTrade] = useState({"date": null, "side": null, "volume": null});
    const [prices, setPrices] = useState([]);
    const [numberOfLogPerPage, setNumberOfLogPerPage] = useState(10);
    const [editIdx, setEditIdx] = useState(-1);

    useEffect (() => {
        let idx = 0;
        let tradeLogs = tradeLogLoader(); 
        let unpagedLogs = tradeLogs.map((log) => new tradeLogClass(tradeLogDateFormatting(log.time), log.side, log.volume, "BTC", 0));
        unpagedLogs.sort((a, b) => b.date - a.date);
        for(let i = 0; i < unpagedLogs.length; i++){
            unpagedLogs[i].idx = idx++;
        }
        setLogs(unpagedLogs);
        setMaxPage(Math.floor((unpagedLogs.length - 1) / numberOfLogPerPage) + 1);
        let priceLogs = priceLoader();
        let sortedPrices = priceLogs.map((log) => new priceLogClass(priceDateFormatting(log.Date), log.Coin, log.Price, log.Volume));
        sortedPrices.sort((a, b) => a.date - b.date);
        setPrices(sortedPrices);  
    }, [])
    
    const onPrev = () =>{
        if(currentPage > 0){
            setCurrentPage((prevPage) => prevPage - 1);
        }
    }

    const onNext = () =>{
        if(currentPage < maxPage - 1){
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }

    const onSetPage = (e) =>{
        if(e.target.value < maxPage - 1 && e.target.value > 0)setCurrentPage(() => e.target.value - 1);
    }

    const onDelete = (e) =>{
        e.preventDefault();
        if(window.confirm("삭제하시겠습니까?")){
            let prevLogs = logs;
            prevLogs.splice(e.target.value, 1);
            for(let i = 0; i < prevLogs.length; i++){
                prevLogs[i].idx = i;
            }
            setLogs(cloneDeep(prevLogs));
            setMaxPage(Math.floor((prevLogs.length - 1) / numberOfLogPerPage) + 1);
        }
    }

    const onAdd = (e) =>{
        e.preventDefault();
        if(addTrade.date != null && addTrade.side != null && addTrade.volume != null){
            let prevLogs = logs;
            console.log(addTrade.volume, typeof(addTrade.volume))
            prevLogs.push(new tradeLogClass (addTrade.date, addTrade.side, addTrade.volume, "BTC", 0));
            prevLogs.sort((a, b) => b.date - a.date);
            for(let i =0; i < prevLogs.length; i++){
                prevLogs[i].idx = i;
            }
            setLogs(cloneDeep(prevLogs));
            setMaxPage(Math.floor((prevLogs.length - 1) / numberOfLogPerPage) + 1);
        }
        else {
            window.location.alert("invalidate data");
        }
    }

    const onDate = (date) =>{
        setAddTrade(prev => {prev.date = date; return prev;})
    }

    const onEdit = (e) =>{
        setEditIdx(Number(e.target.value));
    }

    const onEditDate = (date) =>{
        setEditTrade(prev => {prev.date = date; return prev;})
    }

    const onEditConfirm = (e) =>{
        e.preventDefault();
        if(window.confirm("수정하시겠습니까?")){
            let prevLogs = logs;
            prevLogs[Number(e.target.value)].date = editTrade.date;
            prevLogs[Number(e.target.value)].side = editTrade.side;
            prevLogs[Number(e.target.value)].volume = editTrade.volume;
            for(let i = 0; i < prevLogs.length; i++){
                prevLogs[i].idx = i;
            }
            setLogs(cloneDeep(prevLogs));
            setEditIdx(-1);
        }
    }

    return (
        <>
            <section className="background">
                <div className="trade-log-wrapper">
                    <div className="title">매매 기록</div>
                    <label>표시 개수 
                        <select onChange={(e) => {
                            if(currentPage * Number(e.target.value) > logs.length - 1){setCurrentPage(Math.floor((logs.length - 1) / Number(e.target.value)))};
                            setNumberOfLogPerPage(Number(e.target.value));
                            setMaxPage(Math.floor((logs.length - 1) / Number(e.target.value)) + 1);
                        }}>
                            <option value={5}>5개</option>
                            <option value={10} selected>10개</option>
                            <option value={15}>15개</option>
                            <option value={20}>20개</option>
                        </select>
                    </label>
                    <ul>
                        {logs.length > 0 &&
                            logs.slice(currentPage * numberOfLogPerPage, currentPage * numberOfLogPerPage + numberOfLogPerPage).map((log) => {
                                let idx = log.idx;
                                return (
                                    <>
                                        {idx !== editIdx &&
                                            <div className="row">
                                                {log.print()}
                                                <button onClick={onDelete} value={idx}>삭제하기</button>
                                                <button onClick={onEdit} value={idx}>수정하기</button>
                                            </div>
                                        }
                                        {idx === editIdx &&
                                            <div className="row">
                                                <li className="trade-log">
                                                    <AvailableDate begin={prices[0].date} end={prices[prices.length - 1].date} onSubmit={onEditDate} />
                                                    <label>거래내용:</label>
                                                    <select onChange={(e) => setEditTrade(prev => {prev.side = e.target.value; return prev;})}>
                                                        <option value="">거래내용</option>
                                                        <option value="buy">구매</option>
                                                        <option value="sell">판매</option>
                                                    </select>
                                                    <label>개수:</label>
                                                    <input type="text" onChange={(e) => setEditTrade(prev => {prev.volume = Number(e.target.value); return prev;})} />
                                                </li>
                                                <button onClick={onEditConfirm} value={idx}>확인</button>
                                                <button onClick={onEdit} value={-1}>취소</button>
                                            </div>
                                        }
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
                        {prices.length > 0 &&
                            <AvailableDate begin={prices[0].date} end={prices[prices.length - 1].date} onSubmit={onDate}/>
                        }
                        <label>거래내용:</label>
                        <select onChange={(e) => setAddTrade(prev => {prev.side = e.target.value; return prev;})}>
                            <option value="">거래내용</option>
                            <option value="buy">구매</option>
                            <option value="sell">판매</option>
                        </select>
                        <label>개수:</label>
                        <input type="text" onChange={(e) => setAddTrade(prev => {prev.volume = Number(e.target.value); return prev;})} />
                        <input type="submit" value="거래 내역 추가" />
                    </form>
                </div>
            </section>
            <Profit logs={logs} prices={prices}/>
        </>
    );
}