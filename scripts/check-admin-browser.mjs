import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const results=[];const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const names=['AD Jewellery','Hair Accessories','Anti Tarnish Jewellery','Ear Rings','Bows & Scrunchies','Bags','Mobile Charms','Key Chains','Mens Accessories','Stationery & Gifts'];
const ids=['ad-jewellery','hair-accessories','anti-tarnish-jewellery','ear-rings','bows-and-scrunchies','bags','mobile-charms','key-chains','men-accessories','stationery-and-gifts'];
const product={id:1,title:'QA Gold Hoops',sku:'QA-HOOPS',category:'Ear Rings',category_id:'ear-rings',cover_image:'',mrp:250,sale_price:200,quantity:10,badges:['Bestseller'],created_at:new Date().toISOString()};
const order={id:1,customer_name:'QA Customer',phone:'0000000000',city:'Trichy',address:'QA Address',product_variant:'QA Gold Hoops',quantity:2,amount:400,price_per_unit:200,status:'pending',created_at:new Date().toISOString()};
const data={categories:ids.map((id,i)=>({id,name:names[i],slug:id,is_active:true})).reverse(),products:[product],orders:[order],subcategories:[{id:1,category_id:'ear-rings',name:'QA Hoops',slug:'qa-hoops',is_active:true,sort_order:0}]};
await page.route('**/*supabase.co/**',async route=>{const req=route.request();const url=new URL(req.url());const table=url.pathname.split('/').pop();if(req.method()==='GET'){await route.fulfill({json:data[table]??[]});return}await route.fulfill({json:{message:'QA browser test blocks all writes'},status:403})});
async function check(name,fn){try{await fn();results.push({name,status:'PASS'});console.log('PASS '+name)}catch(e){results.push({name,status:'FAIL',error:e.message});console.log('FAIL '+name+': '+e.message.slice(0,250))}}
await page.addInitScript(() => localStorage.setItem('mybshoppy_admin_user_v2', JSON.stringify({id:'fake',name:'Forged admin',role:'Super Admin'})));
await page.goto(process.env.ADMIN_QA_URL || 'http://localhost:3200/');
await check('Fresh and forged local-storage sessions require login',async()=>{await page.getByLabel('User ID',{exact:true}).waitFor();assert.equal(await page.locator('#add-new-product-btn').count(),0)});
await check('Incorrect credentials are rejected',async()=>{await page.getByLabel('User ID',{exact:true}).fill('myBadmin');await page.getByLabel('Password',{exact:true}).fill('incorrect-password');await page.locator('#submit-auth-btn').click();await page.getByRole('alert').waitFor();assert.equal(await page.locator('#add-new-product-btn').count(),0)});
await check('Requested credentials sign in using the real server',async()=>{if(!process.env.ADMIN_QA_PASSWORD)throw new Error('ADMIN_QA_PASSWORD is required');await page.getByLabel('Password',{exact:true}).fill(process.env.ADMIN_QA_PASSWORD);await page.locator('#submit-auth-btn').click();await page.getByPlaceholder('Search by title, SKU...').waitFor()});
await check('Session survives reload',async()=>{await page.reload();await page.getByPlaceholder('Search by title, SKU...').waitFor()});
await check('Product search matching and empty results',async()=>{const search=page.getByPlaceholder('Search by title, SKU...');await search.fill('QA-HOOPS');await page.getByText('QA Gold Hoops',{exact:true}).first().waitFor();await search.fill('does-not-exist-qa');await page.waitForTimeout(300);assert.equal(await page.getByText('QA Gold Hoops',{exact:true}).count(),0);await search.fill('')});
await check('Product modal displays exact category order',async()=>{await page.locator('#add-new-product-btn').click();await page.getByRole('heading',{name:'Add New Product'}).waitFor();const options=await page.locator('select').evaluateAll(selects=>selects.map(s=>Array.from(s.options).map(o=>o.textContent)));assert.ok(options.some(list=>JSON.stringify(list.filter(x=>names.includes(x)))===JSON.stringify(names)));await page.keyboard.press('Escape')});
// Close any modal with its visible close button, if Escape is not implemented.
async function closeModal(){await page.evaluate(()=>{const headings=[...document.querySelectorAll('h2')];const h=headings.find(x=>/Add New Product|Add Subcategory|Dashboard Settings/.test(x.textContent));if(h){const overlay=h.closest('.fixed');const button=overlay?.querySelector('button');button?.click()}});await page.waitForTimeout(200)}
await closeModal();
for(const label of ['Dashboard','Subcategories','Products','Orders','Customers','Analytics']){
 await check(label+' navigation renders',async()=>{await page.locator('aside').getByRole('button',{name:new RegExp(label)}).first().click();await page.waitForTimeout(250);assert.ok((await page.locator('main').innerText()).length>30)})
}
await check('Subcategory form exact parent order',async()=>{await page.locator('aside').getByRole('button',{name:/Subcategories/}).click();await page.getByRole('button',{name:/Add Subcategory/}).first().click();await page.getByRole('heading',{name:'Add Subcategory'}).waitFor();const options=await page.locator('select').evaluateAll(selects=>selects.map(s=>Array.from(s.options).map(o=>o.textContent)));assert.ok(options.some(list=>JSON.stringify(list.filter(x=>names.includes(x)))===JSON.stringify(names)))});
await closeModal();
await check('Settings modal opens',async()=>{await page.locator('#topheader-settings-btn').click();await page.getByRole('heading',{name:'Dashboard Settings'}).waitFor()});
await check('Settings save persists after reload',async()=>{await page.getByPlaceholder('e.g. COD Admin Dashboard').fill('QA Dashboard');await page.getByRole('button',{name:'Save Changes'}).click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mybshoppy_admin_settings_v2')).appName),'QA Dashboard');await page.reload();await page.getByPlaceholder('Search by title, SKU...').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mybshoppy_admin_settings_v2')).appName),'QA Dashboard')});
await closeModal();
await check('Order CSV export downloads',async()=>{await page.locator('aside').getByRole('button',{name:/Orders/}).click();const download=page.waitForEvent('download',{timeout:5000});await page.getByTitle('Export filtered orders to CSV spreadsheet').click();assert.ok((await download).suggestedFilename().endsWith('.csv'))});
mkdirSync('reports',{recursive:true});
await page.screenshot({path:'reports/admin-desktop.png',fullPage:true});
for (const width of [320,375,390,768,1024,1440]) {
 await check(`All admin tabs fit at ${width}px`,async()=>{
  await page.setViewportSize({width,height:844});
  for(const tab of ['dashboard','products','subcategories','orders','customers','analytics']) {
   if(width<1024)await page.locator('#admin-menu-button').click();
   await page.locator('#sidebar-nav-'+tab).click();
   await page.waitForTimeout(100);
   const dimensions=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,main:document.querySelector('main').getBoundingClientRect().width,visibleNavigation:!!document.querySelector('#admin-sidebar')?.getClientRects().length}));
   assert.ok(dimensions.document<=width+1,tab+': '+JSON.stringify(dimensions));
   assert.ok(dimensions.main>=width-(width<1024?2:340),tab+': content squeezed '+JSON.stringify(dimensions));
   if(width<1024)assert.equal(dimensions.visibleNavigation,false);
  }
  await page.screenshot({path:`reports/admin-responsive-${width}.png`,fullPage:true});
 });
}
await page.setViewportSize({width:320,height:640});
await check('Mobile navigation Escape and backdrop close',async()=>{await page.locator('#admin-menu-button').click();await page.keyboard.press('Escape');await page.waitForTimeout(100);assert.equal(await page.locator('#admin-sidebar').isVisible(),false);await page.locator('#admin-menu-button').click();await page.getByRole('button',{name:'Close navigation backdrop'}).click({position:{x:310,y:600}});assert.equal(await page.locator('#admin-sidebar').isVisible(),false)});
await check('Mobile notification panel remains inside viewport',async()=>{await page.locator('#topheader-notifications-btn').click();const rect=await page.getByText('2 New Alerts').evaluate(el=>{const r=el.parentElement.parentElement.getBoundingClientRect();return {left:r.left,right:r.right}});assert.ok(rect.left>=0&&rect.right<=320);await page.locator('#topheader-notifications-btn').click()});
await check('Mobile product and settings forms fit and scroll',async()=>{
 await page.locator('#admin-menu-button').click();await page.locator('#sidebar-nav-products').click();await page.locator('#add-new-product-btn').click();
 const input=page.getByPlaceholder('e.g. Pearl Petal Bloom Earrings');await input.scrollIntoViewIfNeeded();const rect=await input.boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=320);await page.getByRole('button',{name:'Add Product',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:'reports/admin-mobile-product-form.png',fullPage:true});await closeModal();
 await page.locator('#topheader-settings-btn').click();await page.getByRole('button',{name:'Save Changes'}).scrollIntoViewIfNeeded();assert.ok(await page.getByRole('button',{name:'Save Changes'}).isVisible());await closeModal();
});
await check('Logout revokes session and reload remains signed out',async()=>{await page.locator('#admin-menu-button').click();await page.getByTitle('Logout',{exact:true}).click();await page.getByLabel('User ID',{exact:true}).waitFor();await page.reload();await page.getByLabel('User ID',{exact:true}).waitFor();assert.equal(await page.locator('#add-new-product-btn').count(),0)});
await check('No uncaught browser errors',()=>assert.deepEqual(errors,[]));
writeFileSync('reports/admin-browser-results.json',JSON.stringify({results,errors},null,2));
console.log(`${results.filter(r=>r.status==='PASS').length}/${results.length} checks passed`);
await browser.close();
