import React, { useState, useMemo, useEffect } from 'react'; // useEffect 추가
import { gsap } from 'gsap'; // gsap 임포트
import { Product, FilterState } from './types'; // types.ts에서 잘 불러오는지 확인
//import './App.css';
import styled from 'styled-components';

// 컨테이너 스타일 (기존 .App)
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px;
  font-family: 'Pretendard', sans-serif;
`;

// 리스트 컨테이너: CSS-in-JS로 분리해서 미디어쿼리 적용
const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;

  /* ✨ 모바일 대응: 1줄에 1개씩 혹은 2개씩 */
  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* 1줄에 1개 */
    gap: 15px;
  }
`;

// 전체 필터 바 (그림자와 둥근 모서리) : 모바일에서는 세로로 나열되도록 변경
const FilterGroup = styled.div`
  display: flex;
  gap: 15px;
  padding: 30px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  align-items: center;

  /* ✨ 모바일 대응 (768px 이하) */
  @media (max-width: 768px) {
    flex-direction: column; /* 세로 정렬 */
    align-items: stretch;   /* 너비 꽉 채우기 */
    padding: 20px;
    gap: 10px;
  }
`;

// 검색창 스타일
const Input = styled.input`
  flex: 1.5; /* 검색창을 조금 더 넓게 */
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid #eee;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: #007aff;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }
`;

// 셀렉트 박스 스타일
const SelectWrapper = styled.div<{ isOpen: boolean }>`
  position: relative;
  flex: 1;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 20px;
    /* isOpen이 true일 때만 위를 향하게 회전 (225도) */
    transform: ${props => props.isOpen 
      ? 'translateY(-30%) rotate(225deg)' 
      : 'translateY(-70%) rotate(45deg)'};
    width: 8px;
    height: 8px;
    border-right: 2px solid #666;
    border-bottom: 2px solid #666;
    pointer-events: none;
    transition: all 0.3s ease; /* 부드러운 회전 */
    border-color: ${props => props.isOpen ? '#007aff' : '#666'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 40px 12px 20px; /* 오른쪽 여백을 넉넉히 줌 */
  border-radius: 10px;
  border: 1px solid #eee;
  font-size: 16px;
  background-color: #fff;
  cursor: pointer;
  outline: none;
  
  /* 1. 기본 화살표 제거 (핵심!) */
  appearance: none; 
  -webkit-appearance: none; /* 사파리/크롬 대응 */
  -moz-appearance: none;    /* 파이어폭스 대응 */

  &:focus {
    border-color: #007aff;
  }
`;

// 체크박스 라벨 스타일
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
  color: #666;
  white-space: nowrap; /* 글자 줄바꿈 방지 */

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

// 아이템 카드 스타일 (조건부 스타일 적용 예시)
const ItemCard = styled.div<{ isStock: boolean }>`
  background: white;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #eee;
  opacity: ${props => props.isStock ? 1 : 0.5}; // 품절이면 흐리게 (JS 변수 사용!)
  position: relative;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

// DATA 변수를 App 함수 '밖'에 선언! (대문자 DATA 확인)
const DATA: Product[] = [
  { id: 1, name: "아이폰 15", category: "Electronics", price: 1200000, inStock: true },
  { id: 2, name: "맨투맨", category: "Clothing", price: 45000, inStock: true },
  { id: 3, name: "무드등", category: "Home", price: 32000, inStock: false },
  { id: 4, name: "맥북 에어 M3", category: "Electronics", price: 1590000, inStock: true },
  { id: 5, name: "와이드 슬랙스", category: "Clothing", price: 38000, inStock: true },
  { id: 6, name: "세라믹 화분", category: "Home", price: 24000, inStock: true },
  { id: 7, name: "기계식 키보드", category: "Electronics", price: 125000, inStock: false },
  //데이터 계속 추가 가능
];

function App() {
  const [isOpen, setIsOpen] = useState(false); // 열림 상태 관리
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    onlyInStock: false
  });

  const filtered = useMemo(() => {
    return DATA.filter(p => {
      const matchSearch = p.name.includes(filters.search);
      const matchCat = filters.category === 'All' || p.category === filters.category;
      const matchStock = filters.onlyInStock ? p.inStock : true;
      return matchSearch && matchCat && matchStock;
    });
  }, [filters]);

  // ✨ GSAP 애니메이션 추가
  useEffect(() => {
    // 필터링된 결과가 바뀔 때마다 실행
    gsap.fromTo(".item", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
    );
  }, [filtered]); // filtered 데이터가 바뀔 때마다 애니메이션 재생

 return (
    <Container> {/* 1. <div className="App"> 대신 사용 */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Smart Product Filter</h1>
        <p>GSAP + TypeScript Interaction (Styled-Components)</p>
      </header>

      <FilterGroup> {/* 2. <div className="filter-group"> 대신 사용 */}
        <Input 
          type="text"
          placeholder="상품명을 입력하세요..." 
          onChange={e => setFilters({...filters, search: e.target.value})} 
        />
        <SelectWrapper isOpen={isOpen}> {/* 여기에 isOpen={isOpen}을 꼭 넣어줘야 함! */}
          <Select      
              // onClick 대신 onMouseDown을 사용하면 더 정확하게 토글됨
              onMouseDown={() => setIsOpen(!isOpen)}  

              // 포커스가 빠질 때 닫기
              onBlur={() => setIsOpen(false)}    
              onChange={(e) => {
                setFilters({...filters, category: e.target.value as any});
                setIsOpen(false); // 선택 완료 즉시 닫힘
                (e.target as HTMLSelectElement).blur(); // 선택 후 포커스 강제 해제 (화살표 복구)
              }}
            >
              <option value="All">모든 카테고리</option>
              <option value="Electronics">전자기기</option>
              <option value="Clothing">의류</option>
              <option value="Home">홈/리빙</option>
          </Select>
        </SelectWrapper>
        <CheckboxLabel>
          <input type="checkbox" onChange={e => setFilters({...filters, onlyInStock: e.target.checked})} />
          <span>품절 제외</span>
        </CheckboxLabel>
      </FilterGroup>

      <ProductList className="list">
        {filtered.length > 0 ? (
          filtered.map(p => (
            // 핵심: <div className="item"> 대신 <ItemCard> 사용 및 props 전달 
            // - isStock은 우리가 만든 조건부 스타일(opacity 조절)을 위해 쓰임  
            // - GSAP가 애니메이션 타겟(.item)을 찾을 수 있도록 그대로 남겨둠          
            <ItemCard key={p.id} isStock={p.inStock} className="item">
              <span style={{ fontSize: '0.75rem', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                {p.category}
              </span>
              <h3 style={{ margin: '10px 0' }}>{p.name}</h3>
              <p style={{ fontWeight: 'bold', color: '#007aff' }}>{p.price.toLocaleString()}원</p>
              {!p.inStock && (
                <span style={{ position: 'absolute', top: '15px', right: '15px', color: '#ff3b30', fontWeight: 'bold' }}>
                  품절
                </span>
              )}
            </ItemCard>
          ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '50px' }}>
            검색 결과가 없습니다. 😢
          </p>
        )}
      </ProductList>
    </Container>
  );
}

export default App;