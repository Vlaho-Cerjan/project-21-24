export function RgbaToHex8(rgba: string) {
    const [r, g, b, a] = rgba.replace(/rgba?\(|\s+|\)/g, '').split(',');
    const hex = [r, g, b].map(x => {
        const hex = Number(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    const alpha = Math.round(Number(a) * 255).toString(16);
    return `#${hex}${alpha}`;
}