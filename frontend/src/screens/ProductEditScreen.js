import React,{useEffect,useState} from 'react'
import  axios  from 'axios';
import { Link } from 'react-router-dom'
import {Form,Button} from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../components/Loader'

import Message from '../components/Message'
import FormContainer from '../components/FormContainer'


import { listProductDetails,updateProduct} from '../actions/productActions'
import { PRODUCT_UPDATE_RESET} from '../constants/productConstants';
import { NumberFormat } from './NumberFormat';



export default function ProductEditScreen({match,history}) {

    const productId=match.params.id

    const [name,setName]=useState('')
    const [price,setPrice]=useState(0)
    const [image,setImage]=useState('')
    const [brand,setBrand]=useState('')
    const [category,setCategory]=useState('')
    const [countInStock,setCountInStock]=useState(0)
    const[description,setDescription]=useState('')
    const[uploading,setUploading]=useState(false)


    
    const dispatch = useDispatch()


    const productDetails=useSelector(state=>state.productDetails)
    const {error,loading,product}=productDetails

    const productUpdate=useSelector(state=>state.productUpdate)
    const {error:errorUpdate,loading:loadingUpdate,success:successUpdate}=productUpdate




    useEffect(()=> {

            if(successUpdate){
                dispatch({type:PRODUCT_UPDATE_RESET})
                history.push('/admin/productlist')
            }
            else
            {
        
            if(!product.name || product._id !==Number(productId)){
                dispatch(listProductDetails(productId))
            }
            else{
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)

                
            }
        }


        
        
    },[dispatch,product,productId,history,successUpdate])

    const submitHandler=(e)=>{
        e.preventDefault()
        //update product
        dispatch(updateProduct({
            _id:productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,

        }))
    }

    const uploadFileHandler=async(e)=>{
        const file=e.target.files[0]
        const formData=new FormData()

        formData.append('image',file)
        formData.append('product_id',productId)

        setUploading(true)

        try{
            const config={
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }
            const {data}=await axios.post(`/api/products/upload/`,formData,config)
            setImage(data)
            setUploading(false)


        }catch (error) {
            setUploading(false)


        }

    }

    return (
    <div>
            <Link to='/admin/productlist'>Go Back</Link>

            <FormContainer>

            <h1>EDIT PRODUCT</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            
    {loading?<Loader />:error?<Message variant='danger'>{error}</Message>:(

<Form onSubmit={submitHandler}>
<Form.Group controlId='name'>
        <Form.Label>NAME</Form.Label>
        <Form.Control 
            
            type='name'
            placeholder='ENTER NAME'
            value={name}
            onChange={(e)=>setName(e.target.value)}
        >

        </Form.Control>
    </Form.Group>

    <Form.Group controlId='price'>
        <Form.Label>PRICE</Form.Label>
        <Form.Control 
            
            type='number'
            placeholder='ENTER PRICE'
            value={NumberFormat(price)}
            onChange={(e)=>setPrice(e.target.value)}
        >

        </Form.Control>
    </Form.Group>

    <Form.Group controlId='image'>
        <Form.Label>IMAGE</Form.Label>
        <Form.Control 
            
            type='text'
            placeholder='ENTER IMAGE'
            value={image}
            onChange={(e)=>setImage(e.target.value)}
        >

        </Form.Control>
        <Form.File
            id='image-file'
            label='Choose file'
            custom
            onChange={uploadFileHandler}
        >

        </Form.File>
        {uploading && <Loader />}
    </Form.Group>

    <Form.Group controlId='brand'>
        <Form.Label>BRAND</Form.Label>
        <Form.Control 
            
            type='text'
            placeholder='ENTER BRAND'
            value={brand}
            onChange={(e)=>setBrand(e.target.value)}
        >

        </Form.Control>
    </Form.Group>

    <Form.Group controlId='countinstock'>
        <Form.Label>STOCK</Form.Label>
        <Form.Control 
            
            type='number'
            placeholder='ENTER STOCK'
            value={countInStock}
            onChange={(e)=>setCountInStock(e.target.value)}
        >

        </Form.Control>
    </Form.Group>

    <Form.Group controlId='category'>
        <Form.Label>CATEGORY</Form.Label>
        <Form.Control 
            
            type='text'
            placeholder='ENTER CATEGORY'
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
        >

        </Form.Control>
    </Form.Group>

    <Form.Group controlId='description'>
        <Form.Label>DESCRIPTION</Form.Label>
        <Form.Control 
            
            type='text'
            placeholder='ENTER DESCRIPTION'
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
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

    )}

            
    </FormContainer>

            

    </div>
    )
}




