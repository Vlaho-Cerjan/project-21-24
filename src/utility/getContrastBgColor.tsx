// Get contrast background color based on text color

const calculateLuminance = (color: string) => {
    if (color.indexOf('rgba') === 0) {
        const rgba = color.replace('rgba(', '').replace(')', '').split(',')
        const r = parseInt(rgba[0]) / 255
        const g = parseInt(rgba[1]) / 255
        const b = parseInt(rgba[2]) / 255
        const a = parseInt(rgba[3]) / 255

        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const rgb = color.replace('rgb(', '').replace(')', '').split(',')
    const r = parseInt(rgb[0]) / 255
    const g = parseInt(rgb[1]) / 255
    const b = parseInt(rgb[2]) / 255

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getBgColor(txtColor: any, bgColor?: { light: any; dark: any; }) {
    // chekc if textColor is hex and convert to rgb
    if (txtColor.indexOf('#') === 0) {
        const hex = txtColor.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        txtColor = `rgb(${r},${g},${b})`
    }

    const color1luminance = calculateLuminance(txtColor);
    const whiteLuminance = calculateLuminance(bgColor ? bgColor.light : 'rgba(255,255,255,0.8)');
    const darkLuminance = calculateLuminance(bgColor ? bgColor.dark : 'rgba(0,0,0,0.8)');

    const whiteRatio = color1luminance > whiteLuminance
        ? ((whiteLuminance + 0.05) / (color1luminance + 0.05))
        : ((color1luminance + 0.05) / (whiteLuminance + 0.05));

    const blackRatio = color1luminance > darkLuminance
        ? ((darkLuminance + 0.05) / (color1luminance + 0.05))
        : ((color1luminance + 0.05) / (darkLuminance + 0.05));

    return whiteRatio < blackRatio ? (bgColor ? bgColor.light : 'rgba(255,255,255,0.8)') : (bgColor ? bgColor.dark : 'rgba(0,0,0,0.8)')
}