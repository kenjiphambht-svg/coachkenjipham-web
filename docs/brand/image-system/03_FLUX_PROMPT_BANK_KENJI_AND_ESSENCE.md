# 03_FLUX_PROMPT_BANK_KENJI_AND_ESSENCE.md
Đường dẫn repo: docs/brand/image-system/03_FLUX_PROMPT_BANK_KENJI_AND_ESSENCE.md
Model: FLUX.1 dev (local). LoRA: `kenji_face_lora (FLUX.1)` — chỉ bật cho ảnh có Kenji.

## 0. LoRA weight

Bắt đầu **0.65–0.85**. Mặt cứng/nhựa/AI → giảm 0.05–0.1; không giống Kenji → tăng nhẹ từng nấc. Không mặc định 1.0 (mặt "dán" vào ảnh, mất tự nhiên). Ghi weight của ảnh đạt vào inventory để tái lập.

## 1. Prompt framework (mọi prompt theo thứ tự này)

Subject → Setting → Light → Camera → Wardrobe → Composition → Mood → (Negative).

## 2. Negative prompt chung (dán cho MỌI lần generate)

```
brown studio lighting, sepia, amber-heavy color grade, coffee tone, warm brown gradient,
fake plastic skin, overly smooth skin, beauty filter, uncanny eyes, dead eyes, fake smile,
distorted hands, extra fingers, corporate stock photo, generic AI headshot, LinkedIn headshot,
spiritual guru, mystic aura, fantasy glow, candles, tarot, crystals, incense,
cheesy luxury, whiskey bar, cigar lounge, dark moody room, low-key dramatic portrait,
oversaturated, HDR, text, watermark, logo,
brown wood, dark wood, walnut, mahogany, coffee wood, warm brown desk,
overexposed, washed out, blown highlights, clinical white, sterile wellness stock
```

## 3. Mười nhóm prompt

### G1 — Homepage Kenji portrait (light-led) · 4:5 · LoRA 0.75
```
editorial portrait of a Vietnamese man in his 40s, calm confident presence, gentle closed-mouth smile,
seated on a black wooden chair against a warm ivory wall, soft window daylight from the left,
medium format photography look, 85mm, shallow depth of field, natural skin texture,
wearing an ivory linen shirt, minimalist composition with generous negative space above and beside,
quiet premium magazine aesthetic, bright airy atmosphere
```
Use: homepage section 2, OG. QA: mắt nhìn ống kính, nền ≥60% sáng. Không dùng khi: cần ảnh không khí (dùng G3).

### G2 — /ve-kenji editorial portrait · 3:2 · LoRA 0.75–0.8
```
environmental editorial portrait of a Vietnamese man in his 40s reading in a bright ivory study,
cream bookshelves, pale ash wood desk, morning window light, natural relaxed posture,
charcoal cotton shirt, 50mm documentary-style framing with wide negative space,
soft daylight color palette of white cream and black, one small gold book spine detail,
authentic skin texture, quiet contemplative mood, premium lifestyle magazine photography
```
Use: /ve-kenji, pillar hậu trường. QA: đồ vật nền không lỗi chữ. Không dùng: làm hero homepage (quá nhiều chi tiết).

### G3 — Essence atmosphere (không người) · 3:2 hoặc 1:1 · KHÔNG LoRA
```
minimalist still life in a bright ivory room, open blank notebook on a pale ash wood table,
cream ceramic cup, soft morning window light casting gentle shadows,
white and cream color palette with one black element, single thin gold line detail on notebook edge,
large negative space, quiet editorial photography, airy calm atmosphere, high key lighting
```
Use: chuyển nhịp section, social nền, /goc-doc. QA: không ngả beige đục. Không dùng: thay chân dung ở vị trí niềm tin.

### G4 — Hạt Mầm product mockup · 4:5 · KHÔNG LoRA
```
product photography of a small A5 booklet lying on a bright cream linen cloth,
soft daylight, cover design not readable, pages slightly fanned, one tiny gold ribbon detail,
white cream and black palette, gentle shadows, minimal premium editorial style, high key, airy
```
Use: landing, social bán. QA: chữ trên bìa phải KHÔNG đọc được (tránh chữ AI vô nghĩa) — bìa thật ghép sau nếu cần. Không dùng: giả trang ruột thật của khách.

### G5 — Parent reading (không rõ mặt trẻ) · 3:2 · KHÔNG LoRA
```
soft focus scene of a parent's hands holding an open small booklet in a bright cream living room,
a child's wooden toy and tiny shoes blurred in the background, no faces visible,
morning window light, white cream palette with one black frame detail on the wall,
tender quiet mood, editorial photography, large negative space, high key
```
Use: /ban-sac-cua-con, khối cảm xúc landing, pillar 1–3. QA ETHICAL bắt buộc: không mặt trẻ, không thể đọc thành case thật. Không dùng: mọi ngữ cảnh gợi ý "khách hàng của chúng tôi".

### G6 — Private reading room visual · 16:9 nhẹ · KHÔNG LoRA
```
extremely minimal still life, single open booklet page on cream fabric, soft diffused daylight,
almost monochrome ivory palette, one thin black line element, meditative stillness,
editorial photography, generous empty space
```
Use: đầu phòng đọc riêng, email giao. Không dùng: bất kỳ chỗ nào khác (giữ nó riêng cho nghi thức nhận ấn phẩm).

### G7 — Social/newsletter editorial · 1:1 và 4:5 · KHÔNG LoRA (hoặc G1/G2 tái crop)
```
clean editorial flat lay on ivory background, folded cream paper, black pen, soft daylight,
one small gold detail, two-thirds empty space reserved for text overlay,
white cream black palette, quiet premium aesthetic, high key
```
Use: nền quote/pillar. QA: vùng trống đủ đặt chữ đạt contrast. Không dùng: ảnh làm chữ khó đọc.

### G8 — /ve-essence institutional · 3:2 · LoRA 0.7
```
formal yet warm editorial portrait of a Vietnamese man in his 40s standing beside a bright window,
white wall, black chair accent, charcoal shirt, direct calm gaze, straight posture,
soft neutral daylight, restrained composition, documentary magazine style, natural skin texture
```
Use: /ve-essence, dossier đối tác. QA: điềm — không "CEO trên bìa Forbes". Không dùng: landing bán cho phụ huynh.

### G9 — Abstract texture/background · tỉ lệ theo nhu cầu · KHÔNG LoRA
```
abstract minimal texture of handmade ivory paper with subtle fiber detail, soft top light,
faint cream tonal variation, one hairline gold thread across the lower third,
high key, clean, no objects, calm negative space
```
Use: nền section, OG nền chữ. QA: không thành beige đục/nâu giấy cũ.

### G10 — Product mockup on desk (rộng hơn G4) · 16:9 · KHÔNG LoRA
```
wide product scene, small A5 booklet on a pale ash wood desk near a bright window,
cream curtain light, white ceramic cup, black notebook beside, one gold pencil detail,
cover text not readable, airy premium editorial photography, high key, large negative space
```
Use: hero landing (nếu cần ảnh), banner social. QA như G4.

## 3b. Wood rule (bắt buộc khi prompt có gỗ)

Gỗ là cửa sau lớn nhất để màu nâu lẻn vào ảnh. Nếu prompt có "wood", CHỈ dùng các cụm:
`pale ash wood` · `bleached wood` · `very light desaturated wood` · `light oak` (chỉ khi kết quả không đọc thành nâu — nheo mắt kiểm).
CẤM trong prompt dương: `brown wood`, `dark wood`, `walnut`, `mahogany`, `coffee wood`, `warm brown desk` (các cụm này đã nằm trong negative chung).
Nguyên tắc: gỗ là một CHẤT LIỆU sáng, không phải một MÀU nâu.

## 3c. Light-led ≠ overexposed (chống cháy sáng)

Sáng chủ đạo nhưng phải còn CHIỀU SÂU. Prompt nên giữ các neo: `soft shadow`, `natural skin texture`, `gentle contrast`. Ảnh FAIL khi: trắng lâm sàng (`clinical white`), stock wellness vô trùng (`sterile`), bệt sáng mất lớp (`washed out`, blown highlights). Test nhanh: ảnh sáng đúng vẫn có bóng mềm đọc được hình khối; ảnh cháy sáng nhìn như phòng khám. Đã thêm các từ này vào negative chung — không cần dán lại thủ công.

## 4. Cấm tuyệt đối trong prompt

Không viết prompt "cute child portrait", "happy client with child", "smiling family with coach", hay mọi biến thể tạo trẻ em rõ mặt / khách hàng giả / sự kiện giả. Không từ nâu ("brown", "sepia", "mocha", "coffee", "earthy") ở prompt dương — kể cả "để thử". Gỗ: theo Wood rule mục 3b.

## 5. Ghi chú vận hành

Mỗi lần generate: dán negative chung + negative riêng nhóm (nếu có); batch 8–20; ghi seed + weight của ảnh đạt vào inventory. Prompt mới nghĩ ra → thêm vào file này qua PR docs, không giữ trong đầu.
