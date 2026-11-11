import { apiUrl } from './api';
import { apiResolve } from './catalogApi';
import { CartItem,OrderFormData } from '../types';
import { loadRazorpayScript,openRazorpayCheckout } from './razorpay';
async function request(path:string,body?:unknown,access?:string){
  const response=await fetch(apiUrl(path),{method:body?'POST':'GET',credentials:'include',cache:'no-store',headers:{...(body?{'Content-Type':'application/json'}:{}),...(access?{'x-order-token':access}:{})},body:body?JSON.stringify(body):undefined});
  const data=await response.json();if(!response.ok)throw new Error(data.code||'Checkout unavailable');return data;
}
export async function secureGuestCheckout(items:CartItem[],customer:OrderFormData){
  // Store only an opaque recovery handle, never customer data or browser totals.
  const prior=sessionStorage.getItem('myb-maria-pending');
  if(prior){const saved=JSON.parse(prior);const status=await request('/api/v1/orders/'+saved.id,undefined,saved.access);if(status.payment_status==='paid'){sessionStorage.removeItem('myb-maria-pending');return status;}throw new Error('Payment is pending verification. Keep your cart and contact support with order '+saved.id+'. Do not pay again.');}
  await request('/api/v1/checkout/session');
  const products=await apiResolve(items.map(i=>i.product.id));
  const lines=items.map(i=>{const p=products.find(p=>p.id===i.product.id);const v=p?.variantOptions?.find(v=>v.label===i.variant);if(!p?.imageProductId||!v)throw new Error('Your cart changed. Refresh the product and select its current variant.');return {product_id:p.imageProductId,variant_id:v.id,quantity:i.quantity};});
  const fingerprint=JSON.stringify(lines);let key=sessionStorage.getItem('myb-maria-checkout-key'),priorCart=sessionStorage.getItem('myb-maria-cart-key');
  if(!key||fingerprint!==priorCart){key=crypto.randomUUID();sessionStorage.setItem('myb-maria-checkout-key',key);sessionStorage.setItem('myb-maria-cart-key',fingerprint);}
  const order=await request('/api/v1/checkout',{items:lines,idempotency_key:key,customer:{customer_name:customer.customer_name,phone:customer.phone,email:customer.email,city:customer.pincode?customer.city+' '+customer.pincode:customer.city,address:customer.address,country:customer.country,notes:customer.notes}});
  sessionStorage.setItem('myb-maria-pending',JSON.stringify({id:order.order_id,access:order.access_token}));
  if(!order.provider_order_id)throw new Error('Payment creation is pending. Do not pay again. Order '+order.order_id);
  await loadRazorpayScript();const payment=await openRazorpayCheckout({key_id:order.key_id,order_id:order.provider_order_id,amount:order.total_paise,currency:'INR',name:'My B Shoppy',description:'Order '+order.order_id,prefill:{name:customer.customer_name,email:customer.email,contact:customer.phone},notes:{internal_order_id:order.order_id}});
  const status=await request('/api/v1/orders/'+order.order_id+'/confirm',payment,order.access_token);
  if(status.payment_status!=='paid')throw new Error('Your payment is being verified. Do not pay again. Order '+order.order_id);
  sessionStorage.removeItem('myb-maria-pending');sessionStorage.removeItem('myb-maria-checkout-key');sessionStorage.removeItem('myb-maria-cart-key');return status;
}
