export function HexToRgba(hex: string) {
    const regRes = hex.match(/\w\w/g);
    if (regRes) {
        const [r, g, b, a] = regRes.map(x => parseInt(x, 16));
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    }
    return "Error While Converting Hex to RGBA";
}