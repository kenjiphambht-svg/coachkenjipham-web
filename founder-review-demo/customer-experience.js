/* Customer Experience module: synthetic localStorage fixtures only. */
(function () {
  'use strict';

  const templates = {
    ebook: { label:'Ebook / Góc đọc', tone:'Nhẹ, mở và có nhịp đọc lại dễ dàng.', sections:['Lời mở đầu','Một khoảng để đọc','Ghi chú kết'], detail:'Ba phần ngắn, một tài nguyên tiếp nối tùy chọn.' },
    assessment: { label:'Tôi đang ở đâu?', tone:'Rõ ràng, bình tĩnh, không chẩn đoán.', sections:['Điều đang hiện ra','Ba chiều quan sát','Một bước thực hành'], detail:'Result v0 theo rule deterministic; không có tỷ lệ hay kết luận tâm lý.' },
    unique: { label:'Bạn Là Duy Nhất', tone:'Một ấn phẩm biên tập riêng, có khoảng thở.', sections:['Mở đầu','Một điều đang rõ','Câu hỏi để trở lại'], detail:'Preview contract; không suy ra giá, SLA hay chính sách.' },
    dauan: { label:'Dấu Ấn Của Bạn', tone:'Hai lớp đọc nối từ phiên gặp đến bản viết.', sections:['Lớp một','Lớp hai','Điểm trở lại ngày 30'], detail:'Preview contract; có khối session insight và update version.' },
    hatmam: { label:'Bản Sắc Hạt Mầm · 0–7', tone:'Ấm, dịu, dành cho phụ huynh quan sát.', sections:['Lời dẫn cho ba mẹ','Những điều đang lớn','Một gợi ý trò chuyện'], detail:'Không gán nhãn hay dự đoán về trẻ.' },
    khampha: { label:'Bản Sắc Khám Phá · 7–14', tone:'Trưởng thành hơn Hạt Mầm, vẫn chừa chỗ cho tiếng nói của con.', sections:['Một mùa ở trường','Bạn bè và chỗ đứng','Một câu hỏi cho ba mẹ'], detail:'Preview độc lập; không kế thừa consent, giá hay form từ Hạt Mầm.' },
    giaomua: { label:'Bản Sắc Giao Mùa · 14–21', tone:'Chín chắn, tôn trọng khoảng riêng và sự tham gia.', sections:['Một ngưỡng cửa','Điều muốn được giữ riêng','Một cuộc trò chuyện có thể bắt đầu'], detail:'Ba mô hình autonomy chỉ là proposal; cần Founder Decision.' },
    lang: { label:'Lặng follow-up', tone:'Một đề xuất theo sau phiên gặp, không mặc định có cho mọi phiên.', sections:['Tóm tắt đã duyệt','Một phản chiếu','Lần trở lại tiếp theo'], detail:'Phụ thuộc contract Lặng được Founder duyệt trong tương lai.' }
  };
  const blocks = ['Opening note','Cover / title','Reading guidance','Table of contents','Chapter','Reflection question','PDF A5 download','Version update notice','Support request','Privacy reminder','Cánh cửa tiếp theo'];

  function safeState(data) {
    if (!data.customerExperience) data.customerExperience = {
      template:'hatmam', chapter:1, autonomy:'shared', journey:'3', journeyMode:'customer',
      config:{ preset:'Editorial yên tĩnh', toc:true, pdf:true, door:true, order:[0,1,2,3,4,5,6,7,8,9,10], versions:[{number:2,label:'Đang dùng', changed:'Reading guidance, chapter order'}] },
      landing:null
    };
    return data.customerExperience;
  }
  function customerPage(title, lede, body) {
    return `<section class="customer-shell"><p class="customer-kicker">ESSENCE · KHÔNG GIAN RIÊNG · MÔ PHỎNG</p><h1 class="customer-title">${title}</h1><p class="customer-lede">${lede}</p>${body}</section>`;
  }
  function publicStatus(label) { return `<span class="customer-status">${label}</span>`; }

  window.EssenceCustomerExperience = function createCustomerExperience(ctx) {
    const data = () => ctx.getData();
    const cx = () => safeState(data());
    const roomLink = (label, id) => ctx.action(label, `cx-template-${id}`);
    function renderHome() {
      return customerPage('Không gian của tôi', 'Một nơi riêng để trở lại với điều đang mở ra — không phải một dashboard tài khoản.', `
        <div class="customer-note"><strong>Founder Review Demo.</strong> Không có tài khoản, email, magic link hay dữ liệu thật trong không gian này.</div>
        <section class="customer-continue"><div><p class="customer-kicker">TIẾP TỤC</p><h2>Bản Sắc Hạt Mầm · bản mẫu</h2><p>Bạn đang ở phần “Những điều đang lớn”. Có thể đọc tiếp khi có một khoảng yên.</p></div>${roomLink('Đọc tiếp','hatmam')}</section>
        <section class="customer-grid"><article class="customer-card"><p class="customer-kicker">THƯ VIỆN CỦA TÔI</p><h2>Những gì đang ở cùng bạn</h2><p>Ebook, kết quả quan sát, ấn phẩm và những bản cập nhật đã được duyệt.</p>${ctx.action('Mở Thư viện','cx-library')}</article><article class="customer-card"><p class="customer-kicker">HÀNH TRÌNH CỦA TÔI</p><h2>Một điểm trở lại</h2><p>Không có điểm số hay streak. Chỉ có các mốc, buổi gặp và điều đang tiếp tục.</p>${ctx.action('Xem hành trình 3 tháng','cx-journey-3')}</article></section>
        <section class="customer-door"><p class="customer-kicker">MỘT CÁNH CỬA KHÁC</p><h2>Khi bạn muốn đi thêm một bước</h2><p>“Tôi đang ở đâu?” là một góc quan sát ngắn, hiện ở trạng thái <strong>Xem trước</strong>.</p>${ctx.action('Xem trang giới thiệu (mô phỏng)','cx-next-assessment')}</section>
        <div class="button-set">${ctx.action('Quay lại Founder Operating Console','cx-console')} ${ctx.action('Cấu hình trải nghiệm','cx-config')}</div>`);
    }
    function renderTemplate() {
      const state=cx(); const template=templates[state.template] || templates.hatmam; const chapter=Math.min(state.chapter,template.sections.length); const config=state.config;
      const autonomy=state.template==='giaomua' ? `<section class="customer-card"><p class="customer-kicker">ACCESS PROPOSAL · CHỜ FOUNDER QUYẾT ĐỊNH</p><h2>Cách ai được cùng đọc</h2><div class="button-set">${['parent','shared','young'].map(key=>ctx.action(key===state.autonomy?({parent:'Phụ huynh là chính',shared:'Cùng đọc',young:'Người trẻ là chính'}[key]+' · đang xem'):({parent:'Phụ huynh là chính',shared:'Cùng đọc',young:'Người trẻ là chính'}[key]),`cx-autonomy-${key}`,key===state.autonomy?'button':'button-secondary')).join(' ')}</div><p class="small">Đây là Experience Proposal, không quyết định quyền truy cập, sửa đổi hay xóa.</p></section>`:'';
      return customerPage(template.label, template.tone, `
        <div class="customer-room-head"><div><p class="customer-kicker">PHÒNG ĐỌC RIÊNG · DỮ LIỆU GIẢ</p><h2>${template.label}</h2><p>${template.detail}</p></div>${publicStatus('Bản đọc mô phỏng · v2')}</div>
        ${autonomy}
        <section class="customer-grid">${config.toc?`<aside class="customer-card customer-toc"><p class="customer-kicker">MỤC LỤC</p>${template.sections.map((s,i)=>`<button class="customer-chapter ${chapter===i+1?'current':''}" data-action="cx-chapter-${i+1}">${i+1}. ${s}</button>`).join('')}</aside>`:''}<article class="customer-reading"><p class="customer-kicker">PHẦN ${chapter}/${template.sections.length}</p><h2>${template.sections[chapter-1]}</h2><p>Đây là nội dung đọc mẫu để Founder đánh giá nhịp, khoảng trắng và cách dẫn dắt. Không có văn bản của khách, trẻ em hay ấn phẩm thật.</p><blockquote>“Đọc chậm cũng là một cách để giữ lại điều vừa chạm tới.”</blockquote><p class="small">Mô phỏng tiến độ chỉ nằm trên thiết bị này.</p><div class="button-set">${chapter>1?ctx.action('Quay lại','cx-prev'):''}${chapter<template.sections.length?ctx.action('Tiếp theo','cx-next'):''}</div></article></section>
        <section class="customer-grid"><article class="customer-card"><h2>Đọc và giữ riêng</h2><p>PDF A5 chỉ là nút minh họa. Bản thật cần entitlement, Private Storage, checksum và signed URL ngắn hạn.</p>${config.pdf?ctx.action('Tải PDF A5 (mô phỏng)','cx-pdf'):'<p class="small">PDF đang được ẩn theo template preview.</p>'}</article><article class="customer-card"><h2>Cần hỗ trợ?</h2><p>Link, hiển thị, clarification, revision khi contract cho phép hoặc deletion concern.</p>${ctx.action('Gửi yêu cầu hỗ trợ giả','cx-support')}</article></section>
        ${config.door?`<section class="customer-door"><p class="customer-kicker">CÁNH CỬA TIẾP THEO</p><h2>Có thể phù hợp với nơi bạn đang đứng</h2><p>Tối đa một đề xuất, không checkout, không khan hiếm và không suy luận từ nội dung riêng tư.</p>${ctx.action('Xem Bản Sắc Khám Phá (mô phỏng)','cx-next-khampha')}</section>`:''}
        <div class="button-set">${ctx.action('Về Không gian của tôi','cx-home')} ${ctx.action('Về Thư viện','cx-library')} ${ctx.action('Cấu hình template','cx-config')}</div>`);
    }
    function journeyData(months) {
      if(months==='3') return {title:'Ba tháng để trở lại', milestones:['Mở đầu: điều muốn giữ','Buổi gặp thứ hai','Điểm trở lại cuối chặng'], next:'Một buổi gặp mẫu sắp tới', private:'Ghi chú Kenji riêng: chỉ để chuẩn bị buổi gặp.'};
      if(months==='6') return {title:'Sáu tháng theo nhịp riêng', milestones:['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6'], next:'Chuẩn bị khách hàng mẫu đang quá hạn', private:'Tóm tắt đang chờ Founder phê duyệt.'};
      return {title:'Mười hai tháng, bốn lần nhìn lại', milestones:['Quý I','Quý II','Quý III','Quý IV'], next:'Điểm trở lại quý tiếp theo', private:'Ghi chú vận hành nội bộ — không xuất hiện cho khách.'};
    }
    function renderJourney() {
      const state=cx(); const fixture=journeyData(state.journey); const founder=state.journeyMode==='founder';
      return customerPage('Hành trình của tôi', 'Một không gian dài hạn cho mốc, lựa chọn và điều tiếp tục — không phải habit tracker hay hồ sơ trị liệu.', `
        <div class="customer-tabs">${['3','6','12'].map(n=>ctx.action(`${n} tháng${state.journey===n?' · đang xem':''}`,`cx-journey-${n}`,state.journey===n?'button':'button-secondary')).join(' ')} ${ctx.action(founder?'Founder preview · đang xem':'Customer preview','cx-toggle-journey',founder?'button':'button-secondary')}</div>
        <section class="customer-grid"><article class="customer-card"><p class="customer-kicker">Ý ĐỊNH BAN ĐẦU · DỮ LIỆU GIẢ</p><h2>${fixture.title}</h2><p>Một câu định hướng ngắn, không phải cam kết phải trở thành một ai khác.</p><p>${publicStatus('Khách hàng riêng tư')}</p></article><article class="customer-card"><p class="customer-kicker">ĐIỂM TRỞ LẠI</p><h2>${fixture.next}</h2><p>Chuẩn bị trước buổi gặp, một shared practice và lời nhắc bình tĩnh.</p><p>${publicStatus('Chia sẻ')}</p></article></section>
        <section class="customer-card"><p class="customer-kicker">CÁC MỐC</p><ol class="timeline">${fixture.milestones.map((m,i)=>`<li><time>${i+1}</time>${m}</li>`).join('')}</ol></section>
        <section class="customer-grid"><article class="customer-card"><h2>Thực hành chung</h2><p>Một thực hành ngắn được Kenji duyệt · ${publicStatus('Chia sẻ')}</p></article><article class="customer-card"><h2>Phản chiếu của tôi</h2><p>Một dòng reflection mẫu chỉ thuộc khách hàng · ${publicStatus('Khách hàng riêng tư')}</p></article></section>
        ${founder?`<section class="customer-private"><p class="customer-kicker">KENJI PRIVATE · CHỈ FOUNDER PREVIEW</p><h2>Điều cần chuẩn bị</h2><p>${fixture.private}</p>${publicStatus('Kenji private')}</section>`:''}
        <section class="customer-note">Không có streak, điểm, ranking, % tiến bộ, giám sát tự động, nhắn tin 24/7 hay hỗ trợ khẩn cấp trong trải nghiệm này.</section><div class="button-set">${ctx.action('Về Không gian của tôi','cx-home')} ${ctx.action('Cấu hình Journey template','cx-config')}</div>`);
    }
    function renderConfig() {
      const state=cx(); const config=state.config; const ordered=config.order.map(i=>blocks[i]);
      return ctx.page('Cấu hình trải nghiệm', 'Founder Review Demo: chỉ chọn các block/preset đã duyệt. Mọi thay đổi lưu một phiên bản local mới, không đổi room đã giao.', `
        <div class="notice"><strong>Configuration ≠ code change.</strong> Template/label/order/block đã duyệt là configuration. Block mới, access model, media provider, AI, migration tự động, public route hay provider là code + tests + Founder approval.</div>
        <section class="grid two"><article class="card"><h2>Template family & preset</h2><div class="button-set">${Object.keys(templates).map(key=>ctx.action(templates[key].label,`cx-config-template-${key}`,state.template===key?'button':'button-secondary')).join(' ')}</div><p class="small">Preset: ${config.preset} · ${config.toc?'Mục lục hiện':'Mục lục ẩn'} · ${config.pdf?'PDF hiện':'PDF ẩn'} · ${config.door?'Cánh cửa hiện':'Cánh cửa ẩn'}</p><div class="button-set">${ctx.action('Đổi preset editorial','cx-preset')} ${ctx.action('Ẩn/hiện mục lục','cx-toggle-toc')} ${ctx.action('Ẩn/hiện PDF','cx-toggle-pdf')} ${ctx.action('Ẩn/hiện Cánh cửa','cx-toggle-door')}</div></article><article class="card"><h2>Version history</h2>${config.versions.map(v=>`<p>${publicStatus(`v${v.number} · ${v.label}`)}<br><span class="small">${v.changed}</span></p>`).join('')}<div class="button-set">${ctx.action('Lưu phiên bản mới','cx-save-version')} ${ctx.action('Khôi phục v1 thành phiên bản mới','cx-restore-version')}</div><p class="small">“Áp dụng cho sản phẩm mới” chỉ là mô phỏng. “Đề xuất chuyển các phòng hiện có” bị chặn: cần migration process và Founder approval.</p></article></section>
        <section class="card" style="margin-top:14px"><h2>Block order · controlled library</h2><ol class="timeline">${ordered.map((name,index)=>`<li><time>${index+1}</time>${name} ${index>0?`<button class="link-button" data-action="cx-block-up-${index}">Lên</button>`:''} ${index<ordered.length-1?`<button class="link-button" data-action="cx-block-down-${index}">Xuống</button>`:''}</li>`).join('')}</ol></section><div class="button-set">${ctx.action('Preview desktop/mobile','cx-preview-template')} ${ctx.action('Về Customer Home','cx-home')}</div>`);
    }
    function renderLanding() {
      const destination=cx().landing || '/an-pham-ban-sac-kham-pha';
      return customerPage('Một cánh cửa khác', 'Đây là preview của một điểm đến đã có trong repository. Demo không điều hướng ra website công khai để giữ no-network.', `<section class="customer-door"><p class="customer-kicker">ĐIỂM ĐẾN CẤU HÌNH</p><h2>${destination}</h2><p>${publicStatus(destination.includes('kham')?'Xem trước':'Chưa nhận đăng ký')}</p><p>Không checkout, không giảm giá, không popup và không kết nối sản phẩm legacy.</p></section><div class="button-set">${ctx.action('Quay lại','cx-home')}</div>`);
    }
    function handleAction(id) {
      const state=cx();
      if (id==='cx-home'){data().view='customer-home';return true;} if(id==='cx-library'){data().view='library';return true;} if(id==='cx-console'){data().view='overview';return true;} if(id==='cx-config'){data().view='cx-config';return true;}
      if(id==='cx-prev'){state.chapter=Math.max(1,state.chapter-1);return true;} if(id==='cx-next'){const t=templates[state.template];state.chapter=Math.min(t.sections.length,state.chapter+1);return true;}
      if(id==='cx-pdf'){ctx.audit(`Mô phỏng PDF A5 cho customer template ${state.template}; không có file, URL hay Storage.`);ctx.notice('Mô phỏng: kiểm tra quyền và PDF A5. Không có file hay link thật.');return true;}
      if(id==='cx-support'){ctx.audit(`Mô phỏng support request cho customer template ${state.template}; không tạo email hoặc ticket thật.`);ctx.notice('Đã ghi yêu cầu hỗ trợ giả trong audit demo.');return true;}
      if(id==='cx-toggle-journey'){state.journeyMode=state.journeyMode==='customer'?'founder':'customer';return true;}
      if(id==='cx-preset'){state.config.preset=state.config.preset==='Editorial yên tĩnh'?'Đọc sâu':'Editorial yên tĩnh';return true;}
      if(id==='cx-toggle-toc'){state.config.toc=!state.config.toc;return true;} if(id==='cx-toggle-pdf'){state.config.pdf=!state.config.pdf;return true;} if(id==='cx-toggle-door'){state.config.door=!state.config.door;return true;}
      if(id==='cx-save-version'||id==='cx-restore-version'){const n=Math.max(...state.config.versions.map(v=>v.number))+1;state.config.versions.unshift({number:n,label:'Bản mới (local)',changed:id==='cx-restore-version'?'Khôi phục v1 như một phiên bản mới':'Preset, visibility hoặc block order đã duyệt'});ctx.audit(`Đã ${id==='cx-restore-version'?'khôi phục':'lưu'} template version v${n} trong demo; room đã giao không đổi.`);ctx.notice(`Đã tạo v${n} local; không ghi đè phiên bản cũ.`);return true;}
      if(id==='cx-preview-template'){data().view='cx-template';ctx.notice('Preview responsive là mô phỏng; không có route, provider hoặc public activation.');return true;}
      if(id.startsWith('cx-template-')){state.template=id.slice('cx-template-'.length);state.chapter=1;data().view='cx-template';return true;}
      if(id.startsWith('cx-config-template-')){state.template=id.slice('cx-config-template-'.length);return true;}
      if(id.startsWith('cx-chapter-')){state.chapter=Number(id.slice('cx-chapter-'.length));return true;}
      if(id.startsWith('cx-autonomy-')){state.autonomy=id.slice('cx-autonomy-'.length);return true;}
      if(id.startsWith('cx-journey-')){state.journey=id.slice('cx-journey-'.length);data().view='cx-journey';return true;}
      if(id.startsWith('cx-next-')){state.landing=id==='cx-next-khampha'?'/an-pham-ban-sac-kham-pha':'/toi-dang-o-dau (future route)';data().view='cx-landing';return true;}
      if(id.startsWith('cx-block-')){const parts=id.split('-');const direction=parts[2];const index=Number(parts[3]);const target=direction==='up'?index-1:index+1;const order=state.config.order;[order[index],order[target]]=[order[target],order[index]];return true;}
      return false;
    }
    return { renderHome, renderTemplate, renderJourney, renderConfig, renderLanding, handleAction };
  };
})();
