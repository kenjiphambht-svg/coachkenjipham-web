# 09_DESIGN_SYSTEM_HANDOFF_FOR_CODEX_CLAUDE_CODE.md
Đường dẫn repo: docs/brand/design-system/09_DESIGN_SYSTEM_HANDOFF_FOR_CODEX_CLAUDE_CODE.md

## 1. Đọc gì trước khi chạm giao diện

Bắt buộc, theo thứ tự: 00 (cách dùng bộ) → 03 (màu) → 04 (chữ) → 05 (layout) → 06 (component) → 08 (mục của trang đang làm). Kèm luật làm việc chung: docs/website/11 và AGENTS.md. Chưa đọc = chưa làm.

## 2. Codex task format khi sửa UI

```
BRANCH: feature/<tên>
ROUTE: <route đúng một trang / component>
SOURCE DOCS: docs/brand/design-system/03,04,05,06 + 08 mục <trang> (+ docs/website/<spec trang>)
FILES ALLOWED: <đường dẫn cụ thể>
FILES FORBIDDEN: token file (nếu task không phải task token), globals, route khác, public/brand/* (nếu không phải task asset)
DESIGN TOKENS: chỉ dùng token theo tên; cấm hex trần
COMPONENTS: chỉ biến thể có trong file 06
QA: checklist màu (03) + typography (04) + layout (05) + mục Cấm của trang (08) + build/lint
REPORT: phiếu 5 dòng + screenshot desktop/mobile + bảng contrast đo được
```

## 3. Claude Code audit format (khi kiểm UI)

1. **Kiểm token**: grep hex trần, font-family lạ, weight ≥600, radius/shadow ngoài mode.
2. **Kiểm contrast**: liệt kê cặp chữ/nền thực tế, tính tỉ lệ, đánh dấu fail.
3. **Kiểm layout**: spacing bội 4, max-width, radius theo mode, section một ý.
4. **Kiểm mobile**: 360px — tràn ngang, chữ chồng, vùng chạm <44px.
5. **Kiểm copy**: chạy script từ cấm (.claude/rules/) + soát giọng theo file 02 (mục 7–10).
6. **Kiểm asset**: file rác, tên có dấu, logo ngược nền, chữ ký sai chỗ (file 07).
Output: bảng phát hiện (vị trí — luật vi phạm — mức độ — đề xuất sửa), KHÔNG tự sửa nếu task chỉ là audit.

## 4. Không được (mọi agent)

Cài package UI mới khi chưa cần và chưa duyệt; đổi font/palette bừa; thêm shadow/radius/animation ngoài spec; thêm ảnh chưa duyệt (mọi ảnh người là quyết định của Kenji); sửa nhiều route trong một task; "tiện tay" chỉnh token khi đang làm task trang.

## 5. PR checklist (dán vào mô tả PR)

- [ ] Đúng scope/route khai báo; diff không chạm files forbidden.
- [ ] 0 hex trần; 0 font lạ; 0 weight ≥600.
- [ ] Bảng contrast đo kèm screenshot.
- [ ] Mobile 360px screenshot.
- [ ] Từ cấm scan = 0.
- [ ] Build + lint pass.
- [ ] Phiếu 5 dòng.

## 6. Report template

"1. Đã làm: … 2. Tự kiểm: token PASS / contrast PASS (bảng kèm) / mobile PASS / từ cấm 0. 3. Cần mắt Kenji: (≤3 điểm + link preview). 4. Rủi ro nếu duyệt sai: … 5. Đề xuất: …"

## 7. Năm prompt mẫu cho Codex

1. **Cập nhật tokens**: "Đọc 03,04. Branch feature/design-tokens. Scope: đưa CSS variables + Tailwind tokens vào hệ (file token + config), KHÔNG sửa trang nào. Xuất bảng map giá trị cũ→token. QA: build pass, 0 hex trần trong file token."
2. **Polish homepage**: "Đọc 03–06, 08 mục 1, docs/website/04. Branch feature/homepage-polish. Scope: homepage. Việc: thay hex trần bằng token, sửa contrast theo bảng audit, đưa chữ phụ về text-secondary-dark, đưa về một nút vàng. Không đổi cấu trúc section. QA + report chuẩn."
3. **Build landing Hạt Mầm**: "Đọc 03–06, 08 mục 5, docs/website/05. Branch feature/landing-hat-mam. Mode: Hạt Mầm warm. Copy từ bản đã duyệt tại [path]. Mockup dùng bản dummy. QA thêm: Child Safety (docs/website/13 nhóm 3)."
4. **Thêm logo/signature**: "Đọc 07. Branch feature/brand-assets. Scope: public/brand/* + header/footer. Copy có chọn lọc từ archive theo bảng mục 1 file 07, .gitignore rác, kiểm chiều nền từng bản, screenshot đối chiếu."
5. **Audit contrast**: "Đọc 03 mục 4. Branch audit/contrast (docs-only). Scope: xuất báo cáo mọi cặp chữ/nền toàn site + tỉ lệ + PASS/FAIL, không sửa. Report bảng đầy đủ."

## Definition of Done
Task UI bất kỳ chạy theo format này cho ra PR có đủ bằng chứng (bảng contrast, screenshot, scan từ cấm) để Kenji duyệt trong ≤10 phút mà không cần mở code.
