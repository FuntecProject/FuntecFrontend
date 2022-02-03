import React from "react"
import Swal from "sweetalert2"

const errorMessageWithoutClick = (MySwal: typeof Swal, message: React.ReactElement, time?: number) => {
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

const errorMessageWithClick = (MySwal: typeof Swal, message: React.ReactElement) => {
    MySwal.fire({
        icon: 'error',
        title: <div style={{fontFamily: 'Quicksand, sans-serif'}}>{message}</div>,
        showConfirmButton: true
    })
}

const successMessageWithoutClick = (
    MySwal: typeof Swal, 
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
    MySwal: typeof Swal,
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