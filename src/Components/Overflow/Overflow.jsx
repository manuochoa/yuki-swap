import React from 'react'
import classes from './Overflow.module.css'

const Overflow = (props) => {
    const { children } = props

    return (
        <div className={classes.main}>
            {children}
        </div>
    )
}

export default Overflow