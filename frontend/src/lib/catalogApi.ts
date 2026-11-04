import { apiUrl,mediaUrl } from './api';
import type { ProductItem,SubcategoryItem,ProductCategory } from '../types';
const CATALOG_TIMEOUT_MS=15000;
type CatalogErrorBody={code?:unknown;error?:unknown};
function errorCode(body:unknown){
  if(!body||typeof body!=='object')return '';
  const {code,error}=body as CatalogErrorBody;
  if(typeof code==='string'&&code)return code;
  return typeof error==='string'?error:'';
}
export async function catalogRequest<T=any>(path:string,signal?:AbortSignal):Promise<T>{
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),CATALOG_TIMEOUT_MS);
  const abort=()=>controller.abort();
  signal?.addEventListener('abort',abort,{once:true});
  let response:Response;
  try{
    response=await fetch(apiUrl('/api/v1/'+path),{signal:controller.signal,cache:'no-store'});
  }catch(error){
    if(signal?.aborted)throw error;
    if(controller.signal.aborted)throw new Error('The catalogue service timed out. Please try again.');
    throw new Error('The catalogue service is unreachable. Please check your connection and try again.');
  }finally{
    clearTimeout(timer);
    signal?.removeEventListener('abort',abort);
  }
  const text=await response.text();
  let data:unknown=null;
  if(text){try{data=JSON.parse(text);}catch{data=null;}}
  if(!response.ok){
    throw new Error(errorCode(data)||`The catalogue service is unavailable (HTTP ${response.status}).`);
  }
  if(!data||typeof data!=='object')throw new Error('Invalid catalog response');
  return data as T;
}
export function catalogErrorMessage(error:unknown,fallback:string){
  const message=error instanceof Error?error.message:'';
  if(/CATALOG_UNAVAILABLE|MARIADB_NOT_CONFIGURED|DATABASE_|AUTH_UNAVAILABLE|unreachable|timed out|HTTP 5\d\d|catalogue service|Catalog service/i.test(message))
    return 'The live catalogue is temporarily unavailable. Please try again in a moment.';
  return fallback;
}
export function apiProduct(row:any):ProductItem {
  return {id:row.slug||String(row.id),imageProductId:String(row.id),name:row.title,subtitle:row.subtitle,price:Number(row.sale_price),originalPrice:Number(row.mrp),imageUrl:mediaUrl(row.image_url),imageUrls:(row.images||[]).map((image:any)=>mediaUrl(image.url || (image.storage_key ? '/media/' + image.storage_key : ''))),
    category:row.category,categoryId:row.category_id,subcategory:row.subcategory,subcategoryId:row.subcategory_id?String(row.subcategory_id):undefined,
    badge:row.badge,rating:Number(row.rating??0),reviewsCount:Number(row.reviews_count??0),material:row.material,stone:row.stone,variants:row.variants||[],description:row.description||'',
    inStock:row.in_stock===true,created_at:row.created_at,variantOptions:(row.variant_options||[]).map((v:any)=>({id:String(v.id),label:v.label}))};
}
export async function apiListing(options:Record<string,unknown>={},signal?:AbortSignal){
  const params=new URLSearchParams();for(const [k,v]of Object.entries(options))if(v!==undefined&&v!==null&&v!=='')params.set(k,String(v));
  const data=await catalogRequest('products?'+params,signal);if (!Array.isArray(data.products) || !Number.isFinite(Number(data.count))) throw new Error('Invalid catalog response');return {products:data.products.map(apiProduct),count:Number(data.count)};
}
export async function apiResolve(ids:string[],signal?:AbortSignal){
  if(!ids.length)return [];const products:ProductItem[]=[];
  for(let i=0;i<ids.length;i+=100){const data=await catalogRequest('products/resolve?'+new URLSearchParams({ids:ids.slice(i,i+100).join(',')}),signal);products.push(...data.products.map(apiProduct));}
  return products;
}
export async function apiSubcategories():Promise<SubcategoryItem[]>{
  const data=await catalogRequest<{subcategories?:unknown}>('subcategories');
  if(!Array.isArray(data.subcategories))throw new Error('Invalid catalog response');
  return data.subcategories.map((s:any)=>({id:String(s.id),categoryId:s.category_id,name:s.name,slug:s.slug,featuredImage:mediaUrl(s.featured_image),isActive:!!s.is_active,sortOrder:s.sort_order}));
}

export async function apiCategories():Promise<ProductCategory[]>{
  const data=await catalogRequest<{categories?:unknown}>('categories');
  if(!Array.isArray(data.categories))throw new Error('Invalid catalog response');
  return data.categories.map((c:any)=>({id:c.id,name:c.name,tagline:'',description:'',startingPrice:Number(c.startingPrice||0),count:Number(c.count||0),imageUrl:mediaUrl(c.image_url),items:[]}));
}
