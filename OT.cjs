function calculateOvertime(startDate,endDate) {
    const isWeekend = startDate.getDay() === 6 || startDate.getDay() === 0;
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;

    let options = { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };

    let formattedTime = startDate.toLocaleTimeString("en-US", options);
    // console.log(formattedTime);

    let OT = 0;
    let sections = [];
    if (isSameDay) {
        sections = getSectionsTimeSameDay(startHour,endHour,isSameDay);  
        if(isWeekend){
            OT = sections[0] * 3 + sections[1] * 1 + sections[2] * 1 + sections[3] * 3;
        } else{
            OT = sections[0] * 1.5 + sections[1] * 1 + sections[2] * 1 + sections[3] * 1.5;
        }

    } else {
        sections = getSectionsTimeNotSameDate(startHour,endHour,startDate,endDate);
        if(sections[4] == 1){
            for (let i = 0; i < sections.length; i++) {
                OT += sections[i][0] * 3 + sections[i][1] * 1 + sections[i][2] * 1 + sections[i][3] * 3;
            }
        } else{
            for (let i = 0; i < sections.length; i++) {
                OT += sections[i][0] * 1.5 + sections[i][1] * 1 + sections[i][2] * 1 + sections[i][3] * 1.5;
            }
        }
    }
    return OT;
}

const getSectionsTimeSameDay = (startHour,endHour) => {
    const workStart = 8.5;
    const workEnd = 17.5;
    const lunchStart = 12;
    const lunchEnd = 13;

    let sections = [];
    if(startHour < workStart){
        if(endHour <= workStart){
            sections.push(endHour - startHour);
            sections = sections.concat([0,0,0]);
        }
        else if(endHour <= lunchStart){
            sections.push(workStart - startHour);
            sections.push(endHour - workStart);
            sections = sections.concat([0,0]);
        }
        else if(endHour <= workEnd){
            sections.push(workStart - startHour);
            sections.push(endHour - startHour - 1);
            sections = sections.concat([0,0]);
        } 
        else {
            sections.push(workStart - startHour);
            sections.push(lunchStart - workStart);
            sections.push(workEnd - lunchEnd);
            sections.push(endHour - workEnd);
        }
    }
    else if(startHour < lunchStart){
        sections.push(0)
        if(endHour <= lunchStart){
            sections.push(endHour - startHour);
            sections = sections.concat([0,0]);
        }
        else if(endHour <= workEnd){
            sections.push(lunchStart - startHour);
            sections.push(endHour - lunchEnd);
            sections = sections.concat([0]);
        } 
        else {
            sections.push(lunchStart - startHour);
            sections.push(workEnd - lunchEnd);
            sections.push(endHour - workEnd);
        }
    }
    else if(startHour < workEnd){
        sections = [0,0];
        if(endHour <= workEnd){
            sections.push(endHour - startHour);
            sections.push(0);
        }
        else {
            sections.push(workEnd - startHour);
            sections.push(endHour - workEnd);
        }
        if(startHour < lunchEnd){
            sections[2] = sections[2] - 1;
        }
    }
    else{
        sections = [0,0,0];
        sections.push(endHour - startHour);
    }


    return sections;
}

const getSectionsTimeNotSameDate = (startHour,endHour,startDate,endDate) => {
    const startDateClone = new Date(startDate);
    const endDateClone = new Date(endDate);
    startDateClone.setHours(0, 0, 0, 0);
    endDateClone.setHours(0, 0, 0, 0);
    const diffInMs = endDateClone - startDateClone;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) ;
    let currectDay = startDate.getDay()
    let daySection = [];
    for (let i = 0; i <= diffInDays; i++) {
        if(i!=0 && i!=diffInDays){
            daySection.push(getSectionsTimeSameDay(0,24));
        }
        else{
            if(i==0){
                daySection.push(getSectionsTimeSameDay(startHour,24));
            }
            else{
                daySection.push(getSectionsTimeSameDay(0,endHour));
            }
        }
        if(currectDay == 6 || currectDay == 0){
            daySection[i].push(1);
            if(currectDay == 6){
                currectDay = -1;
            }
        } else{
            daySection[i].push(0);
            
        }
        currectDay++;
    }
    return daySection;
}


// const startDate = "2024-10-02";
// const startTime = "08:30:00";
// const endDate = "2024-10-02";
// const endTime = "23:00:00";

// console.log(calculateOvertime(new Date(`${startDate}T${startTime}`),new Date(`${endDate}T${endTime}`)));

module.exports = calculateOvertime;