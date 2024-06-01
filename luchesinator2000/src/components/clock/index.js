import { useEffect, useState } from "react"

const formatDateToHour = (dateToTransform) => {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(dateToTransform)
}

export const Clock = (props) => {
    const [currentDateTime, setCurrentDateTime] = useState()

    useEffect(() => {
        console.log('Comecei a contar')
        const increaseDateInterval = setInterval(() => {
            setCurrentDateTime(new Date())
        }, 1000)

        return () => {
            console.log('Parei de contar')
            clearInterval(increaseDateInterval)
        }
    }, [])

    return <time dateTime={currentDateTime} {...props}>{formatDateToHour(currentDateTime)}</time>
}