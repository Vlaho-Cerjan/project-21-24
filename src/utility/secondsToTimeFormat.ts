const SecondsToTimeFormat = (seconds: number | null | undefined): string => {
    if(seconds === undefined || !seconds) return "";
    let hours: number | string = Math.floor(seconds / 3600);
    let minutes: number | string = Math.floor((seconds - hours * 3600) / 60);
    let secondsLeft: number | string = (seconds - hours * 3600 - minutes * 60).toFixed(0);

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if(parseInt(secondsLeft) < 10) {
        secondsLeft = `0${secondsLeft}`;
    }

    if(hours > 0) {
        return `${hours}:${minutes}:${secondsLeft}`;
    }else if(typeof minutes === "string" ? parseInt(minutes) > 0 : minutes > 0) {
        return `${minutes}:${secondsLeft}`;
    }else{
        return `00:${secondsLeft}`;
    }
}

export default SecondsToTimeFormat;