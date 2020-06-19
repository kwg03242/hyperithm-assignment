import React, { useState, useEffect } from 'react';
const defaultDate = new Date(0);

export function AvailableDate ( { begin = new Date(0), end = new Date(0), onSubmit }) {
    const [beginDate, setBeginDate] = useState(defaultDate);
    const [endDate, setEndDate] = useState(defaultDate);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [date, setDate] = useState(null);

    useEffect(() => {
        if(end - begin > 0){
            setBeginDate(begin);
            setEndDate(end);
        }
    }, [begin, end])

    return (
        <>
            <select onChange={e => {setYear(Number(e.target.value));}}>
                <option value="">년</option>
                {Array(endDate.getFullYear() - beginDate.getFullYear() + 1).fill().map((_, i) => <option value={beginDate.getFullYear() + i}>{beginDate.getFullYear() + i}</option>)}
            </select>
            <select onChange={e => setMonth(Number(e.target.value))}>
                <option value="">월</option>
                {year === beginDate.getFullYear() &&
                    Array(12 - beginDate.getMonth()).fill().map((_, i) => <option value={i + beginDate.getMonth()}>{i + beginDate.getMonth() + 1}</option>)
                }
                {year === endDate.getFullYear() &&
                    Array(endDate.getMonth() + 1).fill().map((_, i) => <option value={i}>{i + 1}</option>)
                }
                {year > beginDate.getFullYear() && year < endDate.getFullYear() &&
                    Array(12).fill().map((_, i) => <option value={i}>{i + 1}</option>)
                }
            </select>
            <select onChange={e => {setDate(Number(e.target.value)); onSubmit(new Date(year, month, e.target.value));}}>
                <option value="">일</option>
                {year === beginDate.getFullYear() && month === beginDate.getMonth() &&
                    Array(new Date(year, month + 1, 0).getDate() - beginDate.getDate() + 1).fill().map((_, i) => <option value={i + beginDate.getDate()}>{i + beginDate.getDate()}</option>)
                }
                {year === endDate.getFullYear() && month === endDate.getMonth() &&
                    Array(endDate.getDate()).fill().map((_, i) => <option value={i + 1}>{i + 1}</option>)
                }
                {(year > beginDate.getFullYear() || month > beginDate.getMonth()) && (year < endDate.getFullYear() || month < endDate.getMonth()) &&
                    Array(new Date(year, month + 1, 0).getDate()).fill().map((_, i) => <option value={i + 1}>{i + 1}</option>)
                }
            </select>
        </>
    )
}