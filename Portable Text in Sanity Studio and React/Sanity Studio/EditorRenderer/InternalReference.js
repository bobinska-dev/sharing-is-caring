
import React from 'react'
import PropTypes from 'prop-types'
import { BsSignpost } from "react-icons/bs";



const InternalReference = props => (

    <span style={{ background: '#2bd2da28' }}>
        <BsSignpost style={{ color: '#2bd2da', padding: '0 5px' }} /> {props.children}
    </span>

)

InternalReference.propTypes = {
    children: PropTypes.node.isRequired,
    reference: PropTypes.node.isRequired,

}

export default InternalReference