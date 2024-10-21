
interface CalculateRemainingTimeProps {
    startTime: number;
    endTime: number;
}
export const CalculateRemainingTime = (
    {
        startTime,
        endTime,
    }: CalculateRemainingTimeProps,
) => {
    const remainingTime = endTime - startTime;
    const remainingTimeString = `${Math.floor(remainingTime / 1000 / 60)}:${Math.floor(remainingTime / 1000 % 60)}`;
    return (
        <span>{remainingTimeString}</span>
    );
}