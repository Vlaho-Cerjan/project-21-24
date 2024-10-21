import { SecondsToHoursStrings } from './lang/secondsToHoursStrings';
import useTranslation from './useTranslation';

const SecondsToHours = (seconds: number): string | null => {
    const { t } = useTranslation(SecondsToHoursStrings);

    let hours: number | string = Math.floor(seconds / 3600);
    let minutes: number | string = Math.floor((seconds - (hours * 3600)) / 60);

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if(hours > 0) {
        return `${hours+" "+t('hrs')}`;
    }else if(typeof minutes === "string" ? parseInt(minutes) > 0 : minutes > 0) {
        return `${minutes+" "+t('min')}`;
    }else{
        return null;
    }
}

export default SecondsToHours;