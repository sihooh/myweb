// 동작 js

// 탭 관련 JS
function setActiveTab(evt, pageName) {
    // 모든 탭 버튼에서 "active" 클래스를 제거
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // 클릭한 탭 버튼에 "active" 클래스 추가
    evt.currentTarget.className += " active"; // 클릭한 탭 버튼에 "active" 클래스 추가
}

// 페이지 로드 시 URL의 해시에 따라 탭 활성화
window.onload = function() {
    const hash = window.location.hash; // 현재 해시 가져오기

    // 해시가 없으면 기본적으로 home을 활성화
    if (!hash) {
        const homeTab = document.querySelector('.tablinks[href="index.html"]');
        if (homeTab) {
            homeTab.classList.add("active"); // 기본적으로 home 탭 활성화
        }
    } else {
        const activeTab = document.querySelector(`.tablinks[href="${hash.replace('#', '')}"]`);
        if (activeTab) {
            activeTab.classList.add("active"); // 해당 탭 활성화
        }
    }
    // 슬라이드 초기화 (첫 번째 슬라이드 표시)
    showSlides(slideIndex);
};

// login modal
function openModal() {
    document.getElementById("loginModal").style.display = 'block';
}

function closeModal() {
    document.getElementById("loginModal").style.display = 'none';
}

document.getElementById('loginButton').addEventListener('click', function(e){
  e.preventDefault();
  openModal();
})

// 모달 바깥 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        closeModal();
    }
}

// 이메일 유효성 검사
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// 비밀번호 유효성 검사 함수
function isValidPassword(password) {
  // 영문 + 숫자 조합, 8자리 이상
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

// 폼 제출 처리
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email');
  const password = document.getElementById('password');

  let isValid = true;

  // 이메일 검증
  if (!email.value.trim()) {
    alert('이메일을 입력해주세요.');
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    alert('올바른 이메일 형식이 아닙니다.');
    isValid = false;
  }

  // 비밀번호 검증
  if (!password.value.trim()) {
    alert('비밀번호를 입력해주세요.');
    isValid = false;
  } else if (!isValidPassword(password.value)) {
    alert('비밀번호는 영문과 숫자를 포함하여 8자리 이상이어야 합니다.');
    isValid = false;
  }

  // 유효성 통과시
  if (isValid) {
    // 로그인 버튼을 mypage 버튼으로 변경
    const loginBtn = document.getElementById('loginButton');
    if (loginBtn) {
      loginBtn.textContent = "MYPAGE";
      loginBtn.classList.remove('loginButton');
      loginBtn.classList.add("MypageButton");

      // MYPAGE 클릭 시 mypage.html로 이동
      loginBtn.onclick = function() {
        window.location.href = "mypage.html";
      }
    }

    // 모달 닫기
    closeModal();

    // 폼 초기화
    this.reset();
  }
});


// 배너 이미지 슬라이드
let slideIndex = 1;
showSlides(slideIndex); // 첫 번째 슬라이드 표시


// next / prev
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  const slides = document.getElementsByClassName('mySlides');
  const dots = document.getElementsByClassName("dot");

  // 슬라이드 인덱스 조정
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }

  // 모든 슬라이드 숨기기
  for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"; // 모든 슬라이드를 숨김
  }

  // 현재 슬라이드가 존재하는지 확인
  if (slides[slideIndex - 1]) {
      slides[slideIndex - 1].style.display = "block"; // 현재 슬라이드 표시
  } else {
      console.error("슬라이드가 정의되지 않았습니다.");
  }

  // 모든 점에서 "active" 클래스 제거
  for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }

  // 현재 점 표시
  if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].className += " active"; // 현재 점 활성화
  } else {
    console.error("점이 정의되지 않았습니다.")
  }
}

// 로고 클릭 시 메뉴 토글
document.addEventListener('DOMContentLoaded', function() {
  const logoIcon = document.getElementById('logoIcon');
  const tab = document.querySelector('.tab');
  
  logoIcon.addEventListener('click', function() {
      if (window.innerWidth <= 600) {
          tab.classList.toggle('active');
      }
  });

  // 화면 크기가 변경될 때 메뉴 상태 초기화
  window.addEventListener('resize', function() {
      if (window.innerWidth > 600) {
          tab.classList.remove('active');
      }
  });

  // 메뉴 항목 클릭 시 메뉴 닫기
  const menuItems = tab.querySelectorAll('a');
  menuItems.forEach(item => {
      item.addEventListener('click', function() {
          if (window.innerWidth <= 600) {
              tab.classList.remove('active');
          }
      });
  });
});