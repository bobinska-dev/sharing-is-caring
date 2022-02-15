
import React from 'react'
import PropTypes from 'prop-types'
import { IoBookOutline } from "react-icons/io5";


const PubReference = props => (
    <span style={{ background: '#8400e928' }}>
        <IoBookOutline style={{ color: '#8400e9', padding: '0 5px' }} /> {props.children}
    </span>
)

PubReference.propTypes = {
    children: PropTypes.node.isRequired
}

export default PubReference