import moment from "moment";

export const unixToGMTTime = (time) => {
    let timestamp = moment.unix(time);
    timestamp = timestamp.format("YYYY-MM-DD HH:mm:ss")

    return timestamp;
}

