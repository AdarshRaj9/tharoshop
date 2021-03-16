import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import {Form,Button,Row,Col,Table} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../components/Loader'

import Message from '../components/Message'
import FormContainer from '../components/FormContainer'


import { getUserDetails,updateUserProfile} from '../actions/userActions'

import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

import { listMyOrders } from '../actions/orderActions'

import {  NumberFormat} from './NumberFormat';




function ProfileScreen({history}) {

    const [name,setName]=useState('')
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [confirmPassword,setconfirmPassword]=useState('')
    const [message,setMessage]=useState('')

    const dispatch = useDispatch()


    const userDetails=useSelector(state=>state.userDetails)
    const {error,loading,user}=userDetails


    const userLogin=useSelector(state=>state.userLogin)
    const {userInfo}=userLogin 


    const userUpdateProfile=useSelector(state=>state.userUpdateProfile)
    const {success}=userUpdateProfile 

    const orderListMy=useSelector(state=>state.orderListMy)
    const {loading:loadingOrders,error:errorOrders,orders}=orderListMy 



    useEffect(()=> {
        if(!userInfo)
        { 
            history.push('/login')
        }
        else
        {
            if(!user || !user.name || success || userInfo._id!==user._id)
            {
                dispatch({type: USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            }
            else
            { 
                setName(user.name)
                setEmail(user.email)
            }
        }
    },[dispatch,history,userInfo,user,success])

    const submitHandler=(e)=>{
        e.preventDefault()
        if(password!==confirmPassword)
        {
            setMessage('Passwords do not match')
        }
        else
        {   
            dispatch(updateUserProfile({
                'id':user._id,
                'name':name,
                'email':email,
                'password': password
        }))
        setMessage('')

        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>USER PROFILE</h2>

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
                    UPDATE

                </Button>

            </Form>

            </Col>
            <Col md={9}>
                <h2>MY ORDERS</h2>
                {loadingOrders?(
                    <Loader />
                ):errorOrders?(
                <Message variant="danger">{errorOrders}</Message>
                ):(
                    <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                                

                            </tr>
                            </thead>
                            <tbody>
                                {orders.map(order=>(
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring((0,10))}</td>
                                        <td>{NumberFormat(order.totalPrice)}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0,10) :(
                                            //<i className='fas fa-time' style={{ color:'red'}}></i>
                                            <i class="fa fa-times"  style={{color:'red'}}></i>

                                        )}</td>
                                        <td>
                                            <Link to={`/order/${order._id}`}>
                                                <Button className='btn-sm'>Details</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                    </Table>
                )}
            </Col>
            
        </Row>
    )
}

export default ProfileScreen
