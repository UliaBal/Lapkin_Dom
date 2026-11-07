document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="mobile-fixes.css"><link rel="stylesheet" href="premium.css">');
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const getCart=()=>JSON.parse(localStorage.getItem('lapkinCart')||'[]');
const setCart=c=>{localStorage.setItem('lapkinCart',JSON.stringify(c));updateCartCount();updateProductControls()};
function updateCartCount(){const n=getCart().reduce((s,x)=>s+x.qty,0);$$('.cart-count').forEach(el=>el.textContent=n)}
function updateProductControls(){
  const cart=getCart();
  $$('.add-cart').forEach(button=>{
    if(!button.dataset.defaultLabel)button.dataset.defaultLabel=button.textContent.trim();
    const item=cart.find(x=>x.name===button.dataset.name);
    let controls=button.nextElementSibling?.classList.contains('inline-qty')?button.nextElementSibling:null;
    const row=button.closest('.product-buy,.buy-row');
    if(item){
      button.textContent='В корзине';
      button.classList.add('in-cart');
      row?.classList.add('cart-active');
      if(!controls){controls=document.createElement('div');controls.className='inline-qty';button.insertAdjacentElement('afterend',controls)}
      controls.dataset.name=item.name;
      controls.innerHTML=`<button type="button" data-inline-action="minus" aria-label="Уменьшить количество">−</button><b>${item.qty}</b><button type="button" data-inline-action="plus" aria-label="Увеличить количество">+</button>`;
    }else{
      button.textContent=button.dataset.defaultLabel;
      button.classList.remove('in-cart');
      row?.classList.remove('cart-active');
      controls?.remove();
    }
  })
}
function toast(t){const el=$('#toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
const active=document.body.dataset.page;
$('#site-header').innerHTML=`<div class="topbar"><span>🚚 <b>Бесплатная доставка</b> по Владимиру в день заказа</span><span>🎁 <b>−10%</b> на первый заказ по промокоду ЛАПКА</span><span>🩺 Бесплатная консультация ветеринара</span><span>📦 Корм по подписке <b>−7%</b></span></div><header class="main-header"><div class="container nav-shell"><a class="logo" href="index.html"><span class="logo-mark">🐾</span><span>Лапкин<br><em>дом</em></span></a><button class="mobile-toggle" aria-label="Открыть меню">☰</button><nav class="nav"><a class="${active==='home'?'active':''}" href="index.html">Главная</a><a class="${active==='catalog'?'active':''}" href="catalog.html">Каталог</a><a class="${active==='delivery'?'active':''}" href="delivery.html">Доставка и оплата</a><a class="${active==='contacts'?'active':''}" href="contacts.html">Контакты</a></nav><div class="nav-actions"><label class="search">🔍<input placeholder="Найти корм, игрушку..."></label><a class="phone" href="tel:+74922000000">+7 (4922) 00-00-00</a><button class="icon-link" aria-label="Избранное">♡</button><button class="icon-link" aria-label="Личный кабинет">👤</button><a class="icon-link cart" href="cart.html" aria-label="Корзина">🛒<span class="cart-count">0</span></a></div></div></header>`;
$('#site-footer').innerHTML=`<footer class="site-footer"><div class="footer-grid"><div><div class="footer-brand">Лапкин<br><em>дом</em></div><p>Зоомагазин во Владимире. Привезём всё нужное для питомца в день заказа.</p></div><nav><h3>Меню</h3><a href="index.html">Главная</a><a href="catalog.html">Каталог</a><a href="delivery.html">Доставка и оплата</a><a href="contacts.html">Контакты</a></nav><nav><h3>Покупателям</h3><a href="cart.html">Корзина</a><a href="#">Личный кабинет</a><a href="product.html">Корм по подписке</a><a href="#">Политика конфиденциальности</a></nav><div><h3>Контакты</h3><p>+7 (4922) 00-00-00</p><p>info@lapkin-dom.ru</p><p>г. Владимир</p><div class="social"><a href="#">VK</a><a href="#">TG</a></div></div></div><div class="footer-bottom"><span>© 2026 «Лапкин дом». Все права защищены</span><span>Разработчик сайта: Агамирзоев Х.Ф.</span></div></footer>`;
const logoMark=$('.logo-mark');
if(logoMark)logoMark.innerHTML='<img src="assets/logo-lapkin-dom.png" alt="Логотип Лапкин дом">';
$('.mobile-toggle')?.addEventListener('click',()=>$('.nav').classList.toggle('open'));
$('.search input')?.addEventListener('keydown',e=>{if(e.key==='Enter'){location.href='category.html?search='+encodeURIComponent(e.target.value)}});
$$('.heart').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();b.classList.toggle('liked');b.textContent=b.classList.contains('liked')?'♥':'♡';toast(b.classList.contains('liked')?'Добавлено в избранное':'Удалено из избранного')}));
$$('.add-cart').forEach(b=>b.addEventListener('click',()=>{const cart=getCart(),name=b.dataset.name,found=cart.find(x=>x.name===name);if(found){location.href='cart.html';return}let qty=1;if(b.classList.contains('product-add'))qty=Number($('#product-qty')?.textContent||1);cart.push({name,price:Number(b.dataset.price),icon:b.dataset.icon||'🐾',qty});setCart(cart);toast('Товар добавлен в корзину')}));
document.addEventListener('click',event=>{const control=event.target.closest('[data-inline-action]');if(!control)return;event.preventDefault();event.stopPropagation();const holder=control.closest('.inline-qty'),cart=getCart(),item=cart.find(x=>x.name===holder.dataset.name);if(!item)return;item.qty+=control.dataset.inlineAction==='plus'?1:-1;if(item.qty<=0)cart.splice(cart.indexOf(item),1);setCart(cart);toast(item.qty>0?`Количество товара: ${item.qty}`:'Товар удалён из корзины')});
updateCartCount();
updateProductControls();
$$('.chip').forEach(ch=>ch.addEventListener('click',()=>{$$('.chip').forEach(x=>x.classList.remove('active'));ch.classList.add('active');const f=ch.dataset.filter;$$('.catalog-tile').forEach(t=>t.style.display=f==='all'||(t.dataset.animal||'').includes(f)?'block':'none')}));
const range=$('#price-range');range?.addEventListener('input',()=>$('#price-value').textContent='до '+new Intl.NumberFormat('ru-RU').format(range.value));
function filterProducts(){const max=Number(range?.value||999999),checked=$$('.filters input[type=checkbox]:checked').map(x=>x.value);$$('#category-products .product-card').forEach(p=>{const typeOk=!checked.some(x=>['dry','wet','treat'].includes(x))||checked.includes(p.dataset.type),ageOk=!checked.some(x=>['kitten','adult','senior'].includes(x))||checked.includes(p.dataset.age);p.style.display=typeOk&&ageOk&&Number(p.dataset.price)<=max?'flex':'none'})}
$('#show-products')?.addEventListener('click',filterProducts);
$('#sort-products')?.addEventListener('change',e=>{const grid=$('#category-products'),cards=$$('#category-products .product-card');if(e.target.value!=='popular')cards.sort((a,b)=>(Number(a.dataset.price)-Number(b.dataset.price))*(e.target.value==='asc'?1:-1));cards.forEach(c=>grid.append(c))});
$('#product-minus')?.addEventListener('click',()=>$('#product-qty').textContent=Math.max(1,Number($('#product-qty').textContent)-1));
$('#product-plus')?.addEventListener('click',()=>$('#product-qty').textContent=Number($('#product-qty').textContent)+1);
$$('.packs button').forEach(b=>b.addEventListener('click',()=>{$$('.packs button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.tabs button,.tab-content').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active')}));
$$('.faq button').forEach(b=>b.addEventListener('click',()=>{const a=b.parentElement;a.classList.toggle('open');b.querySelector('span').textContent=a.classList.contains('open')?'−':'+'}));
$('#contact-form')?.addEventListener('submit',e=>{e.preventDefault();toast('Спасибо! Сообщение сохранено локально.');e.target.reset()});
function renderCart(){const host=$('#cart-items');if(!host)return;const cart=getCart();if(!cart.length)host.innerHTML='<div class="empty-cart"><h2>Корзина пока пуста</h2><p>Добавьте товары из каталога — они появятся здесь.</p><a class="btn" href="catalog.html">Перейти в каталог</a></div>';else host.innerHTML=cart.map((x,i)=>`<article class="cart-row"><div class="cart-row-icon">${x.icon}</div><div><h3>${x.name}</h3><div class="stock">● В наличии</div><small>${money(x.price)} / шт.</small></div><div class="stepper"><button data-cart="minus" data-i="${i}">−</button><b>${x.qty}</b><button data-cart="plus" data-i="${i}">+</button></div><b class="row-price">${money(x.price*x.qty)}</b><button class="remove" data-cart="remove" data-i="${i}">×</button></article>`);const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0),discount=Number(sessionStorage.getItem('lapkinDiscount')||0),total=Math.max(0,subtotal-discount);$('#summary-items').textContent=money(subtotal);$('#summary-discount').textContent=discount?'−'+money(discount):'0 ₽';$('#summary-bonus').textContent='+'+money(Math.round(total*.05));$('#summary-total').textContent=money(total);$('#cart-summary-pill').textContent=`${cart.length} товара · ${cart.reduce((s,x)=>s+x.qty,0)} шт.`;host.onclick=e=>{const b=e.target.closest('[data-cart]');if(!b)return;const c=getCart(),i=Number(b.dataset.i);if(b.dataset.cart==='plus')c[i].qty++;if(b.dataset.cart==='minus')c[i].qty=Math.max(1,c[i].qty-1);if(b.dataset.cart==='remove')c.splice(i,1);setCart(c);renderCart()}}
renderCart();
$('#apply-promo')?.addEventListener('click',()=>{const code=$('#promo-code').value.trim().toUpperCase();if(code==='ЛАПКА'){const subtotal=getCart().reduce((s,x)=>s+x.price*x.qty,0);sessionStorage.setItem('lapkinDiscount',Math.round(subtotal*.1));toast('Промокод применён: скидка 10%');renderCart()}else toast('Промокод не найден')});
$('#checkout')?.addEventListener('click',()=>toast(getCart().length?'Демо: заказ готов к оформлению':'Сначала добавьте товары'));
if(active==='home'){
  const picker=document.createElement('section');
  picker.className='container pet-picker reveal';
  picker.innerHTML=`<div class="picker-copy"><span class="picker-kicker">✦ Умный подбор</span><h2>Рацион без догадок</h2><p>Выберите питомца — покажем, с чего начать поиск подходящего корма и на что обратить внимание.</p><div class="picker-buttons"><button class="active" data-pet="cat">🐱 Кошка</button><button data-pet="dog">🐶 Собака</button><button data-pet="small">🐹 Маленький питомец</button></div><div class="picker-result"><span>✓</span><b id="picker-text">Начнём с возраста, активности и особенностей здоровья кошки</b></div><a class="btn" href="category.html">Подобрать рацион →</a></div><div class="picker-scene"><div class="picker-pet" id="picker-pet">🐱</div><div class="picker-label" id="picker-label">Для домашних кошек: контроль веса и поддержка мочевыделительной системы</div></div>`;
  $('.benefits')?.after(picker);
  const petData={cat:['🐱','Начнём с возраста, активности и особенностей здоровья кошки','Для домашних кошек: контроль веса и поддержка мочевыделительной системы'],dog:['🐶','Учтём размер, активность и чувствительность пищеварения собаки','Для активных собак: полноценный белок и поддержка суставов'],small:['🐹','Подберём рацион по виду питомца, возрасту и формату корма','Для маленьких питомцев: понятный состав и удобная фасовка']};
  $$('.picker-buttons button').forEach(button=>button.addEventListener('click',()=>{const data=petData[button.dataset.pet];$$('.picker-buttons button').forEach(x=>x.classList.remove('active'));button.classList.add('active');$('#picker-pet').textContent=data[0];$('#picker-text').textContent=data[1];$('#picker-label').textContent=data[2]}));
}
const vetButton=document.createElement('button');
vetButton.className='vet-fab';vetButton.textContent='Ветеринар онлайн';vetButton.setAttribute('aria-label','Открыть консультацию ветеринара');
vetButton.addEventListener('click',()=>toast('Консультант ответит в демо-чате в течение нескольких минут'));
document.body.append(vetButton);
const revealItems=$$('main section,.product-card,.catalog-tile,.trust article');
revealItems.forEach(x=>x.classList.add('reveal'));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -30px'});revealItems.forEach(x=>observer.observe(x))}else revealItems.forEach(x=>x.classList.add('is-visible'));
