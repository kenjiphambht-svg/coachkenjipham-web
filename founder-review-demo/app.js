/*
 * Founder Review Demo only. No fetch/XHR, no API client and no credentials.
 * State is intentionally limited to the current browser's localStorage.
 */
(function () {
  'use strict';

  const STORE = 'essence-founder-review-demo-v1';
  const now = '03/08/2026, 10:20';
  const initial = {
    view: 'overview',
    langStatus: 'Chờ Kenji quyết định',
    langDecision: null,
    payment: 'Đã báo chuyển khoản — chờ review',
    hatmamStatus: 'Đã thanh toán',
    publication: 'Chờ Kenji duyệt',
    deletion: 'Mở — chưa thực thi',
    settings: { price: 1500000, capacity: 10, delivery: 5, revision: 7, retention: 12 },
    versions: [{ number: 3, time: '02/08/2026, 16:10', label: 'Phiên bản đang dùng', price: 1500000, capacity: 10 }],
    audit: [
      { time: '03/08/2026, 09:20', text: 'Hồ sơ Lặng giả L-024 được đưa vào hàng chờ Kenji.' },
      { time: '03/08/2026, 09:35', text: 'Biên nhận giả cho HM-018 đã được báo; cần Kenji review.' },
      { time: '02/08/2026, 16:10', text: 'Cài đặt phiên bản 3 được kích hoạt trong dữ liệu demo.' }
    ]
  };
  const nav = [
    ['overview', 'Tổng quan hôm nay'], ['lang', 'Lặng'], ['lang-detail', 'Hồ sơ Lặng'],
    ['payments', 'Thanh toán'], ['hatmam', 'Hạt Mầm'], ['hatmam-detail', 'Đơn Hạt Mầm'],
    ['production', 'Quy trình sản xuất'], ['publication', 'Xuất bản riêng tư'],
    ['deletion', 'Xóa dữ liệu & retention'], ['settings', 'Cài đặt versioned'],
    ['audit', 'Audit history'], ['readiness', 'Readiness & release gates'], ['contact', 'Liên hệ']
  ];
  const main = document.getElementById('main');
  const navigation = document.getElementById('navigation');
  const toast = document.getElementById('toast');
  let timer;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function state() {
    try { const saved = JSON.parse(localStorage.getItem(STORE)); return saved ? { ...clone(initial), ...saved } : clone(initial); }
    catch (_) { return clone(initial); }
  }
  let data = state();
  function save() { localStorage.setItem(STORE, JSON.stringify(data)); }
  function esc(value) { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' }[c])); }
  function badge(label, tone) { return `<span class="badge ${tone || ''}">${esc(label)}</span>`; }
  function action(label, id, tone) { return `<button class="button ${tone || 'button-secondary'}" data-action="${id}">${label}</button>`; }
  function notice(message) { toast.textContent = message; toast.classList.add('visible'); clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('visible'), 3800); }
  function audit(text) { data.audit.unshift({ time: now, text }); save(); }
  function stat(label, value) { return `<article class="card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></article>`; }
  function page(title, lede, body) { return `<h1 class="view-title">${title}</h1><p class="lede">${lede}</p>${body}`; }
  function link(label, view) { return `<button class="link-button" data-view="${view}">${label} →</button>`; }
  function statusTone(status) { return /chặn|quá hạn|OFF|chưa|cần chỉnh|mở/i.test(status) ? 'blocked' : /sẵn sàng|đã thanh toán|phù hợp|duyệt/i.test(status) ? 'ready' : 'pending'; }

  function renderOverview() {
    return page('Tổng quan hôm nay', 'Bắt đầu bằng những việc Kenji cần xử lý — toàn bộ con số và hồ sơ dưới đây là dữ liệu giả.', `
      <div class="notice"><strong>Tóm tắt hỗ trợ theo quy tắc — dữ liệu thử.</strong> Không có AI report thật, không có kết nối dữ liệu vận hành.</div>
      <section class="grid stats">
        ${stat('Hồ sơ Lặng mới', '2')}${stat('Chờ quyết định', data.langDecision ? '1' : '2')}${stat('Thanh toán chờ xác nhận', data.payment.toLowerCase().includes('xác nhận') ? '0' : '1')}${stat('Hạt Mầm đang sản xuất', data.hatmamStatus === 'Đang sản xuất' ? '2' : '1')}
        ${stat('Bản thảo chờ duyệt', data.publication === 'Chờ Kenji duyệt' ? '1' : '0')}${stat('Revision chờ xử lý', data.hatmamStatus === 'Cần chỉnh sửa' ? '1' : '0')}${stat('Yêu cầu xóa', data.deletion.includes('Mở') ? '1' : '0')}${stat('Việc quá SLA', '1')}
      </section>
      <section class="grid two" style="margin-top:14px">
        <article class="card urgent"><h2>Ưu tiên 1 — cần Kenji xử lý</h2><div class="action-list">
          <div class="action-row"><div><strong>Hồ sơ Lặng · L-024</strong><p>${esc(data.langStatus)} · đã chờ 1 giờ 20 phút</p></div>${link('Mở hồ sơ', 'lang-detail')}</div>
          <div class="action-row"><div><strong>Biên nhận giả · HM-018</strong><p>${esc(data.payment)} · khớp snapshot ₫1.500.000</p></div>${link('Review receipt', 'payments')}</div>
          <div class="action-row"><div><strong>Bản thảo Hạt Mầm · HM-013</strong><p>${esc(data.publication)} · Private Storage chưa sẵn sàng</p></div>${link('Review ấn phẩm', 'publication')}</div>
        </div></article>
        <article class="card"><h2>Hạn và capacity</h2><div class="action-list">
          <div class="action-row"><div><strong>HM-011 quá hạn 1 ngày</strong><p>Target giao: 02/08/2026 · cần xử lý trước</p></div>${badge('QUÁ HẠN','blocked')}</div>
          <div class="action-row"><div><strong>Hạt Mầm tháng 08</strong><p>6/10 chỗ đã dùng · 4 chỗ còn lại</p></div>${badge('CÒN 4 CHỖ','ready')}</div>
          <div class="action-row"><div><strong>Hồ sơ Lặng</strong><p>9/10 suất tháng này · 1 suất còn lại</p></div>${badge('SẮP ĐẦY','pending')}</div>
        </div></article>
      </section>
      <section class="grid two" style="margin-top:14px">
        <article class="card"><h2>Readiness cần biết</h2><div class="readiness">
          <div class="readiness-row"><span>Cal.com</span>${badge('CHƯA KẾT NỐI','blocked')}</div><div class="readiness-row"><span>Resend</span>${badge('CHƯA KẾT NỐI','blocked')}</div><div class="readiness-row"><span>Private Storage</span>${badge('CHƯA SẴN SÀNG','blocked')}</div><div class="readiness-row"><span>Public activation</span>${badge('OFF','blocked')}</div>
        </div></article>
        <article class="card"><h2>Đi nhanh</h2><div class="button-set">${action('Xử lý Lặng','go-lang')} ${action('Xem payment','go-payment')} ${action('Xem deletion','go-deletion')} ${action('Xem cài đặt','go-settings')}</div><p class="small">Mọi nút trong demo chỉ thay đổi local state của trình duyệt này.</p></article>
      </section>`);
  }

  function renderLang() {
    return page('Lặng', 'Hàng chờ hồ sơ giả. Không có tên, email hoặc dữ liệu người thật.', `
      <div class="table-wrap"><table class="table"><thead><tr><th>Mã hồ sơ</th><th>Trạng thái</th><th>Nhận lúc</th><th>SLA</th><th></th></tr></thead><tbody>
      <tr><td><strong>L-024</strong><br><span class="small">Hồ sơ synthetic</span></td><td>${badge(data.langStatus,statusTone(data.langStatus))}</td><td>03/08, 08:40</td><td>${badge('QUÁ 20 PHÚT','blocked')}</td><td>${link('Mở','lang-detail')}</td></tr>
      <tr><td><strong>L-023</strong><br><span class="small">Hồ sơ synthetic</span></td><td>${badge('Đang đọc','pending')}</td><td>03/08, 09:45</td><td>${badge('CÒN 45 PHÚT','ready')}</td><td>${link('Mở','lang-detail')}</td></tr>
      <tr><td><strong>L-021</strong><br><span class="small">Hồ sơ synthetic</span></td><td>${badge('Đã xếp lịch giả','ready')}</td><td>02/08, 14:10</td><td>—</td><td>${link('Mở','lang-detail')}</td></tr>
      </tbody></table></div>
      <div class="notice" style="margin-top:18px">Tất cả hồ sơ trong đây là fixture. Luồng Lặng thật vẫn được bảo vệ bởi Auth, AAL2, RLS và staging gates.</div>`);
  }

  function renderLangDetail() {
    const decision = data.langDecision ? `Quyết định demo: ${data.langDecision}` : 'Chưa có quyết định';
    return page('Hồ sơ Lặng · L-024', 'Hồ sơ minh họa tối thiểu, không có dữ liệu cá nhân hay nội dung của khách.', `
      <div class="detail-head"><div><p class="section-label">SYNTHETIC INTAKE</p><h2 style="margin:0;font-family:Georgia,serif;font-weight:400">L-024 · hồ sơ mẫu</h2><p>${esc(decision)}</p></div>${badge(data.langStatus,statusTone(data.langStatus))}</div>
      <section class="grid two"><article class="card"><h2>Thông tin an toàn để review</h2><div class="kv"><div class="muted">Mục tiêu buổi</div><div>Khám phá một chủ đề chung</div><div class="muted">Khung thời gian</div><div>Buổi 60 phút · synthetic</div><div class="muted">Tóm tắt</div><div>Tóm tắt hỗ trợ theo quy tắc — dữ liệu thử</div><div class="muted">Capacity</div><div>1/10 suất còn lại</div></div></article>
      <article class="card"><h2>Đưa ra quyết định</h2><p class="small">Chỉ thử giao diện. Quyết định này không ghi vào database và không gửi email.</p><div class="button-set">${action('Bắt đầu đọc','lang-read')} ${action('Phù hợp','lang-fit')} ${action('Chờ thêm','lang-more')} ${action('Chưa phù hợp','lang-no')}</div></article></section>
      <section class="grid two" style="margin-top:14px"><article class="card"><h2>Thanh toán và lịch</h2><p>${badge('BIÊN NHẬN GIẢ','pending')} <span class="small">Payment chỉ sau submission hợp lệ.</span></p><div class="button-set">${action('Xem biên nhận giả','go-payment')} ${action('Phát link đặt lịch giả','fake-booking')}</div><p class="small">Cal.com chưa kết nối — không có booking thật được tạo.</p></article><article class="card"><h2>Audit synthetic</h2><ul class="timeline"><li><time>03/08/2026, 08:40</time>Hồ sơ fixture được tạo cho demo.</li><li><time>03/08/2026, 09:20</time>Được đưa vào hàng chờ Kenji.</li>${data.langDecision ? `<li><time>${now}</time>Đã chọn “${esc(data.langDecision)}” trong browser.</li>` : ''}</ul></article></section>`);
  }

  function renderPayments() {
    return page('Thanh toán', 'Payment evidence demo — biên nhận giả chỉ gắn với đúng đơn giả HM-018.', `
      <div class="notice"><strong>Payment evidence gate (minh họa):</strong> chỉ khi đúng order, reported transfer, evidence, request chưa revoked, amount và transfer reference khớp package snapshot thì nút xác nhận mới hiển thị.</div>
      <section class="grid two"><article class="card"><h2>Biên nhận giả · HM-018</h2><div class="kv"><div class="muted">Package snapshot</div><div>Hạt Mầm — phiên bản 3</div><div class="muted">Amount snapshot</div><div>₫1.500.000</div><div class="muted">Transfer reference</div><div>DEMO-HM-018</div><div class="muted">Evidence synthetic</div><div>${badge('ĐÃ ĐÍNH KÈM','ready')}</div><div class="muted">Reported transfer</div><div>03/08/2026, 09:35</div></div><div class="button-set">${action(data.payment.toLowerCase().includes('xác nhận') ? 'Đã xác nhận' : 'Xác nhận payment giả','confirm-payment', data.payment.toLowerCase().includes('xác nhận') ? 'button-quiet' : '')}</div></article>
      <article class="card"><h2>Kiểm tra atomically</h2><div class="readiness"><div class="readiness-row"><span>Đúng subject / order</span>${badge('PASS','ready')}</div><div class="readiness-row"><span>Evidence + reported time</span>${badge('PASS','ready')}</div><div class="readiness-row"><span>Request chưa revoked</span>${badge('PASS','ready')}</div><div class="readiness-row"><span>Amount + reference khớp snapshot</span>${badge('PASS','ready')}</div></div><p class="small">Đây là bằng chứng mô phỏng; không tạo receipt hay payment thật.</p></article></section>
      <section class="card" style="margin-top:14px"><h2>Không có receipt dùng chung</h2><p class="small">HM-017 bị chặn trong fixture vì reference không khớp. Giao diện không cho xác nhận dựa chỉ vào trạng thái “awaiting payment”.</p>${badge('BỊ CHẶN — REFERENCE KHÔNG KHỚP','blocked')}</section>`);
  }

  function renderHatmam() {
    return page('Hạt Mầm', 'Danh sách đơn synthetic. Giá và thời hạn của từng đơn được bảo toàn từ package snapshot.', `
      <div class="table-wrap"><table class="table"><thead><tr><th>Mã đơn</th><th>Trạng thái thật</th><th>Giao trước</th><th>Revision đến</th><th></th></tr></thead><tbody>
        <tr><td><strong>HM-018</strong><br><span class="small">Snapshot v3 · ₫1.500.000</span></td><td>${badge(data.hatmamStatus,statusTone(data.hatmamStatus))}</td><td>08/08/2026</td><td>15/08/2026</td><td>${link('Mở đơn','hatmam-detail')}</td></tr>
        <tr><td><strong>HM-013</strong><br><span class="small">Snapshot v2 · ₫1.400.000</span></td><td>${badge(data.publication,'pending')}</td><td>05/08/2026</td><td>12/08/2026</td><td>${link('Review','publication')}</td></tr>
        <tr><td><strong>HM-011</strong><br><span class="small">Snapshot v2 · ₫1.400.000</span></td><td>${badge('Đang sản xuất','pending')}</td><td>02/08/2026</td><td>09/08/2026</td><td>${badge('QUÁ HẠN','blocked')}</td></tr>
      </tbody></table></div>
      <div class="callout" style="margin-top:16px">Monthly capacity: <strong>6/10</strong>. Thay đổi cài đặt demo có thể tác động đơn mới, nhưng không đổi price, package, delivery, revision hay retention của HM-013/HM-018 đã snapshot.</div>`);
  }

  function renderHatmamDetail() {
    return page('Đơn Hạt Mầm · HM-018', 'Một đơn giả để Founder thử toàn bộ state transition theo thứ tự.', `
      <div class="detail-head"><div><p class="section-label">SYNTHETIC ORDER · PACKAGE SNAPSHOT V3</p><h2 style="margin:0;font-family:Georgia,serif;font-weight:400">HM-018 · Hạt Mầm</h2><p>Giao trước 08/08/2026 · cửa sổ revision đến 15/08/2026</p></div>${badge(data.hatmamStatus,statusTone(data.hatmamStatus))}</div>
      <section class="grid two"><article class="card"><h2>State truth</h2><div class="kv"><div class="muted">Payment</div><div>${esc(data.payment)}</div><div class="muted">Sản xuất</div><div>${esc(data.hatmamStatus)}</div><div class="muted">Delivery</div><div>${data.hatmamStatus === 'Sẵn sàng' ? 'Bị B4 chặn — Private Storage OFF' : 'Chưa đến bước giao'}</div><div class="muted">Revision deadline</div><div>15/08/2026</div></div></article>
      <article class="card"><h2>Thao tác workflow giả</h2><p class="small">Các nút chỉ chạy trong browser; trạng thái phải đi theo trình tự.</p><div class="button-set">${action('Mở payment','go-payment')} ${action('Bắt đầu sản xuất','start-production')} ${action('Chờ Kenji duyệt','queue-review')} ${action('Yêu cầu chỉnh sửa','request-revision')} ${action('Duyệt lại','approve-revision')} ${action('Đánh dấu sẵn sàng','mark-ready')}</div></article></section>
      <section class="card" style="margin-top:14px"><h2>Snapshot integrity</h2><div class="kv"><div class="muted">Tên package đã snapshot</div><div>Hạt Mầm</div><div class="muted">Giá đã snapshot</div><div>₫1.500.000</div><div class="muted">Delivery snapshot</div><div>5 business days</div><div class="muted">Retention snapshot</div><div>Raw intake 12 tháng · private room 24 tháng</div></div></section>`);
  }

  function renderProduction() {
    return page('Quy trình sản xuất', 'Một bản đồ thao tác để thấy thứ tự công việc, deadline và gate trước khi giao.', `<section class="card"><div class="production-step"><span class="step-number">1</span><div><strong>Payment evidence review</strong><p>Kenji kiểm tra đúng receipt giả với snapshot, reference và reported time.</p></div></div><div class="production-step"><span class="step-number">2</span><div><strong>Đang sản xuất</strong><p>Target: 5 business days theo snapshot của order.</p></div></div><div class="production-step"><span class="step-number">3</span><div><strong>Chờ Kenji duyệt</strong><p>Review bản thảo synthetic; có thể yêu cầu chỉnh sửa.</p></div></div><div class="production-step"><span class="step-number">4</span><div><strong>Revision window</strong><p>7 ngày theo snapshot, không bị sửa bởi cài đặt mới.</p></div></div><div class="production-step"><span class="step-number">5</span><div><strong>Ready nhưng delivery bị B4 chặn</strong><p>Không có public/private object thật cho đến khi Private Storage gate được đóng.</p></div></div></section><div class="button-set">${action('Mở đơn HM-018','go-hatmam-detail')} ${action('Review publication','go-publication')}</div>`);
  }

  function renderPublication() {
    return page('Xuất bản riêng tư', 'Publication synthetic — xem metadata và checksum, nhưng không upload, phát hành, hoặc xóa bất kỳ Storage object nào.', `
      <section class="grid two"><article class="card"><h2>Publication synthetic · PUB-013</h2><div class="kv"><div class="muted">Trạng thái</div><div>${badge(data.publication,statusTone(data.publication))}</div><div class="muted">Metadata</div><div>draft-hat-mam-013.pdf · synthetic only</div><div class="muted">Checksum</div><div><code>sha256: demo-7d13…c12a</code></div><div class="muted">Private Storage</div><div>${badge('CHƯA SẴN SÀNG','blocked')}</div></div><div class="button-set">${action('Yêu cầu chỉnh sửa','pub-revise')} ${action('Duyệt publication giả','pub-approve')} ${action('Thu hồi publication giả','pub-revoke','button-danger')}</div></article>
      <article class="card"><h2>Điều gì không xảy ra</h2><ul class="timeline"><li><time>Storage</time>Không upload object, không tạo signed URL.</li><li><time>Delivery</time>Không gửi email, không public activate.</li><li><time>Revoke</time>Chỉ đổi local state, không xóa object hoặc metadata thật.</li></ul><div class="callout fail">Delivery bị B4 chặn phù hợp: <strong>private_storage_ready=false</strong>.</div></article></section>
      <section class="card" style="margin-top:14px"><h2>Review và chỉnh sửa</h2><p class="small">Thử duyệt, yêu cầu chỉnh sửa, duyệt lại hoặc thu hồi để xem audit history synthetic thay đổi.</p></section>`);
  }

  function renderDeletion() {
    return page('Xóa dữ liệu & retention', 'Deletion preview — không xóa thật. Hard gate vẫn đóng: deletion_workflow_ready=false.', `
      <div class="notice"><strong>Thứ tự bắt buộc:</strong> object trước metadata. Nhưng demo này không gọi Storage, SQL hay endpoint xóa nào.</div>
      <section class="grid two"><article class="card"><h2>DEL-004 · yêu cầu giả</h2><div class="kv"><div class="muted">Trạng thái</div><div>${badge(data.deletion,statusTone(data.deletion))}</div><div class="muted">Raw child intake</div><div>Retention 12 tháng · synthetic preview</div><div class="muted">Private room/publication</div><div>Retention 24 tháng · synthetic preview</div><div class="muted">Early deletion</div><div>Được yêu cầu trong fixture</div></div><div class="button-set">${action('Xem affected records','deletion-preview')} ${action('Xác nhận thao tác giả','deletion-confirm')} ${action('Thử lại','deletion-retry')}</div></article>
      <article class="card"><h2>Execution order preview</h2><ol class="timeline"><li><time>Bước 1 · nếu gate mở</time>Xác minh private object list.</li><li><time>Bước 2 · nếu gate mở</time>Xóa object thành công trước.</li><li><time>Bước 3 · nếu gate mở</time>Chỉ sau đó xóa metadata/records.</li><li><time>Bước 4 · hiện tại</time>Ghi audit fail-closed, không làm gì thật.</li></ol></article></section>
      <div class="callout fail" style="margin-top:14px"><strong>FAIL-CLOSED:</strong> Storage và destructive SQL bị cấm trong demo. Retry chỉ tạo synthetic audit evidence.</div>`);
  }

  function renderSettings() {
    const v = data.settings;
    return page('Cài đặt versioned', 'Cài đặt demo có validation phía giao diện để review UX. Admin thật có validation server-side riêng.', `
      <section class="grid two"><article class="card"><h2>Phiên bản mới (giả)</h2><form id="settings-form"><div class="form-grid"><div class="field"><label for="price">Giá Hạt Mầm (VND)</label><input id="price" name="price" type="number" min="100000" value="${v.price}" /></div><div class="field"><label for="capacity">Capacity / tháng</label><input id="capacity" name="capacity" type="number" min="1" max="50" value="${v.capacity}" /></div><div class="field"><label for="delivery">Giao trong (business days)</label><input id="delivery" name="delivery" type="number" min="1" max="30" value="${v.delivery}" /></div><div class="field"><label for="revision">Revision window (days)</label><input id="revision" name="revision" type="number" min="1" max="30" value="${v.revision}" /></div><div class="field"><label for="retention">Raw intake retention (tháng)</label><input id="retention" name="retention" type="number" min="1" max="60" value="${v.retention}" /></div></div><div class="button-set"><button class="button" type="submit">Lưu phiên bản demo mới</button></div></form><p class="small">Release/provider flags tiếp tục khóa OFF và không có control nào để bật.</p></article>
      <article class="card"><h2>Snapshot cũ không đổi</h2><div class="callout"><strong>HM-018 đã snapshot</strong><br>Hạt Mầm · ₫1.500.000 · 5 business days · revision 7 ngày · raw intake 12 tháng.</div><p class="small">Dù tạo phiên bản demo mới, order đã tồn tại vẫn giữ các giá trị này.</p></article></section>
      <section class="card" style="margin-top:14px"><h2>Lịch sử phiên bản</h2><div class="table-wrap"><table class="table"><thead><tr><th>Version</th><th>Thời gian</th><th>Giá Hạt Mầm</th><th>Capacity</th><th>Trạng thái</th></tr></thead><tbody>${data.versions.map(vr=>`<tr><td>${vr.number}</td><td>${vr.time}</td><td>₫${Number(vr.price).toLocaleString('vi-VN')}</td><td>${vr.capacity}/tháng</td><td>${badge(vr.label || 'Lịch sử', vr.label ? 'ready' : '')}</td></tr>`).join('')}</tbody></table></div></section>`);
  }

  function renderAudit() {
    return page('Audit history', 'Lịch sử này là synthetic audit chỉ tồn tại trong browser hiện tại.', `<section class="card"><ul class="timeline">${data.audit.map(item=>`<li><time>${esc(item.time)}</time>${esc(item.text)}</li>`).join('')}</ul></section><p class="small">Không có event nào được gửi về database, analytics hoặc service provider.</p>`);
  }

  function renderReadiness() {
    return page('Readiness & release gates', 'Không gate nào bị gọi là pass. Đây là bảng review để thấy rõ hệ thống thật còn bị khóa.', `<section class="grid two"><article class="card"><h2>Release gates</h2><div class="readiness"><div class="readiness-row"><span>Private Storage / B4</span>${badge('OPEN — OFF','blocked')}</div><div class="readiness-row"><span>Deletion workflow thật</span>${badge('OPEN — OFF','blocked')}</div><div class="readiness-row"><span>Canonical Auth / AAL2</span>${badge('OPEN — chưa review thật','blocked')}</div><div class="readiness-row"><span>Security Advisor fresh result</span>${badge('OPEN','blocked')}</div><div class="readiness-row"><span>Resend provider</span>${badge('OFF','blocked')}</div><div class="readiness-row"><span>Cal.com provider</span>${badge('OFF','blocked')}</div><div class="readiness-row"><span>Public activation</span>${badge('OFF','blocked')}</div></div></article><article class="card"><h2>Demo boundary</h2><p class="small">Demo này không khép bất kỳ release gate nào. Nó được tạo duy nhất để Founder review UX, terminology, ưu tiên công việc và state truth trước khi Admin thật lên canonical domain.</p><div class="callout fail">Không có Supabase, API, provider, service-role, dữ liệu khách hay trẻ em thật trong deployment này.</div></article></section>`);
  }

  function renderContact() {
    return page('Liên hệ', 'Module này hiển thị vì nó là một khu vực của Admin hiện tại; demo không gửi tin nhắn.', `<section class="card"><h2>Hộp thư vận hành — dữ liệu giả</h2><p class="small">Không có email, số điện thoại hay liên hệ thật. Resend chưa kết nối nên không có nút gửi.</p><div class="action-list"><div class="action-row"><div><strong>MSG-009 · Synthetic question</strong><p>Cần Kenji đọc trước 16:00.</p></div>${badge('CHỜ XỬ LÝ','pending')}</div><div class="action-row"><div><strong>MSG-008 · Synthetic follow-up</strong><p>Đã ghi chú trong browser demo.</p></div>${badge('ĐÃ XEM','ready')}</div></div></section>`);
  }

  const renderers = { overview:renderOverview, lang:renderLang, 'lang-detail':renderLangDetail, payments:renderPayments, hatmam:renderHatmam, 'hatmam-detail':renderHatmamDetail, production:renderProduction, publication:renderPublication, deletion:renderDeletion, settings:renderSettings, audit:renderAudit, readiness:renderReadiness, contact:renderContact };
  function renderNav() { navigation.innerHTML = nav.map(([id,label]) => `<button class="nav-button ${data.view===id?'active':''}" data-view="${id}">${label}</button>`).join(''); }
  function render() { data.view = renderers[data.view] ? data.view : 'overview'; main.innerHTML = renderers[data.view](); renderNav(); location.hash = data.view; }
  function go(view) { data.view = view; save(); render(); document.getElementById('sidebar').classList.remove('open'); document.getElementById('mobile-menu').setAttribute('aria-expanded','false'); main.focus({preventScroll:true}); }
  function handleAction(id) {
    const updates = {
      'go-lang':()=>go('lang-detail'),'go-payment':()=>go('payments'),'go-deletion':()=>go('deletion'),'go-settings':()=>go('settings'),'go-hatmam-detail':()=>go('hatmam-detail'),'go-publication':()=>go('publication'),
      'lang-read':()=>{data.langStatus='Đang đọc';audit('Kenji bắt đầu đọc L-024 trong demo.');notice('Đã chuyển L-024 sang “Đang đọc” trong dữ liệu demo.');},
      'lang-fit':()=>{data.langStatus='Phù hợp — chờ thanh toán';data.langDecision='Phù hợp';audit('Kenji ghi quyết định “Phù hợp” cho L-024 trong demo.');notice('Đã ghi quyết định giả. Payment chỉ là bước demo tiếp theo.');},
      'lang-more':()=>{data.langStatus='Cần thêm thông tin';data.langDecision='Chờ thêm';audit('Kenji yêu cầu thêm thông tin cho L-024 trong demo.');notice('Đã chuyển sang “Cần thêm thông tin” trong dữ liệu demo.');},
      'lang-no':()=>{data.langStatus='Chưa phù hợp';data.langDecision='Chưa phù hợp';audit('Kenji ghi quyết định “Chưa phù hợp” cho L-024 trong demo.');notice('Đã lưu trạng thái giả; không gửi email.');},
      'fake-booking':()=>{audit('Đã thử phát link đặt lịch giả; Cal.com vẫn OFF.');notice('FAIL-CLOSED: Cal.com chưa kết nối, không có booking thật.');},
      'confirm-payment':()=>{data.payment='Đã xác nhận — synthetic';data.hatmamStatus='Đã thanh toán';audit('Kenji xác nhận biên nhận giả HM-018 sau khi các điều kiện demo đều khớp.');notice('Payment synthetic đã xác nhận; không có giao dịch thật.');},
      'start-production':()=>{if(!data.payment.toLowerCase().includes('xác nhận')){notice('Bị chặn: cần xác nhận payment evidence giả trước.');return;}data.hatmamStatus='Đang sản xuất';audit('HM-018 được chuyển sang “Đang sản xuất” trong demo.');notice('Đã bắt đầu sản xuất giả.');},
      'queue-review':()=>{if(data.hatmamStatus!=='Đang sản xuất'){notice('Bị chặn: cần bắt đầu sản xuất trước.');return;}data.hatmamStatus='Chờ Kenji duyệt';audit('HM-018 được đưa vào chờ Kenji duyệt trong demo.');notice('Đã chuyển vào hàng review giả.');},
      'request-revision':()=>{data.hatmamStatus='Cần chỉnh sửa';audit('Kenji yêu cầu chỉnh sửa HM-018 trong demo.');notice('Đã yêu cầu revision giả; revision deadline vẫn là 15/08/2026.');},
      'approve-revision':()=>{if(data.hatmamStatus!=='Cần chỉnh sửa'){notice('Bị chặn: chỉ duyệt lại sau trạng thái cần chỉnh sửa.');return;}data.hatmamStatus='Chờ Kenji duyệt';audit('Bản revision HM-018 được đưa lại vào review trong demo.');notice('Đã duyệt vòng chỉnh sửa giả.');},
      'mark-ready':()=>{if(data.hatmamStatus!=='Chờ Kenji duyệt'){notice('Bị chặn: đơn cần ở trạng thái chờ Kenji duyệt.');return;}data.hatmamStatus='Sẵn sàng';audit('HM-018 được đánh dấu sẵn sàng; delivery vẫn bị B4 chặn.');notice('Sẵn sàng trong demo — delivery bị B4/Private Storage OFF chặn.');},
      'pub-revise':()=>{data.publication='Cần chỉnh sửa';audit('Kenji yêu cầu chỉnh sửa publication synthetic PUB-013.');notice('Đã yêu cầu chỉnh sửa giả.');},
      'pub-approve':()=>{data.publication='Đã duyệt synthetic';audit('Kenji duyệt publication synthetic PUB-013.');notice('Đã duyệt giả; không upload hoặc phát hành object.');},
      'pub-revoke':()=>{data.publication='Đã thu hồi synthetic';audit('Kenji thu hồi publication synthetic PUB-013.');notice('Đã thu hồi giả; không xóa Storage object.');},
      'deletion-preview':()=>{audit('Đã mở affected-record preview của DEL-004 trong demo.');notice('Preview: 1 raw intake giả → 1 publication metadata giả. Object phải trước metadata.');},
      'deletion-confirm':()=>{data.deletion='FAIL-CLOSED — không xóa thật';audit('DEL-004 được xác nhận trong demo nhưng bị fail-closed an toàn.');notice('FAIL-CLOSED: không có Storage delete, SQL delete hoặc network request.');},
      'deletion-retry':()=>{data.deletion='Retry ghi nhận — vẫn fail-closed';audit('Đã thử lại DEL-004 trong demo; hard gate vẫn đóng.');notice('Retry synthetic đã được ghi; deletion_workflow_ready vẫn false.');}
    };
    if (updates[id]) { updates[id](); save(); render(); }
  }
  document.addEventListener('click', event => { const target = event.target.closest('[data-view],[data-action]'); if(!target)return; if(target.dataset.view)go(target.dataset.view); if(target.dataset.action)handleAction(target.dataset.action); });
  document.addEventListener('submit', event => { if(event.target.id !== 'settings-form')return; event.preventDefault(); const fd = new FormData(event.target); const next = Object.fromEntries(['price','capacity','delivery','revision','retention'].map(k=>[k,Number(fd.get(k))])); if(next.price < 100000 || next.capacity < 1 || next.capacity > 50 || next.delivery < 1 || next.revision < 1 || next.retention < 1){notice('Không thể lưu: kiểm tra lại range của cài đặt demo.');return;} data.settings=next; const number=Math.max(...data.versions.map(v=>v.number))+1; data.versions.unshift({number,time:now,label:'Phiên bản đang dùng',price:next.price,capacity:next.capacity});data.versions.forEach((v,i)=>{if(i>0)v.label='Lịch sử';});audit(`Đã lưu phiên bản cài đặt demo v${number}; snapshot cũ không thay đổi.`);save();notice(`Đã lưu phiên bản demo v${number}. HM-018 vẫn giữ snapshot v3.`);render(); });
  document.getElementById('reset-demo').addEventListener('click',()=>{data=clone(initial);save();render();notice('Đã đặt lại toàn bộ dữ liệu demo trong trình duyệt này.');});
  document.getElementById('mobile-menu').addEventListener('click',event=>{const side=document.getElementById('sidebar');const open=side.classList.toggle('open');event.currentTarget.setAttribute('aria-expanded',String(open));event.currentTarget.textContent=open?'Đóng menu':'Mở menu';});
  const hash = location.hash.slice(1); if(renderers[hash]) data.view=hash; render();
})();
