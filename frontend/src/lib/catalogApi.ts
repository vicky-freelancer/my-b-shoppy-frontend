import { apiUrl,mediaUrl } from './api';
import type { ProductItem,SubcategoryItem,ProductCategory } from '../types';
export const mariaCatalogEnabled=()=>import.meta.env?.VITE_CATALOG_SOURCE==='mariadb'||(!import.meta.env?.VITE_CATALOG_SOURCE&&typeof window!=='undefined'&&window.location?.hostname==='mybshoppy.com');
export async function catalogRequest(path:string,signal?:AbortSignal){
  const response=await fetch(apiUrl('/api/v1/'+path),{signal,cache:'no-store'});
  const data=await response.json();if(!response.ok)throw new Error(data.code||'Catalog service unavailable');return data;
}
export function apiProduct(row:any):ProductItem {
  return {id:row.slug||String(row.id),imageProductId:String(row.id),name:row.title,subtitle:row.subtitle,price:Number(row.sale_price),originalPrice:Number(row.mrp),imageUrl:mediaUrl(row.image_url),imageUrls:(row.images||[]).map((image:any)=>mediaUrl(image.url || (image.storage_key ? '/media/' + image.storage_key : ''))),
    category:row.category,categoryId:row.category_id,subcategory:row.subcategory,subcategoryId:row.subcategory_id?String(row.subcategory_id):undefined,
    badge:row.badge,rating:Number(row.rating??0),reviewsCount:Number(row.reviews_count??0),material:row.material,stone:row.stone,variants:row.variants||[],description:row.description||'',
    inStock:row.in_stock===true,created_at:row.created_at,variantOptions:(row.variant_options||[]).map((v:any)=>({id:String(v.id),label:v.label}))};
}
export async function apiListing(options:Record<string,unknown>={},signal?:AbortSignal){
  const params=new URLSearchParams();for(const [k,v]of Object.entries(options))if(v!==undefined&&v!==null&&v!=='')params.set(k,String(v));
  const data=await catalogRequest('products?'+params,signal);return {products:(data.products||[]).map(apiProduct),count:Number(data.count)};
}
export async function apiResolve(ids:string[],signal?:AbortSignal){
  if(!ids.length)return [];const products:ProductItem[]=[];
  for(let i=0;i<ids.length;i+=100){const data=await catalogRequest('products/resolve?'+new URLSearchParams({ids:ids.slice(i,i+100).join(',')}),signal);products.push(...data.products.map(apiProduct));}
  return products;
}
export async function apiSubcategories():Promise<SubcategoryItem[]>{
  const data=await catalogRequest('subcategories');return data.subcategories.map((s:any)=>({id:String(s.id),categoryId:s.category_id,name:s.name,slug:s.slug,featuredImage:mediaUrl(s.featured_image),isActive:!!s.is_active,sortOrder:s.sort_order}));
}

export async function apiCategories():Promise<ProductCategory[]>{
  const data=await catalogRequest('categories');return data.categories.map((c:any)=>({id:c.id,name:c.name,tagline:'',description:'',startingPrice:Number(c.startingPrice||0),count:Number(c.count||0),imageUrl:mediaUrl(c.image_url),items:[]}));
}
