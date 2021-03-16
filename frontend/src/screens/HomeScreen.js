import React,{ useState,useEffect } from 'react'
import { useDispatch,useSelector  } from 'react-redux'
import { Row,Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

import { listProducts } from '../actions/productActions'


function HomeScreen({history}) {

    const dispatch=useDispatch()
    const productList=useSelector(state=>state.productList)
    const { error,loading,products,page,pages  }=productList

    let keyword=history.location.search

    useEffect(() => {
        dispatch(listProducts(keyword))
        
               
            
    }, [dispatch,keyword])
    return (
        <div>
            {!keyword && <ProductCarousel/>}
            <h1>Latest Product</h1>
            {
            loading?<Loader />:
            error?<Message variant='danger'>{error.toUpperCase()}</Message>
            :
            <div>
            <Row>
                {products.map(product=>(
                    <Col key={product._id} sm={12} md={4} Lg={4} xL={3}>
                    <h3>
                        <Product product={product} />
                    </h3>
                    </Col>
                ))}
            </Row>
            <Paginate page={page} pages={pages} keyword={keyword}/>
            </div>

            }
            
        </div>
    )
}

export default HomeScreen
