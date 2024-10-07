const getInsertData = (owner, task,service, startDate, endDate) => {
    var res = [];
    const options = { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };

    const startDateClone = new Date(startDate);
    const endDateClone = new Date(endDate);
    startDateClone.setHours(0, 0, 0, 0);
    endDateClone.setHours(0, 0, 0, 0);
    const diffInMs = endDateClone - startDateClone;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) ;
    var currectDate = new Date(startDate);
    var endcurrectDate = new Date(endDate);
    if(diffInDays == 0){
        const dateStr = currectDate.toLocaleDateString("en-US", options).split(", ")[0];
        const dayTitle = currectDate.getDay() == 0 || currectDate.getDay() == 6 ? "Weekend" : "Weekday";
        const startTime = currectDate.toLocaleTimeString("en-US", options);
        const endTime = endcurrectDate.toLocaleTimeString("en-US", options);
        res.push({
            owner: owner,
            date: dateStr,
            type: dayTitle,
            task: task,
            service: service,
            startTime: startTime,
            endTime: endTime
        })
    }
    else{
        for (let i = 0; i <= diffInDays; i++) {
            const dateStr = currectDate.toLocaleDateString("en-US", options).split(", ")[0];
            const dayTitle = currectDate.getDay() == 0 || currectDate.getDay() == 6 ? "Weekend" : "Weekday";
            if(i!=0 && i!=diffInDays){
                res.push({
                    owner: owner,
                    date: dateStr,
                    type: dayTitle,
                    task: task,
                    service: service,
                    startTime: "00:00:00",
                    endTime: "24:00:00",
                })
            }
            else{
                if(i==0){
                    const startTime = currectDate.toLocaleTimeString("en-US", options);
                    res.push({
                        owner: owner,
                        date: dateStr,
                        type: dayTitle,
                        task: task,
                        service: service,
                        startTime: startTime,
                        endTime: "24:00:00",
                    })
                }
                else{
                    const endTime = endcurrectDate.toLocaleTimeString("en-US", options);
                    res.push({
                        owner: owner,
                        date: dateStr,
                        type: dayTitle,
                        task: task,
                        service: service,
                        startTime: "00:00:00",
                        endTime: endTime,
                    })
                }
            }

            currectDate.setDate(currectDate.getDate() + 1);
        }
    }
    return res;

}

// const x = getInsertData("owner", "task", "2021-09-01T01:30:00.000Z", "2021-09-02T10:30:00.000Z")
// console.log(x);

module.exports = getInsertData;