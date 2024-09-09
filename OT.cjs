function calculateOvertime(startDate, startTime, endDate, endTime) {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const isWeekend = startDateTime.getDay() === 6 || startDateTime.getDay() === 0; // Saturday or Sunday
    const isSameDay = startDateTime.toDateString() === endDateTime.toDateString();

    const startHour = startDateTime.getHours() + startDateTime.getMinutes() / 60;
    const endHour = endDateTime.getHours() + endDateTime.getMinutes() / 60;

    const workStart = 8.5;
    const workEnd = 17.5;
    const lunchStart = 12;
    const lunchEnd = 13;

    let OT = 0;

    if (isWeekend) {
        if (isSameDay) {
            if (startHour >= workStart && endHour <= workEnd) {
                if (startHour <= lunchStart && endHour >= lunchEnd) {
                    OT = (lunchStart - startHour) + (endHour - lunchEnd);
                } else if (endHour <= lunchStart || startHour >= lunchEnd) {
                    OT = endHour - startHour;
                } else {
                    OT = 0;
                }
            } else {
                if (startHour > workEnd) {
                    OT = (24 - startHour) * 3 + endHour * 3;
                } else if (startHour >= lunchEnd) {
                    OT = (workEnd - startHour) + (24 - workEnd) * 3 + endHour * 3;
                } else if (startHour <= workStart && endHour >= workStart) {
                    OT = (workStart - startHour) + (workEnd - workStart) + (24 - workEnd) * 3 + endHour * 3;
                } else if (startHour <= workStart && endHour < workStart) {
                    OT = (workStart - startHour) * 3 + (workEnd - workStart) + (24 - workEnd) * 3 + endHour * 3;
                } else if (startHour >= workStart && endHour < workStart) {
                    OT = (workStart - startHour) * 3 + endHour * 3;
                } else {
                    OT = 0;
                }
            }
        } else {
            // Handle overtime calculation spanning multiple days
            OT = 0;
        }
    } else {
        if (isSameDay) {
            if (startHour >= workStart && endHour <= workEnd) {
                if (startHour <= lunchStart && endHour >= lunchEnd) {
                    OT = (lunchStart - startHour) * 1.5 + (endHour - lunchEnd) * 1.5;
                } else if (endHour <= lunchStart || startHour >= lunchEnd) {
                    OT = (endHour - startHour) * 1.5;
                } else {
                    OT = 0;
                }
            } else {
                if (startHour > workEnd) {
                    OT = (24 - startHour) * 1.5 + endHour * 1.5;
                } else if (startHour >= lunchEnd) {
                    OT = (workEnd - startHour) + (24 - workEnd) * 1.5 + endHour * 1.5;
                } else if (startHour <= workStart && endHour >= workStart) {
                    OT = (workStart - startHour) + (workEnd - workStart) * 1.5 + (24 - workEnd) * 1.5 + endHour * 1.5;
                } else if (startHour <= workStart && endHour < workStart) {
                    OT = (workStart - startHour) * 1.5 + (workEnd - workStart) * 1.5 + (24 - workEnd) * 1.5 + endHour * 1.5;
                } else if (startHour >= workStart && endHour < workStart) {
                    OT = (workStart - startHour) * 1.5 + endHour * 1.5;
                } else {
                    OT = 0;
                }
            }
        } else {
            // Handle overtime calculation spanning multiple days
            OT = 0;
        }
    }

    return OT;
}

// Example usage
// const startDate = "2024-08-20";
// const startTime = "08:00:00";
// const endDate = "2024-08-20";
// const endTime = "17:00:00";

// console.log(calculateOvertime(startDate, startTime, endDate, endTime));

module.exports = calculateOvertime;