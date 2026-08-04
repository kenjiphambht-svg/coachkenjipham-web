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
    leads: 24,
    ebook: { name: 'Ebook mẫu — chờ nội dung duyệt', status: 'Tạm dừng', route: 'Chưa có reading route thật', delivery: 'Email giao ebook v0 — dữ liệu giả' },
    assessment: { stage: 'Chưa bắt đầu', paid: false, result: null, sequence: 'Chưa bắt đầu' },
    settings: { price: 1500000, capacity: 10, delivery: 5, revision: 7, retention: 12 },
    versions: [{ number: 3, time: '02/08/2026, 16:10', label: 'Phiên bản đang dùng', price: 1500000, capacity: 10 }],
    assistantOpen: false,
    audit: [
      { time: '03/08/2026, 09:20', text: 'Hồ sơ Lặng giả L-024 được đưa vào hàng chờ Kenji.' },
      { time: '03/08/2026, 09:35', text: 'Biên nhận giả cho HM-018 đã được báo; cần Kenji review.' },
      { time: '02/08/2026, 16:10', text: 'Cài đặt phiên bản 3 được kích hoạt trong dữ liệu demo.' }
    ]
  };
  const nav = [
    ['overview', 'Tổng quan'], ['lang', 'Lặng'], ['hatmam', 'Hạt Mầm'],
    ['payments', 'Thanh toán'], ['data-publication', 'Dữ liệu & ấn phẩm'], ['system', 'Hệ thống']
  ];
  const main = document.getElementById('main');
  const navigation = document.getElementById('navigation');
  const toast = document.getElementById('toast');
  const assistantPanel = document.getElementById('assistant-panel');
  const searchInput = document.getElementById('demo-search');
  const searchResults = document.getElementById('search-results');
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
      <section class="grid two" style="margin-top:14px">
        <article class="card urgent"><h2>Việc cần Kenji xử lý</h2><div class="action-list">
          <div class="action-row"><div><strong>Đọc và quyết định · L-024</strong><p>${esc(data.langStatus)} · đã chờ 1 giờ 20 phút · hạn xử lý: quá 20 phút</p></div>${link('Mở hồ sơ', 'lang-detail')}</div>
          <div class="action-row"><div><strong>Kiểm tra biên nhận · HM-018</strong><p>${esc(data.payment)} · đã chờ 45 phút · hạn xử lý: trong 15 phút</p></div>${link('Kiểm tra biên nhận', 'payments')}</div>
          <div class="action-row"><div><strong>Duyệt bản thảo · HM-013</strong><p>${esc(data.publication)} · chờ từ hôm qua · hạn giao: 05/08/2026</p></div>${link('Mở ấn phẩm', 'publication')}</div>
        </div></article>
        <article class="card"><h2>Hạn và sức chứa</h2><div class="action-list">
          <div class="action-row"><div><strong>HM-011 quá hạn 1 ngày</strong><p>Target giao: 02/08/2026 · cần xử lý trước</p></div>${badge('QUÁ HẠN','blocked')}</div>
          <div class="action-row"><div><strong>Hạt Mầm tháng 08</strong><p>6/10 chỗ đã dùng · 4 chỗ còn lại</p></div>${badge('CÒN 4 CHỖ','ready')}</div>
          <div class="action-row"><div><strong>Hồ sơ Lặng</strong><p>9/10 suất tháng này · 1 suất còn lại</p></div>${badge('SẮP ĐẦY','pending')}</div>
        </div></article>
      </section>
      <section class="grid stats" style="margin-top:14px">
        ${stat('Hồ sơ Lặng mới', '2')}${stat('Chờ quyết định', data.langDecision ? '1' : '2')}${stat('Thanh toán chờ xác nhận', data.payment.toLowerCase().includes('xác nhận') ? '0' : '1')}${stat('Hạt Mầm đang sản xuất', data.hatmamStatus === 'Đang sản xuất' ? '2' : '1')}
        ${stat('Bản thảo chờ duyệt', data.publication === 'Chờ Kenji duyệt' ? '1' : '0')}${stat('Chỉnh sửa chờ xử lý', data.hatmamStatus === 'Cần chỉnh sửa' ? '1' : '0')}${stat('Yêu cầu xóa', data.deletion.includes('Mở') ? '1' : '0')}${stat('Việc quá SLA', '1')}
      </section>
      <section class="grid two" style="margin-top:14px">
        <article class="card"><h2>Mức sẵn sàng cần biết</h2><div class="readiness">
          <div class="readiness-row"><span>Cal.com</span>${badge('CHƯA KẾT NỐI','blocked')}</div><div class="readiness-row"><span>Resend</span>${badge('CHƯA KẾT NỐI','blocked')}</div><div class="readiness-row"><span>Lưu trữ riêng</span>${badge('CHƯA SẴN SÀNG','blocked')}</div><div class="readiness-row"><span>Kích hoạt công khai</span>${badge('OFF','blocked')}</div>
        </div></article>
        <article class="card"><h2>Tình trạng hệ thống</h2><div class="readiness"><div class="readiness-row"><span>Phiên bản demo</span>${badge('v1.1 · dữ liệu giả','ready')}</div><div class="readiness-row"><span>Deployment gần nhất</span>${badge('Preview branch','ready')}</div><div class="readiness-row"><span>Database / AI</span>${badge('KHÔNG KẾT NỐI','blocked')}</div><div class="readiness-row"><span>Backup</span>${badge('CHỈ MINH HỌA','pending')}</div></div><div class="button-set">${action('Xem hệ thống','go-system')} ${action('Hỏi Trợ lý','ask-assistant')}</div></article>
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
    return page('Thanh toán', 'Kiểm tra biên nhận demo — biên nhận giả chỉ gắn với đúng đơn giả HM-018.', `
      <div class="notice"><strong>Điều kiện xác nhận thanh toán (minh họa):</strong> chỉ khi đúng đơn, thời điểm báo chuyển, bằng chứng, request chưa thu hồi, số tiền và mã chuyển khoản khớp package snapshot thì nút xác nhận mới hiển thị.</div>
      <section class="grid two"><article class="card"><h2>Biên nhận giả · HM-018</h2><div class="kv"><div class="muted">Package snapshot</div><div>Hạt Mầm — phiên bản 3</div><div class="muted">Amount snapshot</div><div>₫1.500.000</div><div class="muted">Transfer reference</div><div>DEMO-HM-018</div><div class="muted">Evidence synthetic</div><div>${badge('ĐÃ ĐÍNH KÈM','ready')}</div><div class="muted">Reported transfer</div><div>03/08/2026, 09:35</div></div><div class="button-set">${action(data.payment.toLowerCase().includes('xác nhận') ? 'Đã xác nhận' : 'Xác nhận payment giả','confirm-payment', data.payment.toLowerCase().includes('xác nhận') ? 'button-quiet' : '')}</div></article>
      <article class="card"><h2>Kiểm tra atomically</h2><div class="readiness"><div class="readiness-row"><span>Đúng subject / order</span>${badge('PASS','ready')}</div><div class="readiness-row"><span>Evidence + reported time</span>${badge('PASS','ready')}</div><div class="readiness-row"><span>Request chưa revoked</span>${badge('PASS','ready')}</div><div class="readiness-row"><span>Amount + reference khớp snapshot</span>${badge('PASS','ready')}</div></div><p class="small">Đây là bằng chứng mô phỏng; không tạo receipt hay payment thật.</p></article></section>
      <section class="card" style="margin-top:14px"><h2>Không có receipt dùng chung</h2><p class="small">HM-017 bị chặn trong fixture vì reference không khớp. Giao diện không cho xác nhận dựa chỉ vào trạng thái “awaiting payment”.</p>${badge('BỊ CHẶN — REFERENCE KHÔNG KHỚP','blocked')}</section>`);
  }

  function renderHatmam() {
    return page('Hạt Mầm', 'Danh sách đơn dữ liệu giả. Giá và thời hạn của từng đơn được bảo toàn từ package snapshot.', `
      <div class="table-wrap"><table class="table"><thead><tr><th>Mã đơn</th><th>Trạng thái</th><th>Giao trước</th><th>Chỉnh sửa đến</th><th></th></tr></thead><tbody>
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
    return page('Cài đặt theo phiên bản', 'Cài đặt demo có validation phía giao diện để review UX. Admin thật có validation server-side riêng.', `
      <section class="grid two"><article class="card"><h2>Phiên bản mới (giả)</h2><form id="settings-form"><div class="form-grid"><div class="field"><label for="price">Giá Hạt Mầm (VND)</label><input id="price" name="price" type="number" min="100000" value="${v.price}" /></div><div class="field"><label for="capacity">Capacity / tháng</label><input id="capacity" name="capacity" type="number" min="1" max="50" value="${v.capacity}" /></div><div class="field"><label for="delivery">Giao trong (business days)</label><input id="delivery" name="delivery" type="number" min="1" max="30" value="${v.delivery}" /></div><div class="field"><label for="revision">Revision window (days)</label><input id="revision" name="revision" type="number" min="1" max="30" value="${v.revision}" /></div><div class="field"><label for="retention">Raw intake retention (tháng)</label><input id="retention" name="retention" type="number" min="1" max="60" value="${v.retention}" /></div></div><div class="button-set"><button class="button" type="submit">Lưu phiên bản demo mới</button></div></form><p class="small">Release/provider flags tiếp tục khóa OFF và không có control nào để bật.</p></article>
      <article class="card"><h2>Snapshot cũ không đổi</h2><div class="callout"><strong>HM-018 đã snapshot</strong><br>Hạt Mầm · ₫1.500.000 · 5 business days · revision 7 ngày · raw intake 12 tháng.</div><p class="small">Dù tạo phiên bản demo mới, order đã tồn tại vẫn giữ các giá trị này.</p></article></section>
      <section class="card" style="margin-top:14px"><h2>Lịch sử phiên bản</h2><div class="table-wrap"><table class="table"><thead><tr><th>Phiên bản</th><th>Thời gian</th><th>Giá Hạt Mầm</th><th>Sức chứa</th><th>Trạng thái</th></tr></thead><tbody>${data.versions.map(vr=>`<tr><td>${vr.number}</td><td>${vr.time}</td><td>₫${Number(vr.price).toLocaleString('vi-VN')}</td><td>${vr.capacity}/tháng</td><td>${badge(vr.label || 'Lịch sử', vr.label ? 'ready' : '')}</td></tr>`).join('')}</tbody></table></div></section>`);
  }

  function renderAudit() {
    return page('Lịch sử thao tác', 'Lịch sử này là dữ liệu giả, chỉ tồn tại trong trình duyệt hiện tại.', `<section class="card"><ul class="timeline">${data.audit.map(item=>`<li><time>${esc(item.time)}</time>${esc(item.text)}</li>`).join('')}</ul></section><p class="small">Không có event nào được gửi về database, analytics hoặc service provider.</p>`);
  }

  function renderReadiness() {
    return page('Mức sẵn sàng & gate phát hành', 'Không gate nào bị gọi là pass. Đây là bảng review để thấy rõ hệ thống thật còn bị khóa.', `<section class="grid two"><article class="card"><h2>Gate phát hành</h2><div class="readiness"><div class="readiness-row"><span>Lưu trữ riêng / B4</span>${badge('OPEN — OFF','blocked')}</div><div class="readiness-row"><span>Quy trình xóa thật</span>${badge('OPEN — OFF','blocked')}</div><div class="readiness-row"><span>Auth / AAL2</span>${badge('OPEN — chưa review thật','blocked')}</div><div class="readiness-row"><span>Security Advisor mới</span>${badge('OPEN','blocked')}</div><div class="readiness-row"><span>Resend</span>${badge('OFF','blocked')}</div><div class="readiness-row"><span>Cal.com</span>${badge('OFF','blocked')}</div><div class="readiness-row"><span>Kích hoạt công khai</span>${badge('OFF','blocked')}</div></div></article><article class="card"><h2>Ranh giới demo</h2><p class="small">Demo này không khép bất kỳ gate phát hành nào. Nó được tạo duy nhất để Founder review UX, thuật ngữ, ưu tiên công việc và trạng thái trước khi Admin thật lên canonical domain.</p><div class="callout fail">Không có Supabase, API, provider, service-role, dữ liệu khách hay trẻ em thật trong deployment này.</div></article></section>`);
  }

  function renderDataPublication() {
    return page('Dữ liệu & ấn phẩm', 'Dữ liệu cá nhân trẻ em — phạm vi vận hành hạn chế. Chỉ lưu kết luận cần thiết, không lưu toàn bộ câu chuyện.', `<section class="grid two"><article class="card"><h2>Dữ liệu và retention</h2><p class="small">Demo chỉ có fixture. Hệ thống thật giữ dữ liệu riêng, không công khai, có consent, retention, deletion, RLS và MFA/AAL2.</p><div class="button-set">${action('Xem deletion preview','go-deletion')} ${action('Xem lịch sử thao tác','go-audit')}</div></article><article class="card"><h2>Ấn phẩm riêng tư</h2><p class="small">Xem metadata/checksum synthetic. Lưu trữ riêng vẫn OFF nên không upload, phát hành hay xóa object thật.</p><div class="button-set">${action('Mở ấn phẩm','go-publication')}</div></article></section><section class="card" style="margin-top:14px"><h2>Không thu thập mặc định</h2><p class="small">Không địa chỉ đầy đủ, trường/lớp, giấy tờ, sức khỏe, chẩn đoán, biometrics, ảnh/video/audio, transcript đầy đủ hoặc chi tiết gia đình không cần cho sản phẩm.</p></section>`);
  }

  function renderSystem() {
    return page('Hệ thống', 'Trạng thái kỹ thuật được ghi đúng sự thật; demo không kết nối bất kỳ dịch vụ vận hành nào.', `<section class="grid two"><article class="card"><h2>Tình trạng hệ thống</h2><div class="readiness"><div class="readiness-row"><span>Database</span>${badge('KHÔNG KẾT NỐI','blocked')}</div><div class="readiness-row"><span>Lưu trữ riêng</span>${badge('OFF','blocked')}</div><div class="readiness-row"><span>Email / Lịch</span>${badge('OFF','blocked')}</div><div class="readiness-row"><span>AI</span>${badge('CHƯA KẾT NỐI','blocked')}</div><div class="readiness-row"><span>Backup</span>${badge('CHỈ MINH HỌA','pending')}</div><div class="readiness-row"><span>Gate công khai</span>${badge('OFF','blocked')}</div></div></article><article class="card"><h2>Quản trị demo</h2><p class="small">Các thay đổi chỉ nằm trong localStorage của trình duyệt hiện tại. Không có API, secret, provider hay dữ liệu thật.</p><div class="button-set">${action('Khách quan tâm & email','go-growth')} ${action('Cài đặt theo phiên bản','go-settings')} ${action('Mức sẵn sàng','go-readiness')} ${action('Liên hệ','go-contact')}</div></article></section>`);
  }

  function renderGrowth() {
    return page('Khách quan tâm & entry', 'Tất cả danh sách, email và chuyển đổi ở đây là dữ liệu giả; không có địa chỉ email thật.', `<section class="grid stats">${stat('Tổng khách quan tâm',data.leads)}${stat('Đã đồng ý nurture','18')}${stat('Đã dừng nhận tin','3')}${stat('Chuyển sang assessment','4')}</section><section class="grid two" style="margin-top:14px"><article class="card"><h2>Ebook</h2><p>${badge(data.ebook.status,statusTone(data.ebook.status))}</p><p class="small">${esc(data.ebook.name)} · ${esc(data.ebook.route)}</p><div class="button-set">${action('Cấu hình ebook','go-ebook')} ${action('Thử journey ebook','ebook-journey')}</div></article><article class="card"><h2>Bộ câu hỏi</h2><p>${badge('50.000 VND · DỮ LIỆU GIẢ','pending')}</p><p class="small">“Tôi đang ở đâu?” · version 0 · rules deterministic · không AI scoring.</p><div class="button-set">${action('Mở journey assessment','go-assessment')} ${action('Email chăm sóc','go-nurture')}</div></article></section><section class="card" style="margin-top:14px"><h2>Khách quan tâm — danh sách giả</h2><div class="table-wrap"><table class="table"><thead><tr><th>Mã lead</th><th>Nguồn ebook</th><th>Consent</th><th>Email gần nhất</th><th>Chuyển đổi</th><th>Trạng thái</th></tr></thead><tbody><tr><td>LEAD-024</td><td>Campaign mẫu</td><td>${badge('NURTURE ĐỒNG Ý','ready')}</td><td>Ebook delivery (giả)</td><td>Assessment</td><td>${badge('ĐANG NHẬN','pending')}</td></tr><tr><td>LEAD-021</td><td>Reading route mẫu</td><td>${badge('CHỈ EMAIL VẬN HÀNH','pending')}</td><td>Không có</td><td>—</td><td>${badge('KHÔNG NURTURE','blocked')}</td></tr><tr><td>LEAD-019</td><td>Campaign mẫu</td><td>${badge('ĐÃ HỦY ĐĂNG KÝ','blocked')}</td><td>Nurture #2 (giả)</td><td>Core offer</td><td>${badge('DỪNG','blocked')}</td></tr></tbody></table></div></section>`);
  }

  function renderEbook() {
    return page('Ebook', 'Cấu hình giả để duyệt UX. Không có asset, reading route, email capture hoặc gửi email thật.', `<section class="grid two"><article class="card"><h2>Cấu hình ebook giả</h2><form id="ebook-form"><div class="field"><label for="ebook-name">Tên ebook</label><input id="ebook-name" name="name" value="${esc(data.ebook.name)}" /></div><div class="field"><label for="ebook-route">Reading route</label><input id="ebook-route" name="route" value="${esc(data.ebook.route)}" /></div><div class="field"><label for="ebook-status">Trạng thái</label><select id="ebook-status" name="status"><option ${data.ebook.status==='Tạm dừng'?'selected':''}>Tạm dừng</option><option ${data.ebook.status==='Hoạt động giả'?'selected':''}>Hoạt động giả</option></select></div><div class="button-set"><button class="button" type="submit">Lưu cấu hình demo</button></div></form></article><article class="card"><h2>Journey ebook</h2><ol class="timeline"><li><time>1</time>Visitor giả nhập email.</li><li><time>2</time>Chỉ email vận hành được ghi nhận cho delivery.</li><li><time>3</time>Reading access và delivery email giả.</li><li><time>4</time>Nurture chỉ khi có consent marketing riêng.</li></ol><div class="button-set">${action('Chạy journey ebook giả','ebook-journey')} ${action('Email chăm sóc','go-nurture')}</div></article></section>`);
  }

  function renderAssessment() {
    const stage=data.assessment.stage; const steps=['Email entered','Questions answered','Result locked','Transfer reported','Payment confirmed','Result delivered']; const reached=Math.max(0,['Chưa bắt đầu',...steps].indexOf(stage));
    return page('Bộ câu hỏi — “Tôi đang ở đâu?”', 'Assessment synthetic: 50.000 VND, version 0, 6 câu hỏi mẫu. Đây không phải chẩn đoán, dự đoán hay quyết định điều kiện.', `<section class="grid two"><article class="card"><h2>Trạng thái journey</h2><div class="kv"><div class="muted">Giá hiện tại</div><div>50.000 VND</div><div class="muted">Payment requirement</div><div>Founder xác nhận thủ công</div><div class="muted">Trạng thái</div><div>${badge(stage,statusTone(stage))}</div><div class="muted">Email result</div><div>${esc(data.assessment.sequence)}</div></div><div class="button-set">${reached<1?action('Nhập email giả','assessment-email'):''}${reached===1?action('Trả lời 6 câu giả','assessment-answers'):''}${reached===2?action('Yêu cầu thanh toán 50.000 VND','assessment-request-payment'):''}${reached===3?action('Báo đã chuyển khoản giả','assessment-report-transfer'):''}${reached===4?action('Founder xác nhận payment giả','assessment-confirm-payment'):''}${reached===5?action('Tạo kết quả deterministic','assessment-generate'):''}</div></article><article class="card"><h2>Rule engine demo</h2><p class="small">Input fixture: điểm “nhịp hiện tại” = 4/6, “độ rõ bước tiếp” = 3/6. Rule v0: tổng 7–9 → nhóm <strong>Nhìn rõ bước tiếp theo</strong>.</p><p>${data.assessment.result?badge(data.assessment.result,'ready'):badge('KẾT QUẢ ĐANG KHÓA','blocked')}</p><p class="small">Cùng input + cùng version luôn ra cùng nhóm. AI không thể đổi điểm hoặc category; template/kết quả lịch sử không được viết lại.</p></article></section><section class="card" style="margin-top:14px"><h2>Version contract</h2><p class="small">Future contract: assessment_versions, question_versions, answers, scoring_dimensions, deterministic_result_rules, result_template_versions, assessment_orders, payment confirmation, generated_results và delivery events. Nội dung câu hỏi, rule và result email thực vẫn <strong>chờ Founder duyệt</strong>.</p></section>`);
  }

  function renderNurture() {
    return page('Email chăm sóc', 'Sequence synthetic theo phiên bản. Không gửi email, không kết nối Resend và không có address thật.', `<section class="table-wrap"><table class="table"><thead><tr><th>Sequence</th><th>Thứ tự / delay</th><th>Subject</th><th>Stop condition</th><th>Goal</th><th>Trạng thái</th></tr></thead><tbody><tr><td>Ebook delivery</td><td>#1 · ngay</td><td>Gửi ebook giả</td><td>Delivery complete</td><td>Reading access</td><td>${badge('TẠM DỪNG','blocked')}</td></tr><tr><td>Ebook nurture</td><td>#2 · +3 ngày</td><td>Một ghi chép phù hợp</td><td>Unsubscribe / conversion</td><td>Assessment</td><td>${badge('TẠM DỪNG','blocked')}</td></tr><tr><td>Assessment result</td><td>#1 · sau payment confirmed</td><td>Kết quả của bạn</td><td>Delivery complete</td><td>Result access</td><td>${badge('TẠM DỪNG','blocked')}</td></tr><tr><td>Assessment follow-up</td><td>#2 · +5 ngày</td><td>Một bước tiếp theo</td><td>Unsubscribe / conversion</td><td>Relevant offer</td><td>${badge('TẠM DỪNG','blocked')}</td></tr></tbody></table></section><div class="notice" style="margin-top:14px">Email vận hành để giao ebook/kết quả tách khỏi consent marketing. Không bắt buộc marketing consent để nhận kết quả đã mua.</div>`);
  }

  function renderContact() {
    return page('Liên hệ', 'Module này hiển thị vì nó là một khu vực của Admin hiện tại; demo không gửi tin nhắn.', `<section class="card"><h2>Hộp thư vận hành — dữ liệu giả</h2><p class="small">Không có email, số điện thoại hay liên hệ thật. Resend chưa kết nối nên không có nút gửi.</p><div class="action-list"><div class="action-row"><div><strong>MSG-009 · Synthetic question</strong><p>Cần Kenji đọc trước 16:00.</p></div>${badge('CHỜ XỬ LÝ','pending')}</div><div class="action-row"><div><strong>MSG-008 · Synthetic follow-up</strong><p>Đã ghi chú trong browser demo.</p></div>${badge('ĐÃ XEM','ready')}</div></div></section>`);
  }

  const renderers = { overview:renderOverview, lang:renderLang, 'lang-detail':renderLangDetail, payments:renderPayments, hatmam:renderHatmam, 'hatmam-detail':renderHatmamDetail, production:renderProduction, publication:renderPublication, deletion:renderDeletion, settings:renderSettings, audit:renderAudit, readiness:renderReadiness, contact:renderContact, 'data-publication':renderDataPublication, system:renderSystem, growth:renderGrowth, ebook:renderEbook, assessment:renderAssessment, nurture:renderNurture };
  function navView() { return ({'lang-detail':'lang','hatmam-detail':'hatmam',production:'hatmam',publication:'data-publication',deletion:'data-publication',audit:'data-publication',settings:'system',readiness:'system',contact:'system',growth:'system',ebook:'system',assessment:'system',nurture:'system'})[data.view] || data.view; }
  function renderNav() { const active=navView(); navigation.innerHTML = nav.map(([id,label]) => `<button class="nav-button ${active===id?'active':''}" data-view="${id}">${label}</button>`).join(''); }
  function renderAssistant() { assistantPanel.innerHTML = data.assistantOpen ? `<section class="assistant-card"><h2>Hỏi Trợ lý</h2><p>Tóm tắt theo quy tắc trên dữ liệu giả — chưa kết nối AI thật.</p><ul><li>L-024 đang quá SLA và cần Kenji quyết định.</li><li>HM-018 có biên nhận đang chờ kiểm tra.</li><li>HM-011 quá hạn 1 ngày.</li><li>Lưu trữ riêng, email, lịch và kích hoạt công khai đều đang OFF.</li></ul><div class="button-set">${action('Đóng','close-assistant')}</div></section>` : ''; }
  function render() { data.view = renderers[data.view] ? data.view : 'overview'; main.innerHTML = renderers[data.view](); renderNav(); renderAssistant(); location.hash = data.view; }
  function go(view) { data.view = view; save(); render(); document.getElementById('sidebar').classList.remove('open'); document.getElementById('mobile-menu').setAttribute('aria-expanded','false'); main.focus({preventScroll:true}); }
  function handleAction(id) {
    const updates = {
      'go-lang':()=>go('lang-detail'),'go-payment':()=>go('payments'),'go-deletion':()=>go('deletion'),'go-settings':()=>go('settings'),'go-hatmam-detail':()=>go('hatmam-detail'),'go-publication':()=>go('publication'),'go-audit':()=>go('audit'),'go-system':()=>go('system'),'go-readiness':()=>go('readiness'),'go-contact':()=>go('contact'),'go-growth':()=>go('growth'),'go-ebook':()=>go('ebook'),'go-assessment':()=>go('assessment'),'go-nurture':()=>go('nurture'),
      'ask-assistant':()=>{data.assistantOpen=true;notice('Trợ lý demo chỉ tóm tắt fixture trong trình duyệt.');},'close-assistant':()=>{data.assistantOpen=false;},
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
      ,'ebook-journey':()=>{data.leads+=1;audit('Lead synthetic đi qua ebook journey; không email nào được gửi.');notice('Journey ebook giả: visitor → email → reading access → delivery → nurture theo consent.');}
      ,'assessment-email':()=>{data.assessment.stage='Email entered';notice('Đã nhập email giả; chưa có result.');}
      ,'assessment-answers':()=>{data.assessment.stage='Questions answered';notice('Đã trả lời 6 câu giả; kết quả vẫn khóa trước payment.');}
      ,'assessment-request-payment':()=>{data.assessment.stage='Result locked';notice('Đã yêu cầu payment 50.000 VND giả; report không phải confirmation.');}
      ,'assessment-report-transfer':()=>{data.assessment.stage='Transfer reported';notice('Đã báo chuyển khoản giả; Founder vẫn phải xác nhận.');}
      ,'assessment-confirm-payment':()=>{data.assessment.stage='Payment confirmed';data.assessment.paid=true;notice('Founder đã xác nhận payment giả; giờ mới được tạo result.');}
      ,'assessment-generate':()=>{data.assessment.stage='Result delivered';data.assessment.result='Nhìn rõ bước tiếp theo · rule v0';data.assessment.sequence='Assessment result marked sent (giả) → nurture bắt đầu';audit('Assessment synthetic dùng deterministic rule v0 và đánh dấu result email giả là sent.');notice('Đã tạo kết quả deterministic và đánh dấu email giả là sent.');}
    };
    if (updates[id]) { updates[id](); save(); render(); }
  }
  document.addEventListener('click', event => { const target = event.target.closest('[data-view],[data-action]'); if(!target)return; if(target.dataset.view)go(target.dataset.view); if(target.dataset.action)handleAction(target.dataset.action); });
  document.addEventListener('submit', event => { if(event.target.id === 'ebook-form'){event.preventDefault();const fd=new FormData(event.target);data.ebook.name=String(fd.get('name')).trim()||data.ebook.name;data.ebook.route=String(fd.get('route')).trim()||data.ebook.route;data.ebook.status=String(fd.get('status'));audit('Đã lưu cấu hình ebook synthetic; không tạo route hoặc delivery thật.');save();notice('Đã lưu cấu hình ebook demo.');render();return;} if(event.target.id !== 'settings-form')return; event.preventDefault(); const fd = new FormData(event.target); const next = Object.fromEntries(['price','capacity','delivery','revision','retention'].map(k=>[k,Number(fd.get(k))])); if(next.price < 100000 || next.capacity < 1 || next.capacity > 50 || next.delivery < 1 || next.revision < 1 || next.retention < 1){notice('Không thể lưu: kiểm tra lại range của cài đặt demo.');return;} data.settings=next; const number=Math.max(...data.versions.map(v=>v.number))+1; data.versions.unshift({number,time:now,label:'Phiên bản đang dùng',price:next.price,capacity:next.capacity});data.versions.forEach((v,i)=>{if(i>0)v.label='Lịch sử';});audit(`Đã lưu phiên bản cài đặt demo v${number}; snapshot cũ không thay đổi.`);save();notice(`Đã lưu phiên bản demo v${number}. HM-018 vẫn giữ snapshot v3.`);render(); });
  document.getElementById('reset-demo').addEventListener('click',()=>{data=clone(initial);save();render();notice('Đã đặt lại toàn bộ dữ liệu demo trong trình duyệt này.');});
  document.getElementById('mobile-menu').addEventListener('click',event=>{const side=document.getElementById('sidebar');const open=side.classList.toggle('open');event.currentTarget.setAttribute('aria-expanded',String(open));event.currentTarget.textContent=open?'Đóng menu':'Mở menu';});
  const fixtures = [
    { text:'L-024 · hồ sơ Lặng · chờ Kenji quyết định', view:'lang-detail' },
    { text:'L-023 · hồ sơ Lặng · đang đọc', view:'lang' },
    { text:'HM-018 · Hạt Mầm · thanh toán chờ xác nhận', view:'payments' },
    { text:'HM-013 · ấn phẩm · chờ Kenji duyệt', view:'publication' },
    { text:'HM-011 · Hạt Mầm · quá hạn', view:'hatmam' },
    { text:'DEL-004 · deletion preview · fail-closed', view:'deletion' }
  ];
  searchInput.addEventListener('input', event=>{const query=event.target.value.trim().toLowerCase();if(!query){searchResults.innerHTML='';return;}const matches=fixtures.filter(item=>item.text.toLowerCase().includes(query)).slice(0,5);searchResults.innerHTML=matches.length?matches.map(item=>`<button class="search-result" data-view="${item.view}">${item.text}</button>`).join(''):'<div class="search-result">Không tìm thấy trong dữ liệu giả.</div>';});
  const hash = location.hash.slice(1); if(renderers[hash]) data.view=hash; render();
})();
