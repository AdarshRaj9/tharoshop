import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import {Form,Button,Row,Col} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../components/Loader'

import Message from '../components/Message'
import FormContainer from '../components/FormContainer'


import { register } from '../actions/userActions'



export default function RegisterScreen({location,history}) {

    const [name,setName]=useState('')
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [confirmPassword,setconfirmPassword]=useState('')
    const [message,setMessage]=useState('')

    const dispatch = useDispatch()

    const redirect=location.search?location.search.split('=')[1]:'/'

    const userRegister=useSelector(state=>state.userRegister)
    const {error,loading,userInfo}=userRegister

    useEffect(()=> {
        if(userInfo)
        {
            history.push(redirect)
        }
    },[history,userInfo,redirect])

    const submitHandler=(e)=>{
        e.preventDefault()
        if(password!==confirmPassword)
        {
            setMessage('Passwords do not match')
        }
        else
        {
            dispatch(register(name,email,password))
        }
    }

    return (
        <FormContainer>
            <h1>SIGN IN</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                    <Form.Label>NAME</Form.Label>
                    <Form.Control 
                        required
                        type='name'
                        placeholder='ENTER NAME'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>EMAIL ADDRESS</Form.Label>
                    <Form.Control 
                        required
                        type='email'
                        placeholder='ENTER EMAIL'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>PASSWORD</Form.Label>
                    <Form.Control 
                        required
                        type='password'
                        placeholder='ENTER PASSWORD'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>CONFIRM PASSWORD</Form.Label>
                    <Form.Control 
                        required
                        type='password'
                        placeholder='CONFIRM PASSWORD'
                        value={confirmPassword}
                        onChange={(e)=>setconfirmPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>
                <Button 
                    type="submit"
                    variant="primary"
                >
                    REGISTER

                </Button>

            </Form>
            <Row className='py-3'>
                <Col>
                     HAVE AN ACCOUNT ? <Link to=
                    {redirect?`login?redirect=${redirect}`:'/login'}
                    >
                        SIGN IN

                    </Link>
                </Col>

            </Row>
            
        </FormContainer>
    )
}




