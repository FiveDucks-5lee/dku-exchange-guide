(()=>{
 'use strict';
 function enhanceTables(root=document){
  root.querySelectorAll('table.wt:not([data-mobile-ready])').forEach(table=>{
   const head=table.tHead?.rows[0]||table.rows[0];
   if(!head||head.cells.length<3||table.querySelector('[rowspan]'))return;
   const labels=[...head.cells].map(cell=>cell.textContent.replace(/\s+/g,' ').trim());
   if(![...head.cells].every(cell=>cell.tagName==='TH')||[...head.cells].some(cell=>cell.colSpan!==1))return;
   table.dataset.mobileReady='true';table.classList.add('mobile-cards');table.setAttribute('role','table');
   if(table.parentElement.classList.contains('tw'))table.parentElement.classList.add('mobile-cards-wrap');
   head.classList.add('mobile-table-head');
   [...head.cells].forEach(cell=>{cell.scope='col';cell.setAttribute('role','columnheader')});
   [...table.rows].forEach(row=>{
    row.setAttribute('role','row');if(row===head)return;
    [...row.cells].forEach((cell,i)=>{
     if(cell.colSpan===1)cell.dataset.label=labels[i]||'';
     cell.setAttribute('role',cell.tagName==='TH'?'rowheader':'cell');
    });
   });
   [...table.tBodies].forEach(body=>body.setAttribute('role','rowgroup'));
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>enhanceTables());else enhanceTables();
})();
