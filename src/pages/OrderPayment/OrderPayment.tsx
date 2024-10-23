import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { createOrderApi } from 'src/apis/order.api'
import { PaymentEnum } from 'src/enums/PaymentEnum'
import { getItem, removeItem } from 'src/utils/localStorage'

const OrderPayment = () => {
  const { search } = useLocation()
  const [callOrderSuccess, setCallOrderSuccess] = useState(false)

  const query = new URLSearchParams(search)
  const isSuccess = query.get('status') === 'success'
  const createOrderMutation = useMutation({
    mutationFn: (data: { addressId: number; restaurantId: number; payment: PaymentEnum }) => createOrderApi(data),
    onSuccess: () => {
      setCallOrderSuccess(true)
      removeItem('address')
      removeItem('restaurant')
    },
    onError: () => {
      setCallOrderSuccess(false)
    }
  })
  const hasCalledApi = useRef(false)
  useEffect(() => {
    if (isSuccess && !hasCalledApi.current) {
      hasCalledApi.current = true // Prevent calling the API multiple times
      const addressId = getItem('address')
      const restaurantId = getItem('restaurant')
      createOrderMutation.mutate({ addressId, restaurantId, payment: PaymentEnum.BANK })
    }
  }, [])
  const success = isSuccess && callOrderSuccess

  return (
    <div className='bg-gray-100 h-screen flex items-center justify-center'>
      <div className='bg-white p-6  md:mx-auto'>
        {success ? (
          <svg viewBox='0 0 24 24' className='text-green-600 w-16 h-16 mx-auto my-6'>
            <path
              fill='currentColor'
              d='M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z'
            ></path>
          </svg>
        ) : (
          <svg viewBox='0 0 24 24' className='text-red-600 w-16 h-16 mx-auto my-6'>
            <path
              d='M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z'
              fill='currentColor'
            />
            <path d='M12 14V7' stroke='currentColor' strokeWidth='2' />
            <path
              d='M12 21C16.9706 21 21 16.9706 21 12C21 7.0294 16.9706 2.99994 12 2.99994C7.0294 2.99994 2.99994 7.0294 2.99994 12C2.99994 16.9706 7.0294 21 12 21Z'
              stroke='currentColor'
              strokeWidth='1.99991'
              fill='transparent'
            />
          </svg>
        )}

        <div className='text-center'>
          <h3 className='md:text-2xl text-base text-gray-900 font-semibold text-center'>
            {success ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          </h3>
          {success && (
            <>
              <p className='text-gray-600 my-2'>Cảm ơn bạn đã hoàn tất thanh toán trực tuyến của mình.</p>
              <p> Have a great day!</p>
            </>
          )}

          <div className='py-10 text-center'>
            <Link to='/' className='px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3'>
              Quay về
            </Link>
          </div>
        </div>
      </div>
      )
    </div>
  )
}

export default OrderPayment
