import React,{useEffect,useState} from 'react'
import {Form,Button,Col,Row,ListGroup,Image,Card} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'
import Message from '../components/Message'

import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import { NumberFormat } from './NumberFormat';




function PlaceOrderScreen({ history }) {

    const orderCreate=useSelector(state=>state.orderCreate)
    const { order,error,success } = orderCreate
    // console.log(order)

    const dispatch=useDispatch()
    const cart=useSelector(state=>state.cart)

    cart.itemsPrice=cart.cartItems.reduce((acc,item)=>acc+item.price*item.qty,0).toFixed(2)
    cart.shippingPrice=(cart.itemsPrice>100?0:10).toFixed(2)
    cart.taxPrice=(Number(0.082)*cart.itemsPrice).toFixed(2)
    cart.totalPrice=(Number(cart.itemsPrice)+Number(cart.shippingPrice)+Number(cart.taxPrice)).toFixed(2)

    if(!cart.paymentMethod){
        history.push('/payment')
    }

    useEffect(()=> {
        if(success){
            history.push(`/order/${order._id}`)
            dispatch({type:ORDER_CREATE_RESET})
        }
    },[success,history])



    const placeOrder = () =>{
        dispatch(createOrder({
            orderItems:cart.cartItems,
            shippingAddress:cart.shippingAddress,
            paymentMethod:cart.paymentMethod,
            itemsPrice:cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            taxPrice:cart.taxPrice,
            totalPrice:cart.totalPrice,
        }))
    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>SHIPPING</h2>
                            <p>
                                <strong>Shipping: </strong>
                                {cart.shippingAddress.address},{cart.shippingAddress.city},
                                {' '}
                                {cart.shippingAddress.postalCode},
                                {' '}
                                {cart.shippingAddress.state},
                                {' '}
                                {cart.shippingAddress.country}

                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>PAYMENT METHOD</h2>
                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}

                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>ORDER ITEMS</h2>
                            {cart.cartItems.length===0?<Message variant="info">YOUR CART IS EMPTY</Message>
                            
                            :(
                                <ListGroup variant="flush">
                                    {cart.cartItems.map((item,index)=>(
                                       <ListGroup.Item key={index}>
                                           <Row>
                                              <Col md={2}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                              </Col> 

                                              <Col>
                                                <Link to={`/product/${item.product}`}><h4>{item.name}</h4></Link>
                                              </Col>

                                              <Col md={4}>
                                                  {item.qty} X {NumberFormat(item.price)}={NumberFormat((item.qty*item.price).toFixed(2))}
                                              
                                              </Col>
                                           </Row>
                                       </ListGroup.Item> 
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                               <h2>ORDER SUMMARY</h2> 
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Items:
                                    </Col>
                                    <Col>{NumberFormat(cart.itemsPrice)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Shipping:
                                    </Col>
                                    <Col>{NumberFormat(cart.shippingPrice)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Tax:
                                    </Col>
                                    <Col>{NumberFormat(cart.taxPrice)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Total:
                                    </Col>
                                    <Col>{NumberFormat(cart.totalPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'> { error } </Message> }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button 
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems===0}
                                    onClick={placeOrder}
                                >
                                    Place Order

                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>

        </div>
    )
}

export default PlaceOrderScreen
