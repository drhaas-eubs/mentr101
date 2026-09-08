/* ============================================================
   MENTR101 · Figure engine
   Parametric SVG diagrams: numbered nodes + precise labels.
   FIG(type, labels, color, mode)  mode = 'thumb' | 'full'
   © Dr. Hildegard Haas · Genedia AG Education
   ============================================================ */
(function (root) {
'use strict';

var INK = '#1B2A4A', MUTED = '#475569';

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* wrap a label into lines of at most n characters */
function wrap(s, n){
  var words = String(s).split(' '), lines = [], cur = '';
  for (var i=0;i<words.length;i++){
    var t = cur ? cur + ' ' + words[i] : words[i];
    if (t.length > n && cur){ lines.push(cur); cur = words[i]; } else { cur = t; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function text(x, y, s, o){
  o = o || {};
  var size = o.size || 10, anchor = o.anchor || 'middle', weight = o.weight || 400,
      fill = o.fill || INK, lh = size * 1.15, lines = wrap(s, o.wrap || 18);
  var start = y - ((lines.length - 1) * lh) / 2;
  var out = '';
  for (var i=0;i<lines.length;i++){
    out += '<text x="'+x+'" y="'+(start + i*lh + size*0.35).toFixed(1)+'" text-anchor="'+anchor+
           '" font-family="Arial,Helvetica,sans-serif" font-size="'+size+'" font-weight="'+weight+
           '" fill="'+fill+'">'+esc(lines[i])+'</text>';
  }
  return out;
}

function num(x, y, n, c, r){
  r = r || 13;
  return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff" stroke="'+c+'" stroke-width="2"/>' +
         '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" ' +
         'font-size="'+(r*0.85).toFixed(0)+'" font-weight="700" fill="'+c+'">'+n+'</text>';
}

function svg(w, h, body){
  return '<svg viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" role="img">'+body+'</svg>';
}

function arrowDefs(c, id){
  return '<defs><marker id="'+id+'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" '+
         'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="'+c+'"/></marker></defs>';
}

var uid = 0;
function mk(){ return 'a' + (++uid); }

/* ---------------------------------------------------------- builders */
var B = {};

/* 1. CYCLE — numbered nodes on a circle, labels outside */
B.cycle = function (L, c, full){
  var n = Math.max(3, L.length), id = mk();
  var W = full ? 460 : 200, H = full ? 290 : 130;
  var cx = W/2, cy = H/2 + (full ? 4 : 0), r = full ? 78 : 42, R = full ? 13 : 7;
  var s = arrowDefs(c, id);
  s += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+c+'" stroke-width="'+(full?1.5:2)+'" opacity=".35"/>';
  for (var i=0;i<n;i++){
    var a = -Math.PI/2 + i*2*Math.PI/n;
    var x = cx + r*Math.cos(a), y = cy + r*Math.sin(a);
    /* arc arrow to next node */
    var a2 = -Math.PI/2 + (i+0.55)*2*Math.PI/n;
    var mx = cx + r*Math.cos(a2), my = cy + r*Math.sin(a2);
    s += '<path d="M'+mx.toFixed(1)+','+my.toFixed(1)+' l'+(-Math.sin(a2)*0.1).toFixed(2)+',0" stroke="'+c+
         '" stroke-width="'+(full?7:5)+'" marker-end="url(#'+id+')" opacity=".8" ' +
         'transform="rotate('+((a2*180/Math.PI)+90).toFixed(1)+' '+mx.toFixed(1)+' '+my.toFixed(1)+')"/>';
    s += num(x.toFixed(1), y.toFixed(1), i+1, c, R);
    if (full){
      var lx = cx + (r+52)*Math.cos(a), ly = cy + (r+40)*Math.sin(a);
      s += text(lx.toFixed(1), ly.toFixed(1), L[i], {size:11, weight:700, wrap:14});
    }
  }
  if (full && L.center) s += text(cx, cy, L.center, {size:11, weight:700, fill:c, wrap:12});
  return svg(W, H, s);
};

/* 2. PYRAMID — tiers bottom→top, labels inside (full) */
B.pyramid = function (L, c, full){
  var n = L.length, W = full ? 460 : 200, H = full ? 290 : 130;
  var top = full ? 26 : 12, bot = full ? 250 : 118, cx = W/2, half = full ? 175 : 82;
  var s = '', hgt = (bot - top)/n;
  for (var i=0;i<n;i++){                    /* i=0 is the apex tier */
    var y1 = top + i*hgt, y2 = top + (i+1)*hgt;
    var w1 = half*(i)/n, w2 = half*(i+1)/n;
    s += '<polygon points="'+(cx-w1)+','+y1+' '+(cx+w1)+','+y1+' '+(cx+w2)+','+y2+' '+(cx-w2)+','+y2+
         '" fill="'+c+'" fill-opacity="'+(0.30 - i*0.045).toFixed(2)+'" stroke="'+c+'" stroke-width="1.4"/>';
    if (full) s += text(cx, (y1+y2)/2, L[i], {size:11, weight:700, wrap:30});
  }
  return svg(W, H, s);
};

/* 3. STAIRS / LADDER — ascending steps, labels on treads */
B.stairs = function (L, c, full){
  var n = L.length, W = full ? 460 : 200, H = full ? 290 : 130;
  var x0 = full ? 34 : 18, y0 = full ? 250 : 116, wStep = ((full?420:184) - x0)/n, hStep = (y0 - (full?46:16))/n;
  var s = '';
  for (var i=0;i<n;i++){
    var x = x0 + i*wStep, h = (i+1)*hStep, y = y0 - h;
    s += '<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+(wStep-4).toFixed(1)+'" height="'+h.toFixed(1)+
         '" fill="'+c+'" fill-opacity="'+(0.10 + i*0.06).toFixed(2)+'" stroke="'+c+'" stroke-width="1.3"/>';
    if (full){
      s += num(x + wStep/2 - 2, y + 20, i+1, c, 11);
      s += text(x + wStep/2 - 2, y + 46, L[i], {size:10, weight:700, wrap:13});
    }
  }
  s += '<line x1="'+x0+'" y1="'+y0+'" x2="'+(full?430:192)+'" y2="'+y0+'" stroke="'+c+'" stroke-width="1.2" opacity=".5"/>';
  return svg(W, H, s);
};

/* 4. MATRIX — 2x2 with quadrant labels and axis captions */
B.matrix = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 290 : 130;
  var x0 = full ? 70 : 22, y0 = full ? 30 : 12, w = full ? 350 : 156, h = full ? 210 : 106;
  var s = '', fills = [0.20, 0.30, 0.10, 0.16];
  for (var i=0;i<4;i++){
    var cxq = x0 + (i%2)*(w/2), cyq = y0 + Math.floor(i/2)*(h/2);
    s += '<rect x="'+cxq+'" y="'+cyq+'" width="'+(w/2-3)+'" height="'+(h/2-3)+'" rx="4" fill="'+c+
         '" fill-opacity="'+fills[i]+'" stroke="'+c+'" stroke-width="1.2"/>';
    if (full && L[i]) s += text(cxq + w/4 - 1, cyq + h/4 - 1, L[i], {size:10.5, weight:700, wrap:17});
  }
  if (full){
    if (L[4]) s += '<text x="'+(x0+w/2)+'" y="'+(y0+h+24)+'" text-anchor="middle" font-family="Arial" font-size="10" font-weight="700" fill="'+MUTED+'">'+esc(L[4])+'</text>';
    if (L[5]) s += '<text transform="rotate(-90 '+(x0-26)+' '+(y0+h/2)+')" x="'+(x0-26)+'" y="'+(y0+h/2)+'" text-anchor="middle" font-family="Arial" font-size="10" font-weight="700" fill="'+MUTED+'">'+esc(L[5])+'</text>';
  }
  return svg(W, H, s);
};

/* 5. FUNNEL — narrowing stages */
B.funnel = function (L, c, full){
  var n = L.length, W = full ? 460 : 200, H = full ? 290 : 130;
  var top = full ? 26 : 12, bot = full ? 254 : 118, cx = W/2, wTop = full ? 180 : 82, wBot = full ? 46 : 22;
  var s = '', hgt = (bot-top)/n;
  for (var i=0;i<n;i++){
    var y1 = top+i*hgt, y2 = top+(i+1)*hgt;
    var w1 = wTop - (wTop-wBot)*i/n, w2 = wTop - (wTop-wBot)*(i+1)/n;
    s += '<polygon points="'+(cx-w1)+','+y1+' '+(cx+w1)+','+y1+' '+(cx+w2)+','+y2+' '+(cx-w2)+','+y2+
         '" fill="'+c+'" fill-opacity="'+(0.12 + i*0.06).toFixed(2)+'" stroke="'+c+'" stroke-width="1.3"/>';
    if (full) s += text(cx, (y1+y2)/2, L[i], {size:10.5, weight:700, wrap:34});
  }
  return svg(W, H, s);
};

/* 6. PIPELINE — sequential boxes with arrows */
B.pipeline = function (L, c, full){
  var n = L.length, W = full ? 470 : 200, H = full ? 200 : 130, id = mk();
  var pad = full ? 16 : 8, gap = full ? 22 : 10;
  var bw = (W - 2*pad - (n-1)*gap)/n, bh = full ? 74 : 42, y = H/2 - bh/2;
  var s = arrowDefs(c, id);
  for (var i=0;i<n;i++){
    var x = pad + i*(bw+gap);
    s += '<rect x="'+x.toFixed(1)+'" y="'+y+'" width="'+bw.toFixed(1)+'" height="'+bh+'" rx="7" fill="'+c+
         '" fill-opacity="'+(0.10 + i*0.06).toFixed(2)+'" stroke="'+c+'" stroke-width="1.4"/>';
    if (full) s += text(x + bw/2, y + bh/2, L[i], {size:10.5, weight:700, wrap:13});
    if (i < n-1) s += '<line x1="'+(x+bw+3).toFixed(1)+'" y1="'+(y+bh/2)+'" x2="'+(x+bw+gap-5).toFixed(1)+
                      '" y2="'+(y+bh/2)+'" stroke="'+c+'" stroke-width="2" marker-end="url(#'+id+')"/>';
  }
  return svg(W, H, s);
};

/* 7. LAYERS — stacked bands, top = first label */
B.layers = function (L, c, full){
  var n = L.length, W = full ? 460 : 200, H = full ? 290 : 130;
  var x = full ? 60 : 26, w = full ? 340 : 148, top = full ? 26 : 12, gap = full ? 8 : 4;
  var bh = ((full?254:118) - top - (n-1)*gap)/n, s = '';
  for (var i=0;i<n;i++){
    var y = top + i*(bh+gap);
    s += '<rect x="'+x+'" y="'+y.toFixed(1)+'" width="'+w+'" height="'+bh.toFixed(1)+'" rx="5" fill="'+c+
         '" fill-opacity="'+(0.28 - i*0.045).toFixed(2)+'" stroke="'+c+'" stroke-width="1.3"/>';
    if (full) s += text(x + w/2, y + bh/2, L[i], {size:10.5, weight:700, wrap:40});
  }
  return svg(W, H, s);
};

/* 8. SPLIT — two contrasted columns */
B.split = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 250 : 130;
  var pad = full ? 30 : 14, w = (W - 2*pad - (full?40:16))/2, h = full ? 170 : 96, y = full ? 46 : 18;
  var s = '';
  for (var i=0;i<2;i++){
    var x = pad + i*(w + (full?40:16));
    s += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="'+c+'" fill-opacity="'+(i?0.24:0.10)+
         '" stroke="'+c+'" stroke-width="1.5"/>';
    if (full){
      s += text(x + w/2, y + 26, L[i*2] || '', {size:11.5, weight:700, wrap:18});
      if (L[i*2+1]) s += text(x + w/2, y + h/2 + 22, L[i*2+1], {size:10, wrap:24, fill:MUTED});
    }
  }
  s += '<line x1="'+(W/2)+'" y1="'+(y-6)+'" x2="'+(W/2)+'" y2="'+(y+h+6)+'" stroke="'+c+
       '" stroke-width="1.4" stroke-dasharray="5 4" opacity=".6"/>';
  return svg(W, H, s);
};

/* 9. VENN — two circles, overlap labelled */
B.venn = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 250 : 130;
  var cy = full ? 118 : 65, r = full ? 82 : 42, d = full ? 55 : 26;
  var s = '';
  s += '<circle cx="'+(W/2-d)+'" cy="'+cy+'" r="'+r+'" fill="'+c+'" fill-opacity=".13" stroke="'+c+'" stroke-width="1.5"/>';
  s += '<circle cx="'+(W/2+d)+'" cy="'+cy+'" r="'+r+'" fill="'+c+'" fill-opacity=".13" stroke="'+c+'" stroke-width="1.5"/>';
  if (full){
    s += text(W/2 - d - r*0.42, cy, L[0]||'', {size:10.5, weight:700, wrap:12});
    s += text(W/2 + d + r*0.42, cy, L[1]||'', {size:10.5, weight:700, wrap:12});
    if (L[2]) s += text(W/2, cy, L[2], {size:10, weight:700, fill:c, wrap:10});
    if (L[3]) s += text(W/2, full?232:0, L[3], {size:10, fill:MUTED, wrap:60});
  }
  return svg(W, H, s);
};

/* 10. BARS — labelled comparison bars */
B.bars = function (L, c, full){
  var n = L.length, W = full ? 460 : 200, H = full ? 270 : 130;
  var base = full ? 214 : 112, x0 = full ? 46 : 20, gap = full ? 20 : 8;
  var bw = ((full?420:186) - x0 - (n-1)*gap)/n, s = '';
  var heights = [0.45, 0.72, 0.95, 0.6, 0.85];
  for (var i=0;i<n;i++){
    var parts = String(L[i]).split('|');           /* "label|value" */
    var hh = (full?150:88) * (heights[i % heights.length]);
    var x = x0 + i*(bw+gap), y = base - hh;
    s += '<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+hh.toFixed(1)+
         '" rx="4" fill="'+c+'" fill-opacity="'+(0.18 + i*0.09).toFixed(2)+'" stroke="'+c+'" stroke-width="1.3"/>';
    if (full){
      if (parts[1]) s += text(x + bw/2, y - 12, parts[1], {size:11, weight:700, fill:c, wrap:12});
      s += text(x + bw/2, base + 22, parts[0], {size:10, weight:700, wrap:14});
    }
  }
  s += '<line x1="'+(x0-8)+'" y1="'+base+'" x2="'+(full?430:192)+'" y2="'+base+'" stroke="'+c+'" stroke-width="1.2" opacity=".5"/>';
  return svg(W, H, s);
};

/* 11. TRIANGLE — three labelled corners */
B.triangle = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 270 : 130;
  var cx = W/2, top = full ? 48 : 18, bot = full ? 206 : 112, half = full ? 140 : 72;
  var s = '<polygon points="'+cx+','+top+' '+(cx+half)+','+bot+' '+(cx-half)+','+bot+
          '" fill="'+c+'" fill-opacity=".10" stroke="'+c+'" stroke-width="1.6"/>';
  var pts = [[cx, top],[cx+half, bot],[cx-half, bot]];
  var off = [[0,-26],[34,26],[-34,26]];
  for (var i=0;i<3;i++){
    s += num(pts[i][0], pts[i][1], i+1, c, full?12:6);
    if (full) s += text(pts[i][0]+off[i][0], pts[i][1]+off[i][1], L[i]||'', {size:10.5, weight:700, wrap:16});
  }
  if (full && L[3]) s += text(cx, (top+bot)/2 + 22, L[3], {size:10.5, weight:700, fill:c, wrap:16});
  return svg(W, H, s);
};

/* 12. DIAMOND — centre plus four forces */
B.diamond = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 280 : 130;
  var cx = W/2, cy = full ? 140 : 65, r = full ? 96 : 46;
  var s = '<polygon points="'+cx+','+(cy-r)+' '+(cx+r*1.35)+','+cy+' '+cx+','+(cy+r)+' '+(cx-r*1.35)+','+cy+
          '" fill="'+c+'" fill-opacity=".08" stroke="'+c+'" stroke-width="1.4"/>';
  var pos = [[cx, cy-r],[cx+r*1.35, cy],[cx, cy+r],[cx-r*1.35, cy]];
  for (var i=0;i<4;i++){
    s += '<line x1="'+cx+'" y1="'+cy+'" x2="'+pos[i][0]+'" y2="'+pos[i][1]+'" stroke="'+c+'" stroke-width="1.2" opacity=".45"/>';
    s += num(pos[i][0], pos[i][1], i+1, c, full?12:6);
    if (full){
      if (i === 0) s += text(pos[i][0], pos[i][1] - 30, L[i]||'', {size:10, weight:700, wrap:16});
      else if (i === 2) s += text(pos[i][0], pos[i][1] + 30, L[i]||'', {size:10, weight:700, wrap:16});
      else if (i === 1) s += text(pos[i][0] + 20, pos[i][1], L[i]||'', {size:10, weight:700, wrap:13, anchor:'start'});
      else s += text(pos[i][0] - 20, pos[i][1], L[i]||'', {size:10, weight:700, wrap:13, anchor:'end'});
    }
  }
  s += '<circle cx="'+cx+'" cy="'+cy+'" r="'+(full?34:16)+'" fill="#fff" stroke="'+c+'" stroke-width="1.6"/>';
  if (full && L[4]) s += text(cx, cy, L[4], {size:10, weight:700, fill:c, wrap:11});
  return svg(W, H, s);
};

/* 13. TREE — root with children (and optional grandchildren row) */
B.tree = function (L, c, full){
  var W = full ? 470 : 200, H = full ? 250 : 130;
  var kids = L.slice(1), n = Math.max(2, kids.length);
  var rx = W/2, ry = full ? 40 : 22, cyKid = full ? 150 : 84;
  var s = '';
  for (var i=0;i<n;i++){
    var x = (W/(n+1))*(i+1);
    s += '<line x1="'+rx+'" y1="'+(ry+(full?20:10))+'" x2="'+x+'" y2="'+(cyKid-(full?18:9))+'" stroke="'+c+'" stroke-width="1.2" opacity=".5"/>';
    var kw = full ? Math.min(104, (W/(n+1)) - 12) : 40;
    s += '<rect x="'+(x-kw/2)+'" y="'+(cyKid-(full?20:10))+'" width="'+kw+'" height="'+(full?52:22)+
         '" rx="6" fill="'+c+'" fill-opacity=".14" stroke="'+c+'" stroke-width="1.3"/>';
    if (full) s += text(x, cyKid + 6, kids[i]||'', {size:9.5, weight:700, wrap: full ? Math.max(9, Math.floor(kw/6)) : 15});
  }
  s += '<rect x="'+(rx-(full?70:26))+'" y="'+(ry-(full?20:10))+'" width="'+(full?140:52)+'" height="'+(full?42:20)+
       '" rx="7" fill="'+c+'" fill-opacity=".28" stroke="'+c+'" stroke-width="1.5"/>';
  if (full) s += text(rx, ry + 2, L[0]||'', {size:11, weight:700, wrap:20});
  return svg(W, H, s);
};

/* 14. SPECTRUM — a line with labelled positions */
B.spectrum = function (L, c, full){
  var n = L.length, W = full ? 470 : 200, H = full ? 190 : 130;
  var y = full ? 96 : 65, x0 = full ? 50 : 20, x1 = full ? 420 : 180;
  var s = '<line x1="'+x0+'" y1="'+y+'" x2="'+x1+'" y2="'+y+'" stroke="'+c+'" stroke-width="2.5" opacity=".45"/>';
  for (var i=0;i<n;i++){
    var x = x0 + (x1-x0)*(n===1?0.5:i/(n-1));
    s += '<circle cx="'+x.toFixed(1)+'" cy="'+y+'" r="'+(full?11:6)+'" fill="#fff" stroke="'+c+'" stroke-width="2"/>';
    if (full) s += text(x, y + (i%2 ? 40 : -36), L[i], {size:10.5, weight:700, wrap:16});
  }
  return svg(W, H, s);
};

/* 15. SCURVE — curve with phase labels */
B.scurve = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 250 : 130;
  var x0 = full ? 52 : 20, y0 = full ? 200 : 112, x1 = full ? 420 : 184, y1 = full ? 40 : 16;
  var s = '<line x1="'+x0+'" y1="'+y0+'" x2="'+x1+'" y2="'+y0+'" stroke="'+MUTED+'" stroke-width="1" opacity=".4"/>' +
          '<line x1="'+x0+'" y1="'+y0+'" x2="'+x0+'" y2="'+y1+'" stroke="'+MUTED+'" stroke-width="1" opacity=".4"/>';
  s += '<path d="M'+x0+','+(y0-6)+' C'+(x0+(x1-x0)*0.42)+','+(y0-10)+' '+(x0+(x1-x0)*0.5)+','+(y1+30)+' '+x1+','+(y1+8)+
       '" fill="none" stroke="'+c+'" stroke-width="2.6"/>';
  if (full){
    for (var i=0;i<L.length && i<3;i++){
      var fx = x0 + (x1-x0)*(0.2 + i*0.32);
      s += '<line x1="'+fx+'" y1="'+y1+'" x2="'+fx+'" y2="'+y0+'" stroke="'+c+'" stroke-width="1" stroke-dasharray="4 4" opacity=".35"/>';
      s += text(fx, y0 + 26, L[i], {size:10.5, weight:700, wrap:16});
    }
    if (L[3]) s += text((x0+x1)/2, y1 - 14, L[3], {size:10, fill:MUTED, wrap:52});
  }
  return svg(W, H, s);
};

/* 16. TIMELINE — ordered milestones */
B.timeline = function (L, c, full){
  var n = L.length, W = full ? 470 : 200, H = full ? 200 : 130, id = mk();
  var y = full ? 100 : 65, x0 = full ? 44 : 18, x1 = full ? 424 : 182;
  var s = arrowDefs(c, id);
  s += '<line x1="'+x0+'" y1="'+y+'" x2="'+x1+'" y2="'+y+'" stroke="'+c+'" stroke-width="2" opacity=".5" marker-end="url(#'+id+')"/>';
  for (var i=0;i<n;i++){
    var x = x0 + (x1-x0-20)*(i/(n-1||1)) + 10;
    s += num(x.toFixed(1), y, i+1, c, full?12:6);
    if (full) s += text(x, y + (i%2 ? 40 : -36), L[i], {size:10.5, weight:700, wrap:16});
  }
  return svg(W, H, s);
};

/* 17. NETWORK — hub with satellites */
B.network = function (L, c, full){
  var kids = L.slice(1), n = Math.max(3, kids.length);
  var W = full ? 460 : 200, H = full ? 270 : 130, cx = W/2, cy = full ? 135 : 65, r = full ? 92 : 44;
  var s = '';
  for (var i=0;i<n;i++){
    var a = -Math.PI/2 + i*2*Math.PI/n, x = cx + r*Math.cos(a), y = cy + r*Math.sin(a);
    s += '<line x1="'+cx+'" y1="'+cy+'" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="'+c+'" stroke-width="1.2" opacity=".4"/>';
    s += '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(full?15:8)+'" fill="'+c+'" fill-opacity=".18" stroke="'+c+'" stroke-width="1.4"/>';
    if (full) s += text(cx + (r+58)*Math.cos(a), cy + (r+42)*Math.sin(a), kids[i]||'', {size:10, weight:700, wrap:13});
  }
  s += '<circle cx="'+cx+'" cy="'+cy+'" r="'+(full?32:15)+'" fill="#fff" stroke="'+c+'" stroke-width="1.8"/>';
  if (full) s += text(cx, cy, L[0]||'', {size:10, weight:700, fill:c, wrap:11});
  return svg(W, H, s);
};

/* 18. HEXAGON — six labelled facets */
B.hexagon = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 280 : 130, cx = W/2, cy = full ? 140 : 65, r = full ? 86 : 44;
  var pts = [], s = '';
  for (var i=0;i<6;i++){
    var a = -Math.PI/2 + i*Math.PI/3;
    pts.push([cx + r*Math.cos(a), cy + r*Math.sin(a)]);
  }
  s += '<polygon points="'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')+
       '" fill="'+c+'" fill-opacity=".10" stroke="'+c+'" stroke-width="1.5"/>';
  for (var j=0;j<6;j++){
    s += '<circle cx="'+pts[j][0].toFixed(1)+'" cy="'+pts[j][1].toFixed(1)+'" r="'+(full?7:4)+'" fill="'+c+'" fill-opacity=".55"/>';
    if (full){
      var a2 = -Math.PI/2 + j*Math.PI/3;
      s += text(cx + (r+42)*Math.cos(a2), cy + (r+30)*Math.sin(a2), L[j]||'', {size:10, weight:700, wrap:13});
    }
  }
  return svg(W, H, s);
};

/* 19. ARROW — chevron chain (value chain style) */
B.arrow = function (L, c, full){
  var n = L.length, W = full ? 470 : 200, H = full ? 180 : 130;
  var x0 = full ? 20 : 10, y = full ? 60 : 48, h = full ? 66 : 34;
  var w = ((full?450:190) - x0)/n, tip = full ? 18 : 9, s = '';
  for (var i=0;i<n;i++){
    var x = x0 + i*w;
    s += '<polygon points="'+x+','+y+' '+(x+w-tip)+','+y+' '+(x+w)+','+(y+h/2)+' '+(x+w-tip)+','+(y+h)+' '+x+','+(y+h)+' '+
         (x+tip)+','+(y+h/2)+'" fill="'+c+'" fill-opacity="'+(0.12 + i*0.06).toFixed(2)+'" stroke="'+c+'" stroke-width="1.3"/>';
    if (full) s += text(x + w/2 + 2, y + h/2, L[i], {size:10, weight:700, wrap:13});
  }
  return svg(W, H, s);
};

/* 20. ICEBERG — visible above, hidden below the waterline */
B.iceberg = function (L, c, full){
  var W = full ? 460 : 200, H = full ? 280 : 130, cx = W/2, wl = full ? 108 : 52;
  var s = '<line x1="'+(full?40:14)+'" y1="'+wl+'" x2="'+(full?420:186)+'" y2="'+wl+
          '" stroke="'+c+'" stroke-width="1.3" stroke-dasharray="6 5" opacity=".6"/>';
  s += '<polygon points="'+(cx-58)+','+wl+' '+(cx+58)+','+wl+' '+cx+','+(full?52:16)+
       '" fill="'+c+'" fill-opacity=".22" stroke="'+c+'" stroke-width="1.4"/>';
  s += '<polygon points="'+(cx-102)+','+wl+' '+(cx+102)+','+wl+' '+(cx+118)+','+(full?252:120)+' '+(cx-118)+','+(full?252:120)+
       '" fill="'+c+'" fill-opacity=".09" stroke="'+c+'" stroke-width="1.3"/>';
  if (full){
    s += text(cx, wl - 74, L[0]||'', {size:10.5, weight:700, wrap:30});
    for (var i=1;i<L.length && i<5;i++) s += text(cx, wl + 26 + (i-1)*30, L[i], {size:10.5, weight:700, wrap:34});
  }
  return svg(W, H, s);
};

/* 21. CIRCLE — concentric rings, inner first */
B.circle = function (L, c, full){
  var n = Math.max(2, L.length), W = full ? 460 : 200, H = full ? 270 : 130;
  var cx = W/2, cy = full ? 132 : 65, rMax = full ? 104 : 50, s = '';
  for (var i=n-1;i>=0;i--){
    var r = rMax*(i+1)/n;
    s += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r.toFixed(1)+'" fill="'+c+'" fill-opacity="'+(0.07 + (n-i)*0.05).toFixed(2)+
         '" stroke="'+c+'" stroke-width="1.4"/>';
  }
  if (full){
    for (var j=0;j<n;j++){
      var rr = rMax*(j+1)/n, y = cy - rr + (j===0 ? 0 : 18);
      s += text(cx, j===0 ? cy : y, L[j], {size:10.5, weight:700, wrap:20});
    }
  }
  return svg(W, H, s);
};

/* ---------------------------------------------------------- API */
function FIG(type, labels, color, mode){
  var f = B[type] || B.matrix;
  return f(labels || [], color || '#1B2A4A', mode === 'full');
}
FIG.types = Object.keys(B);
root.FIG = FIG;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
