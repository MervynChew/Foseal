# 🥔 Potato Quality Knowledge Base for RAG System

## 📊 Overview

This knowledge base outlines how key **preharvest** and **storage** metrics influence the final **quality, appearance, taste, and shelf life** of potatoes. It supports a scoring system that evaluates each potato batch across several consumer-relevant characteristics.

---

## 🌱 Preharvest Metrics and Impact

| Metric              | Ideal Range                    | Deviations & Impact                                                                 |
|---------------------|--------------------------------|--------------------------------------------------------------------------------------|
| **Soil Moisture**   | 60–80% field capacity          | <60%: stunted growth, scab risk, shriveling; >80%: rot, cracks, black heart         |
| **Air Temperature** | 18–25°C                        | <14°C: delayed emergence; >26°C: poor yield and quality                              |
| **Air Humidity**    | 50–80%                         | <50%: desiccation; >85%: fungal/bacterial disease risks                              |
| **Soil pH**         | 4.8–6.5                        | <4.8: nutrient lockout, toxicity; >7.0: common scab risk                             |
| **Nitrogen (N)**    | 15–20 kg/ha (sprout dev)       | Deficiency: stunted growth, pale leaves; Excess: excessive foliage, poor tuber size |
| **Phosphorus (P)**  | 10–15 kg/ha (sprout dev)       | Deficiency: delayed maturity, poor root/tuber growth                                |
| **Potassium (K)**   | 15–20 kg/ha (sprout dev)       | Deficiency: bruising, black spots, poor skin                                         |

---

## 🧊 Storage Metrics and Impact

| Metric                 | Ideal Range                    | Deviations & Impact                                                                     |
|------------------------|--------------------------------|------------------------------------------------------------------------------------------|
| **Storage Temp.**      | 4–10°C                         | <4°C: excessive sweetness (sugar accumulation); >10°C: sprouting and spoilage           |
| **Storage Humidity**   | 90–95%                         | <90%: tuber shrinkage; >95%: rot and mold risks                                         |
| **Ventilation (Airflow)** | Moderate to High             | Poor airflow: CO₂ buildup, promotes rot; Good airflow: maintains firmness               |
| **Light Exposure**     | Minimal                        | Exposure causes greening (solanine), bitterness, and toxicity                           |
| **Storage Duration**    | Up to 6 months (under ideal conditions) | Beyond 6 months: increased risk of sprouting, nutrient loss, texture and flavor degradation |


---

## 🍽️ Potato Characteristics Mapped to Metrics

| Characteristic      | Influenced By                                                                 |
|---------------------|--------------------------------------------------------------------------------|
| **Shelf Life**       | Storage temp & humidity, maturity, preharvest stress                          |
| **Freshness**        | Storage temp/humidity, harvest moisture, time since harvest                   |
| **Skin Quality**     | Soil pH, potassium, disease control, uniform watering                         |
| **Sweetness**        | Cold storage (<4°C), nutrient stress, early harvesting                        |
| **Texture**          | Potassium, phosphorus, soil moisture fluctuations                             |
| **Appearance**       | Soil pH, temp stress, irrigation, nutrient balance, postharvest handling      |
| **Nutritional Value**| NPK balance, soil pH, early vigor                                             |

---

## 🧮 Scoring System Framework

Score each batch based on metrics received. Normalize each characteristic to a 0–100 scale and weight them by importance.

### Suggested Weights

| Characteristic     | Weight (%) |
|--------------------|------------|
| Shelf Life         | 25         |
| Freshness          | 20         |
| Skin Quality       | 15         |
| Sweetness          | 10         |
| Texture            | 10         |
| Appearance         | 10         |
| Nutritional Value  | 10         |

### Scoring Rules for Potato Quality Characteristics with Ideal Metric Values

---

#### Shelf Life
- **90–100:**  
  Storage temperature **4–8°C**, relative humidity **90–95%**, curing period of **10–14 days** at ~15°C and high RH, no preharvest moisture stress (soil moisture **60–80%**), and minimal ethylene exposure.
- **70–89:**  
  Storage temp between **8–10°C** or RH slightly outside ideal range (85–90% or 95–98%), minor preharvest moisture deviations (soil moisture 55–60% or 80–85%).
- **50–69:**  
  Storage temp above **10°C**, missing curing, or high preharvest moisture (>85% soil moisture), or storage longer than **2 months** with minor deviations.
- **<50:**  
  Storage temp below **4°C** causing damage, poor curing or no curing, storage temp above **12°C**, or severe preharvest stress (soil moisture <50% or >90%), storage longer than **3 months** without controls.

---

#### Sweetness
- **85+:**  
  Stored at temperatures **below 4°C** consistently, which causes starch to sugar conversion (cold sweetening).
- **70–84:**  
  Storage temp close to 4°C with occasional fluctuations or moderate preharvest nutrient stress (e.g., nitrogen >20 kg/ha).
- **60 or less:**  
  Stored above **10°C**, or exposed to heat stress during growth (>26°C), or overripe tubers harvested late.

---

#### Freshness
- **90+:**  
  Harvested recently (<2 weeks), stored at **4–10°C**, RH **90–95%**, and low mechanical damage.
- **70–89:**  
  Stored up to 1 month under ideal conditions, or minor RH fluctuations (85–90%), or slight surface dehydration.
- **50 or below:**  
  Stored longer than **2 months** at temp >10°C or low RH (<85%), signs of surface wrinkling or fungal infections.

---

#### Skin Quality
- **90–100:**  
  Soil pH between **4.8–6.5**, potassium levels **15–20 kg/ha**, calcium **100–150 kg/ha**, uniform irrigation (no fluctuation >10%), no disease/scab, curing done.
- **70–89:**  
  Soil pH slightly outside ideal range (4.5–4.8 or 6.5–7.0), potassium between 12–15 kg/ha, minor scab or bruising, mild irrigation irregularities.
- **50–69:**  
  Soil pH <4.5 or >7.0, potassium <12 kg/ha, visible scab or bruises, inconsistent watering.
- **<50:**  
  Severe nutrient deficiencies, cracked or rough skin, frequent scab, poor curing or high disease incidence.

---

#### Texture
- **90–100:**  
  Potassium **15–20 kg/ha**, phosphorus **10–15 kg/ha**, calcium adequate, soil moisture steady **60–80%**, mature tubers harvested timely.
- **70–89:**  
  Slight nutrient deviations (K or P 12–15 kg/ha), moderate moisture fluctuations (50–60% or 80–85%).
- **50–69:**  
  Nutrient deficiency or excess (K or P <12 or >20), severe moisture swings, immature or overripe tubers.
- **<50:**  
  Severe nutrient stress, prolonged drought or waterlogging, or poor harvesting timing.

---

#### Appearance
- **90–100:**  
  Minimal light exposure (<1 hour/day), no bruising or greening, soil pH 4.8–6.5, no scab or blemishes.
- **70–89:**  
  Light exposure 1–5 hours/day, minor bruises or discoloration, minor scab.
- **50–69:**  
  Moderate greening or bruising, scab spots visible, some mechanical damage.
- **<50:**  
  Heavy greening (solanine >20 mg/100g), extensive bruising, heavy scab, poor handling.

---

#### Nutritional Value
- **90–100:**  
  Balanced NPK (N 15–20, P 10–15, K 15–20 kg/ha), soil pH 4.8–6.5, harvested at optimal maturity, minimal storage time (<2 weeks).
- **70–89:**  
  Mild nutrient imbalance, delayed harvest (up to 1 month), minor storage effects.
- **50–69:**  
  Nutrient deficiencies (below minimum kg/ha), late harvest (>1 month), prolonged storage (>2 months).
- **<50:**  
  Severe nutrient deficiency, overripe or stressed tubers, storage >3 months with high temp or low humidity.

---


## 🛒 FAQs for Consumers

### ❓ How long can a potato last?
- **Optimally grown & stored potatoes** last up to **2–4 months** at 4–10°C with 90–95% RH.
- Poor preharvest conditions or improper storage can reduce shelf life to **2–4 weeks**.

### ❓ Why is my potato sweet?
- Cold storage below 4°C triggers **starch-to-sugar conversion** (cold sweetening).
- Can occur due to over-chilling during storage or stress before harvest.

### ❓ What causes green spots or sprouting?
- **Light exposure** during storage → greening (solanine buildup).
- **Warm temperatures or high humidity** → early sprouting.

### ❓ Why do some potatoes bruise easily?
- **Low potassium**, poor skin set, or rough handling increases bruising risk.

# Potato Knowledge Base

## Storage

### How should potatoes be stored?
Potatoes should be stored in a cool, dark, and well-ventilated area. Ideal storage temperature is between 4°C and 10°C with 90–95% relative humidity.

### Can potatoes be stored in the fridge?
Storing potatoes in a fridge (<4°C) can cause starches to convert to sugar, making them excessively sweet and leading to dark browning when cooked.

### How long can potatoes be stored after harvest?
Under ideal conditions, potatoes can be stored for up to 6 months. After that, they may sprout, lose nutrients, and develop poor flavor and texture.

### What happens if potatoes are exposed to light?
They turn green and produce solanine, a toxic compound that can cause bitterness and health issues when consumed in large amounts.

---

## Sprouting

### Why do potatoes sprout?
Potatoes sprout due to age or warm storage conditions. Temperatures above 10°C accelerate sprouting.

### Are sprouted potatoes safe to eat?
Cutting off the sprouts and any green areas is usually safe, but heavily sprouted or soft potatoes should be discarded.

---

## Planting & Growth

### When is the best time to plant potatoes?
Potatoes are best planted in early spring, about 2–4 weeks before the last expected frost.

### How long does it take for potatoes to grow?
Typically 70 to 120 days, depending on the variety and climate.

### What soil is best for growing potatoes?
Loamy, well-drained soil with pH between 5.0 and 6.5. Avoid overly compact or waterlogged soil.

---

## Watering & Fertilizing

### How often should potatoes be watered?
Keep soil evenly moist, especially during tuber formation. Avoid overwatering to prevent rot.

### What nutrients do potatoes need?
Nitrogen (N), phosphorus (P), and potassium (K) are essential. Balanced NPK ratio with higher potassium is ideal during tuber bulking.

---

## Diseases & Pests

### What are common potato diseases?
Late blight, early blight, black scurf, and scab are common diseases. Use certified seed and crop rotation to reduce risk.

### What pests affect potatoes?
Colorado potato beetles, wireworms, and aphids are common. Use pest-resistant varieties and regular inspection.

---

## Harvesting

### When are potatoes ready to harvest?
Harvest when the plant’s foliage turns yellow and dies back. For new potatoes, harvest 2–3 weeks after flowering.

### How should potatoes be harvested?
Gently dig around the plant with a fork or spade to avoid damaging the tubers.

---

## Culinary & Nutrition

### Are potatoes healthy?
Yes, potatoes are rich in vitamin C, potassium, and fiber. They're low in fat but high in carbs.

### What's the difference between waxy and starchy potatoes?
Waxy potatoes (like red or fingerling) hold their shape well and are great for salads. Starchy potatoes (like Russets) are fluffy and ideal for baking or frying.

### Can potatoes be eaten raw?
Raw potatoes contain anti-nutrients and can be hard to digest. Cooking reduces these compounds.

---

## Varieties

### What are common potato varieties?
- **Russet** – starchy, great for baking/frying.
- **Yukon Gold** – all-purpose.
- **Red Potatoes** – waxy, good for boiling/salads.
- **Fingerling** – small, waxy.
- **Purple Potatoes** – rich in antioxidants.

---

## Miscellaneous

### Why do potatoes turn black after cooking?
This is usually due to iron and phenol content reacting with oxygen. Using lemon juice or vinegar can help prevent discoloration.

### Can green potatoes make you sick?
Yes, green parts contain solanine, which can be toxic in large amounts. Always trim green areas before cooking.

### Do potatoes contain gluten?
No, potatoes are naturally gluten-free.

### Can I grow potatoes from store-bought tubers?
You can, but it’s better to use certified seed potatoes to avoid disease.

---


