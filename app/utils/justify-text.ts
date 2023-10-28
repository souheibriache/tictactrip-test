export function justifyText( text: string): string{
    const words : string[] = text.split(' ')
    const lines : string[] = []
    let line:string = ''
    words.forEach(word => {
        if((line + word).length <= 80){
            line += word + ' ';
        }else{
            lines.push(line.trim())
            line= word + ' '
        }
    })

    lines.push(line.trim())
    return lines.join('\n')
}
