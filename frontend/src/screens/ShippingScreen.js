import React,{useEffect,useState} from 'react'
import {Form,Button} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'

import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps';


import { saveShippingAddress } from '../actions/cartActions';




function ShippingScreen({history}) {

    const cart=useSelector(state=>state.cart)

    const { shippingAddress }=cart

    const dispatch =useDispatch()

    const [address,setAddress]=useState(shippingAddress.address)
    const [city,setCity]=useState(shippingAddress.city)
    const [postalCode,setPostalCode]=useState(shippingAddress.postalCode)
    const [state,setState]=useState(shippingAddress.state)

    const [country,setCountry]=useState(shippingAddress.country)

    const submitHandler=(e)=>{
        e.preventDefault()
        dispatch(saveShippingAddress({address,city,postalCode,state,country}))
        history.push('/payment')
    }


    return (
        <FormContainer>
            <CheckoutSteps step1 step2/>
            <h1>SHIPPING</h1>
            <Form onSubmit={submitHandler}>
            <Form.Group controlId='address'>
                    <Form.Label>ADDRESS</Form.Label>
                    <Form.Control 
                        required
                        type='text'
                        placeholder='ENTER ADDRESS'
                        value={address?address:''}
                        onChange={(e)=>setAddress(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>
            
                <Form.Group controlId='city'>
                    <Form.Label>CITY</Form.Label>
                    <Form.Control 
                        required
                        type='text'
                        placeholder='ENTER CITY'
                        value={city?city:''}
                        onChange={(e)=>setCity(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode'>
                    <Form.Label>POSTAL CODE</Form.Label>
                    <Form.Control 
                        required
                        type='text'
                        placeholder='ENTER POSTAL CODE'
                        value={postalCode?postalCode:''}
                        onChange={(e)=>setPostalCode(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='state'>
                    <Form.Label>STATE</Form.Label>
                    <Form.Control 
                        required
                        type='text'
                        placeholder='ENTER STATE'
                        value={state?state:''}
                        onChange={(e)=>setState(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='country'>
                    <Form.Label>COUNTRY</Form.Label>
                    <Form.Control 
                        required
                        type='text'
                        placeholder='ENTER COUNTRY'
                        value={country?country:''}
                        onChange={(e)=>setCountry(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary">
                    CONTINUE
                </Button>

            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
