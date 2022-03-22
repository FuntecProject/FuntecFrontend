import React from "react"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

let MySwal = withReactContent(Swal)

const errorMessageWithoutClick = (message: React.ReactElement, time?: number) => {
    if (time == undefined) {
        time = 1500
    }

    MySwal.fire({
        icon: 'error',
        title: <div style={{fontFamily: 'Quicksand, sans-serif'}}>{message}</div>,
        showConfirmButton: false,
        timer: time
    })
}

const errorMessageWithClick = (message: React.ReactElement) => {
    MySwal.fire({
        icon: 'error',
        title: <div style={{fontFamily: 'Quicksand, sans-serif'}}>{message}</div>,
        showConfirmButton: true
    })
}

const successMessageWithoutClick = (
    message: React.ReactElement, 
    time?: number
) => {
    if (time == undefined) {
        time = 1500
    }

    MySwal.fire({
        icon: 'success',
        title: <div style={{fontFamily: 'Quicksand, sans-serif'}}>{message}</div>,
        showConfirmButton: false,
        timer: time
    })
}

const sucessMessageWithclick = (
    message: React.ReactElement
) => {
    MySwal.fire({
        icon: 'success',
        title: <div style={{fontFamily: 'Quicksand, sans-serif'}}>{message}</div>,
        showConfirmButton: true
    })
}

export {
    errorMessageWithoutClick,
    errorMessageWithClick,
    successMessageWithoutClick,
    sucessMessageWithclick
}