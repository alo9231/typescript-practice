# 🛒 Smart Product Filter System
> **"퍼블리싱의 정교함과 프런트엔드의 로직을 잇다"**
> React, TypeScript, Styled-Components, GSAP를 활용한 인터랙티브 상품 필터링 시스템

<br />

## 📺 Preview
프리뷰 바로가기 👉 https://typescript-practice-three.vercel.app/

---
### 🎨 High-End Interaction (GSAP)
단순한 데이터 나열이 아닌, **GSAP Stagger** 애니메이션을 통해 필터링 시 아이템이 리듬감 있게 나타나도록 구현했습니다. 사용자의 액션에 즉각적이고 부드러운 피드백을 제공합니다.

### 🛡️ Type-Safe Architecture (TypeScript)
`Interface`와 `Union Type`을 엄격히 정의하여 런타임 에러를 방지하고, 데이터의 흐름을 명확히 설계했습니다. 

### 💅 Modern Styling (CSS-in-JS)
`Styled-components`를 도입하여 컴포넌트 단위의 독립적인 스타일링을 실천했습니다. 특히 **Props 기반의 조건부 스타일링**으로 상태(State)에 따른 UI 변화를 선언적으로 관리합니다.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white) |
| **Styling** | ![Styled-Components](https://img.shields.io/badge/Styled--Components-DB7093?style=flat-square&logo=styled-components&logoColor=white) |
| **Motion** | ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=GreenSock&logoColor=white) |

---

## 🔍 Deep Dive: How it works?

### 1. 정교한 Custom Select UI
기존 `select` 태그의 한계를 극복하기 위해 React의 `State`와 `Event(onMouseDown, onBlur, onChange)`를 조합했습니다.
- **Problem**: 옵션 선택 후에도 화살표가 돌아오지 않는 UX 결함 발견
- **Solution**: `onChange` 시점에 `e.target.blur()`를 강제 호출하여 포커스를 해제, 화살표 상태를 즉시 복구하는 로직 구현

### 2. 성능 최적화 (Performance)
데이터가 많아질 상황을 대비해 `useMemo`를 활용했습니다. 검색어나 카테고리가 변경될 때만 필터 연산이 실행되도록 하여 불필요한 리렌더링을 방지했습니다.

---

## 📂 Project Structure

```bash
src/
 ├── types.ts       # Interface 및 Type 정의 (Product, FilterState)
 ├── App.tsx        # 메인 비즈니스 로직 & Styled Components
 ├── App.css        # Reset 및 Global Font 설정
 └── index.tsx      # Entry Point
