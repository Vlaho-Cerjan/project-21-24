export default function utf8ToB64( str: string ) {
    const data = Buffer.from( str, 'utf8' );
    return data.toString( 'base64' );
}