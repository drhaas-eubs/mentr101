
function fwCard(fw,i){
  return '<button class="card" data-i="'+i+'" data-unit="'+fw.unit+'" data-kind="'+fw.kind+'" '+
   'data-search="'+(fw.name+' '+fw.desc+' '+fw.slibTitle+' '+fw.def).toLowerCase().replace(/"/g,'')+'">'+
   '<span class="card-accent" style="background:'+fw.color+'"></span>'+
   '<span class="card-thumb">'+FIG(fw.shape,fw.labels,fw.color,'thumb')+'</span>'+
   '<span class="card-body"><span class="card-title">'+fw.name+'</span>'+
   '<span class="card-desc">'+fw.desc+'</span>'+
   '<span class="card-tag" style="background:'+fw.color+'">Slibrary '+fw.slibNum+' &middot; Sheet '+fw.sheet+'/5</span></span></button>';
}
function openModal(fw){
  var m=document.getElementById('modal');
  m.innerHTML='<div class="modal-accent" style="background:'+fw.color+'"></div><div class="modal-inner">'+
   '<button class="modal-close" onclick="closeModal()" aria-label="Close">&times;</button>'+
   '<div class="modal-slib">Unit '+fw.unit+' &middot; Slibrary '+fw.slibNum+' &mdash; '+fw.slibTitle+'</div>'+
   '<div class="modal-title">'+fw.name+'</div>'+
   '<div class="modal-def">'+fw.def+'</div>'+
   '<div class="modal-desc">'+fw.desc+'</div>'+
   '<div class="modal-thumb">'+FIG(fw.shape,fw.labels,fw.color,'full')+'</div>'+
   '<div class="modal-cap">'+fw.caption+'</div>'+
   '<ul class="modal-details">'+fw.details.map(function(d){return '<li>'+d+'</li>'}).join('')+'</ul>'+
   '<div class="modal-ref"><div class="modal-ref-label">Reference</div>'+fw.ref+'</div>'+
   '<div class="sheet-cta"><a class="sheet-btn" href="sheets.html#s'+fw.page+'">'+
   '&#128196; View Full A4 Reference Sheet &middot; '+fw.page+' / 80</a></div>'+
   '</div>';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(ev){if(ev.key==='Escape')closeModal()});
function wireCards(list){
  document.querySelectorAll('.card').forEach(function(c){
    c.addEventListener('click',function(){openModal(list[parseInt(c.dataset.i,10)])});
  });
}
function wireSearch(inputId,selector,emptyId){
  var inp=document.getElementById(inputId);
  if(!inp)return;
  inp.addEventListener('input',function(){
    var q=inp.value.toLowerCase().trim();
    var shown=0;
    document.querySelectorAll(selector).forEach(function(el){
      var hit=!q||(el.dataset.search||'').indexOf(q)>-1;
      el.classList.toggle('hidden',!hit);
      if(hit)shown++;
    });
    document.querySelectorAll('.slib-set').forEach(function(s){
      var any=s.querySelectorAll(selector+':not(.hidden)').length;
      s.classList.toggle('hidden',any===0);
    });
    var em=document.getElementById(emptyId);
    if(em)em.classList.toggle('hidden',shown>0);
  });
}
