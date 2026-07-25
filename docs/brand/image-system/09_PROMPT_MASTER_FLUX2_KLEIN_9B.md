# ESSENCE LIGHTSCAPE  
## PROMPT MASTER V2 CHO FLUX.2 [klein] 9B + DRAW THINGS

**Phiên bản:** v2.0  
**Mục đích:** Một tài liệu duy nhất, dễ đọc, dễ làm theo, để anh tạo toàn bộ ảnh website Essence bằng cùng một ngôn ngữ hình ảnh.

---

# 1) CÂU CHỐT ĐỂ NHỚ

> **Nội thất tối giản, ánh sáng kể chuyện, chữ là nhân vật chính.**

Nghĩa là:

- Không dùng hình để khoe nội thất.
- Không dùng quá nhiều đồ vật.
- Không để background lấn át chữ.
- Không dùng màu nghệ thuật.
- Chỉ dùng ánh sáng tự nhiên, ánh đèn, vùng sáng tối trên tường và sàn để dẫn cảm xúc.

---

# 2) TINH THẦN HÌNH ẢNH CỦA ESSENCE

## Hình ảnh phải làm được điều gì?
Hình ảnh không cần trả lời:
> “Đây là căn phòng gì?”

Hình ảnh phải trả lời:
> “Đoạn này người đọc đang cảm thấy gì?”

Ví dụ:
- đầu trang: nén, yên, còn suy nghĩ
- giữa trang: bắt đầu thấy rõ hơn
- gần CTA: sáng dần, mở dần
- cuối trang: lắng, ấm, nhẹ, khép lại

## Vai trò của không gian
Không gian chỉ là **sân khấu yên**.

Được phép có:
- tường plaster màu ivory / cream
- sàn gỗ sáng hoặc đá sáng
- rất ít đồ vật
- bóng đổ mềm
- mảng sáng trên tường
- vệt sáng trên sàn
- quầng đèn nhẹ trong bóng tối

Không nên có:
- nhiều furniture
- decor kể chuyện
- màu xanh, đỏ, tím, hồng
- neon
- ánh sáng màu
- interior catalog look
- background quá bận làm nhiễu typography

---

# 3) BẢNG MÀU KHÓA

Chỉ dùng các sắc độ sau:

- **Ivory**
- **Cream**
- **Neutral warm white**
- **Soft daylight white**
- **Cool-neutral moonlight white**
- **Restrained warm-white lamp glow**
- **Soft grey shadow**
- **Deep charcoal natural shadow**

## Quy tắc cực quan trọng
- Tường trắng vẫn phải ra **trắng / ivory**, không ngả nâu.
- Ánh đèn phải **vàng-trắng nhẹ**, không cam.
- Ánh trăng phải **trắng lạnh nhẹ**, không xanh.
- Bóng tối phải sâu nhưng **vẫn còn chi tiết**.

---

# 4) MODEL ANH ĐANG DÙNG

## Model chính
**FLUX.2 [klein] 9B**

Đây là model anh đã chốt để dùng.

## Tư duy đúng khi dùng model này
- Đây là bản **distilled**
- Không cần chạy nhiều steps như các model cũ
- Prompt phải viết rõ và đầy đủ
- Không nên nhồi quá nhiều từ khóa rời rạc
- Nên mô tả cảnh như một **still frame điện ảnh**

---

# 5) SETUP DRAW THINGS — PRESET CHUẨN

## Thiết lập cơ bản

| Mục | Giá trị |
|---|---|
| Model | FLUX.2 [klein] 9B |
| Sampler | DDIM Trailing |
| Steps | 4 |
| Guidance Scale / CFG | 1.0 |
| Shift | 3.0 |
| Resolution-dependent Shift | OFF |
| Strength | 100% |
| Sharpness | 0 |
| Batch Size | 1 |
| Batch Count | 4 khi thử ý / 1 khi chốt seed |
| T5 Text Encoder | ON |
| Clip Skip | 2 |
| Speed Up with Guidance Embed | ON |
| Text Guidance / Guidance Embed | giữ mặc định nếu app có hiện |
| Hires Fix | OFF |
| TeaCache | OFF |
| Tiled Diffusion | OFF |
| Tiled Decoding | OFF |
| LoRA | OFF với ảnh không người |
| Negative Prompt | để trống |

## Cách nhớ ngắn gọn
> **4 bước, Guidance 1, Shift 3, không Negative Prompt.**

---

# 6) KÍCH THƯỚC ẢNH NÊN DÙNG

## Giai đoạn thử nhanh

### Ảnh desktop ngang
- **1344 × 768**  → 16:9

### Ảnh mobile dọc
- **896 × 1120** → 4:5

### Ảnh section ngang
- **1344 × 896** → 3:2

### Ảnh gần vuông
- **1280 × 1024** → 5:4

## Giai đoạn final

### Ảnh desktop ngang
- **1536 × 864**

### Ảnh mobile dọc
- **1024 × 1280**

### Ảnh section ngang
- **1536 × 1024**

### Ảnh gần vuông
- **1280 × 1024**

## Nếu máy bắt đầu nặng
Anh xử lý theo thứ tự này:

1. Giữ nguyên **Steps = 4**
2. Giữ nguyên **Guidance = 1**
3. Giảm **kích thước ảnh**
4. Chỉ bật Tiled Decoding nếu thật sự bí

**Không tăng steps để “cứu” ảnh.**

---

# 7) CÁCH VIẾT PROMPT ĐÚNG

Prompt phải đi theo trật tự này:

1. **Cảnh / trạng thái cảm xúc**
2. **Không gian tối giản**
3. **Nguồn sáng**
4. **Bề mặt nhận sáng**
5. **Bố cục dành cho chữ**
6. **Bảng màu bị giới hạn**
7. **Chất ảnh điện ảnh**

## Đừng viết kiểu này
- minimal room
- luxury
- light
- shadow
- editorial
- cinematic

Đây là kiểu quá rời rạc.

## Nên viết kiểu này
Mô tả như một cảnh phim tĩnh:

> Một không gian tối giản gần như trống.  
> Ánh sáng ban mai đi từ trái sang phải, chạm lên mảng tường và sàn.  
> Phần lớn khung hình vẫn yên và ít chi tiết để dành chỗ cho typography.

---

# 8) PROMPT MASTER V2 — BẢN CHÍNH THỨC

Anh copy khối này để dùng làm khung chung cho mọi ảnh:

```text
A cinematic architectural editorial photograph in which light is the primary subject.

[SCENE — Describe the emotional state and the simple spatial situation in 1–3 complete sentences.]

The setting is an extremely minimal, nearly empty interior made only of quiet architectural planes: a softly textured ivory plaster wall, a pale ash wood floor or light natural stone floor, and generous uninterrupted surfaces. The room functions only as a silent stage for light and shadow. The visual attention rests on luminous shapes, tonal transitions, soft shadow edges, and the meeting point between illumination and darkness.

[LIGHT — Choose one approved light module: Morning Daylight / Warm Interior Lamp / Moonlight Night / Lamp + Moonlight Night / Daylight + Lamp.]

[COMPOSITION — State where the quiet negative space must remain for website typography, where the brighter area appears, and how the eye should move through the frame.]

The palette is strictly limited to ivory, cream, neutral warm white, soft daylight white, restrained warm-white lamp glow, cool-neutral moonlight white, soft grey shadow, and deep charcoal natural shadow. Color response remains clean and neutral, with white walls staying white or ivory rather than beige, orange, brown, sepia, or blue.

Night scenes must remain natural and restrained. Moonlight should appear as cool-neutral white rather than blue, and interior lamp light should remain pale warm-white rather than orange, amber, or sepia.

The image feels quiet, restrained, intimate, spacious, emotionally precise, and timeless. Typography remains the visual protagonist, so the composition contains a large calm area with low detail and controlled contrast.

Captured as a quiet 35mm cinematic film still with realistic architectural light behavior, a natural 35mm lens perspective, deep focus at f/8, controlled highlight roll-off, visible detail inside the shadows, soft restrained chiaroscuro, very subtle volumetric atmosphere, natural fine film grain, refined rule-of-thirds composition, photorealistic materials, understated editorial luxury, and no glossy rendered appearance.
```

---

# 9) 5 LIGHT MODULES — BỘ NGUỒN SÁNG CHUẨN

## A. Morning Daylight — ánh nắng ban mai

```text
Soft natural morning daylight enters strictly from the LEFT and travels gently across the plaster wall toward the RIGHT, then falls onto the floor. The daylight is clean and neutral, approximately 5000–5600K, producing broad soft-edged shadows and a gradual transition from illuminated ivory to quiet charcoal shadow.
```

**Dùng khi:**
- mở đầu sáng dần
- bắt đầu nhìn thấy rõ hơn
- tinh thần mở ra, nhưng vẫn yên

---

## B. Warm Interior Lamp — ánh đèn vàng-trắng ấm

```text
A single restrained warm-white interior lamp, approximately 2700–3000K, casts a soft pool of light onto part of the ivory plaster wall and floor. The lamp itself is outside the frame or visually secondary. The light remains pale, natural, and controlled, creating warmth without an orange, amber, brown, or sepia cast. Surrounding darkness stays soft and detailed rather than crushed black.
```

**Dùng khi:**
- cần cảm giác gần, ấm, lắng
- section đêm
- cảm giác hiện diện, ngồi xuống, đối diện

---

## C. Moonlight Night — ánh trăng ban đêm

```text
Soft moonlight enters quietly from the LEFT or from an off-screen opening and touches only part of the ivory plaster wall and floor. The moonlight is cool-neutral rather than blue, approximately 4100–4600K, creating a faint silvery-white illumination with broad soft-edged shadows and a deep calm darkness around it. The effect is subtle, quiet, and natural, with no dramatic blue cast and no theatrical night effect.
```

**Dùng khi:**
- cần cảm giác thức khuya, suy nghĩ, yên
- scene tĩnh, nội tâm, không bi lụy
- Hero đêm hoặc khoảng nghỉ sâu

---

## D. Lamp + Moonlight Night — đèn + ánh trăng

```text
A quiet night interior where soft moonlight provides the main spatial atmosphere while one restrained warm-white lamp glow appears in a smaller secondary area. The moonlight remains dominant and cool-neutral, touching the wall and floor with a silvery softness, while the lamp adds a subtle warm counterpoint. The contrast between the two light sources is gentle, natural, and emotionally precise, without any colored lighting or exaggerated cinematic effect.
```

**Dùng khi:**
- cần tối sâu nhưng vẫn có hơi ấm con người
- transition cảm xúc rất đẹp
- section opening hoặc closing

---

## E. Daylight + Lamp — ánh ngày pha đèn

```text
Clean soft daylight from the LEFT establishes the main spatial light, while one restrained warm-white lamp glow appears quietly in a smaller area of the frame. Daylight remains dominant. The two sources create a subtle natural temperature contrast without introducing any colored lighting.
```

**Dùng khi:**
- giữa trang
- bắt đầu rõ dần nhưng chưa quá sáng
- trạng thái đang mở nhưng vẫn sâu

---

# 10) TEMPLATE ĐIỀN NHANH MỖI KHI TẠO ẢNH

Trước khi viết prompt, anh chỉ cần trả lời 5 câu này:

## 1. SCENE
Đoạn này người đọc đang ở trạng thái nào?
- nén
- yên
- lắng
- rõ dần
- mở dần
- khép lại

## 2. LIGHT
Dùng ánh sáng gì?
- Morning Daylight
- Warm Interior Lamp
- Moonlight Night
- Lamp + Moonlight Night
- Daylight + Lamp

## 3. SURFACES
Bề mặt nào nhận sáng?
- tường ivory plaster
- sàn gỗ sáng
- sàn đá sáng

## 4. COMPOSITION
Chữ sẽ nằm ở đâu?
- bên trái
- bên phải
- giữa
- vùng tối
- vùng sáng nhẹ

## 5. EMOTIONAL RESULT
Ảnh sau cùng phải cho cảm giác gì?
- quiet
- inward
- attentive
- opening
- resolved
- warm
- calm

---

# 11) VÍ DỤ HOÀN CHỈNH

## Ví dụ 1 — Hero đêm có ánh trăng rất nhẹ

```text
A cinematic architectural editorial photograph in which light is the primary subject.

A nearly empty interior late at night, deeply quiet and emotionally inward. Most of the frame remains in calm darkness while a very soft moonlight begins to touch part of an ivory plaster wall and a small section of the pale floor. The scene feels like someone is still awake in thought, but the room remains still and restrained.

The setting is an extremely minimal, nearly empty interior made only of quiet architectural planes: a softly textured ivory plaster wall, a pale ash wood floor, and generous uninterrupted surfaces. The room functions only as a silent stage for light and shadow. The visual attention rests on luminous shapes, tonal transitions, soft shadow edges, and the meeting point between illumination and darkness.

Soft moonlight enters quietly from the LEFT and touches only part of the ivory plaster wall and floor. The moonlight is cool-neutral rather than blue, approximately 4100–4600K, creating a faint silvery-white illumination with broad soft-edged shadows and a deep calm darkness around it.

Preserve a large low-detail dark area in the left-center portion of the frame for website typography. Keep the brighter area away from the text area and let the eye move slowly from darkness toward the moonlit surfaces.

The palette is strictly limited to ivory, cream, cool-neutral moonlight white, soft grey shadow, and deep charcoal natural shadow. Night scenes must remain natural and restrained, with no blue cast.

The image feels quiet, restrained, intimate, spacious, emotionally precise, and timeless. Typography remains the visual protagonist, so the composition contains a large calm area with low detail and controlled contrast.

Captured as a quiet 35mm cinematic film still with realistic architectural light behavior, a natural 35mm lens perspective, deep focus at f/8, controlled highlight roll-off, visible detail inside the shadows, soft restrained chiaroscuro, very subtle volumetric atmosphere, natural fine film grain, refined rule-of-thirds composition, photorealistic materials, understated editorial luxury, and no glossy rendered appearance.
```

---

## Ví dụ 2 — Đêm có đèn và ánh trăng

```text
A cinematic architectural editorial photograph in which light is the primary subject.

A very minimal night interior with a calm emotional tension between cool moonlight and a small warm lamp glow. Most of the space remains quiet and dark. Moonlight establishes the main atmosphere on the wall and floor, while a restrained lamp glow adds a small human warmth in another part of the frame.

The setting is an extremely minimal, nearly empty interior made only of quiet architectural planes: a softly textured ivory plaster wall, a pale ash wood floor, and generous uninterrupted surfaces. The room functions only as a silent stage for light and shadow. The visual attention rests on luminous shapes, tonal transitions, soft shadow edges, and the meeting point between illumination and darkness.

A quiet night interior where soft moonlight provides the main spatial atmosphere while one restrained warm-white lamp glow appears in a smaller secondary area. The moonlight remains dominant and cool-neutral, touching the wall and floor with a silvery softness, while the lamp adds a subtle warm counterpoint. The contrast between the two light sources is gentle, natural, and emotionally precise, without any colored lighting or exaggerated cinematic effect.

Leave broad quiet negative space for typography, with low detail and controlled contrast.

The palette is strictly limited to ivory, cream, cool-neutral moonlight white, restrained warm-white lamp glow, soft grey shadow, and deep charcoal natural shadow.

Captured as a quiet 35mm cinematic film still with realistic architectural light behavior, controlled highlight roll-off, detailed shadows, subtle volumetric atmosphere, fine natural film grain, and understated editorial luxury.
```

---

# 12) CÁCH GENERATE THÔNG MINH

## Vòng 1 — khám phá
- Batch Size = 1
- Batch Count = 4
- Seed random
- Generate 8–12 ảnh cho 1 cảnh

## Vòng 2 — chọn
Chọn ảnh tốt nhất dựa trên:
- mảng sáng đẹp
- bóng tối có chiều sâu
- có chỗ cho chữ
- không bị ngả nâu / cam / xanh
- không giống ảnh catalog

## Vòng 3 — tinh chỉnh
Khóa seed ảnh tốt nhất.

Mỗi lần chỉ sửa **1 yếu tố**:
- hướng sáng
- độ rộng vùng sáng
- vị trí vùng tối
- khoảng chữ
- nhiệt độ đèn

**Không sửa mọi thứ cùng lúc.**

## Vòng 4 — final
- Generate ở kích thước final
- lưu PNG master
- xuất WebP cho website

---

# 13) CÁCH ĐẶT TÊN FILE

## File gốc
```text
[slot]-[scene]-[desktop|mobile]-v01-master.png
```

## File web
```text
[slot]-[scene]-[desktop|mobile]-v01.webp
```

Ví dụ:
```text
01-hero-before-dawn-desktop-v01-master.png
01-hero-before-dawn-desktop-v01.webp
```

---

# 14) CHECKLIST DUYỆT ẢNH

Ảnh đạt khi:

- ánh sáng là thứ nhìn thấy đầu tiên
- nội thất chỉ là nền
- bảng màu đúng chuẩn
- vùng tối còn chi tiết
- vùng sáng không cháy
- không ngả nâu / cam / xanh sai ý
- có khoảng yên cho chữ
- không giống CGI bóng nhẵn
- không giống catalog nội thất
- có cảm xúc rõ
- đứng chung bộ được với các ảnh khác

---

# 15) NHỮNG LỖI ANH CẦN TRÁNH

## Lỗi 1 — quá nhiều đồ vật
Nếu ảnh có quá nhiều đồ đạc, nó đã sai tinh thần.

## Lỗi 2 — ánh đèn quá cam
Nếu đèn lên màu amber / orange rõ, phải chỉnh lại prompt.

## Lỗi 3 — ánh trăng quá xanh
Nếu moonlight ra xanh phim quá mức, phải nhấn lại:
> cool-neutral rather than blue

## Lỗi 4 — tường ngả nâu
Nếu tường trắng ra beige đậm hoặc brownish, phải siết lại palette.

## Lỗi 5 — không có chỗ cho chữ
Nếu khung hình đẹp nhưng không còn khoảng yên cho typography, ảnh đó không dùng được cho website.

---

# 16) CÂU NHỚ CUỐI CÙNG

> **Essence Lightscape = nội thất tối giản, ánh sáng kể chuyện, chữ là nhân vật chính.**

Mỗi lần tạo ảnh, anh chỉ cần tự hỏi:

1. Ảnh này đang kể cảm xúc gì?
2. Ánh sáng có đang là chủ thể chính không?
3. Chữ có còn là nhân vật chính không?

Nếu 3 câu này đều “có”, anh đang đi đúng hướng.
