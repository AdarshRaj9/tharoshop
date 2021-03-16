import React,{useEffect,useState} from 'react'
import {Form,Button,Col,Row,ListGroup,Image,Card} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'
import { PayPalButton } from 'react-paypal-button-v2';
import Message from '../components/Message'
import Loader from '../components/Loader'


import { getOrderDetails,payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET} from '../constants/orderConstants'
import { NumberFormat } from './NumberFormat';





function OrderScreen({ match }) {
    const orderId=match.params.id
    const dispatch=useDispatch()

    const [sdkReady,setSdkReady] = useState(false)


    const orderDetails=useSelector(state=>state.orderDetails)
    const { order,error,loading } = orderDetails


    const orderPay=useSelector(state=>state.orderPay)
    const { loading:loadingPay,success:successPay } = orderPay

    // console.log(order)

    if(!loading && !error)
    { 
        order.itemsPrice=order.orderItems.reduce((acc,item)=>acc+item.price*item.qty,0).toFixed(2)
    }

    const addPayPalScript = () =>{
        const script=document.createElement('script')
        script.type='text/javascript'
        script.src='https://www.paypal.com/sdk/js?client-id=AQ5xYA1OGUciUS1MFC7_iHBSt9ejDAU_4ffZCY0M-1FXPjhfMebTLeioII6rWYGj6vXcBySb4jvGfxRU'
        script.async = true
        script.onload = function(){
            setSdkReady(true)
        }
        document.body.appendChild(script)
        
    }

    useEffect(()=> {
        if(!order || successPay || order._id!==Number(orderId)){
            dispatch({type:ORDER_PAY_RESET})
            dispatch(getOrderDetails(orderId))
        }
        else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript()

            }
            else{
                setSdkReady(true)
            }
        }
        
    },[dispatch,order,orderId,successPay])

    const successPaymentHandler=(paymentResult)=>{
        dispatch(payOrder(orderId,paymentResult))

    }



    
    return loading?(
        <Loader/>
    ):error?(
    <Message variant="danger">{error}</Message>
    ):
    
    
        (
            <div>
                <h1>ORDER: {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>SHIPPING</h2>
                                <p><strong>Name: </strong>{order.user.name}</p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>

                                <p>
                                    <strong>Shipping: </strong>
                                    {order.shippingAddress.address},{order.shippingAddress.city},
                                    {' '}
                                    {order.shippingAddress.postalCode},
                                    {' '}
                                    {order.shippingAddress.state},
                                    {' '}
                                    {order.shippingAddress.country}

                                </p>
                                {order.isDelivered?(
                                    <Message variant="success">Delivered on {order.deliveredAt}</Message>
                                ):(
                                    <Message variant="warning">Not Delivered</Message>
 
                                )
                                }
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>PAYMENT METHOD</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}

                                </p>
                                {order.isPaid?(
                                    <Message variant="success">Paid on {order.paidAt}</Message>
                                ):(
                                    <Message variant="warning">Not Paid</Message>
 
                                )
                                }
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>ORDER ITEMS</h2>
                                {order.orderItems.length===0?<Message variant="info">ORDER IS EMPTY</Message>
                                
                                :(
                                    <ListGroup variant="flush">
                                        {order.orderItems.map((item,index)=>(
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col> 

                                                <Col>
                                                    <Link to={`/product/${item.product}`}><h4>{item.name}</h4></Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} X ${item.price}=${(item.qty*item.price).toFixed(2)}
                                                
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
                                        <Col>{NumberFormat(order.itemsPrice)}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Shipping:
                                        </Col>
                                        <Col>{NumberFormat(order.shippingPrice)}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Tax:
                                        </Col>
                                        <Col>{NumberFormat(order.taxPrice)}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Total:
                                        </Col>
                                        <Col>{NumberFormat(order.totalPrice)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {!sdkReady?(
                                            <Loader />
                                        ):(
                                            <PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />

                                        )}
                                    </ListGroup.Item>
                                )}
                                
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>

            </div>
        )

}

export default OrderScreen
