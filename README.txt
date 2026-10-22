2026 제15회 충남 수학교육 한마당 · 모바일 학습지

■ 폴더 구성
public/index.html    화면 (학생용 + 선생님 편집 기능)
public/booths.js     부스·학습지 기본 내용
public/data.js       서버 저장 내용을 불러와 합치는 코드
public/qr.html       부스별 QR 카드 인쇄
netlify/functions/   선생님이 고친 내용을 저장하는 서버 함수 (Netlify Blobs 사용)
netlify.toml, package.json   넷리파이 설정

■ 넷리파이에 올리기 (GitHub 연결 방식 · 편집 기능이 동작하려면 이 방법으로)
※ 폴더를 끌어다 놓는 Netlify Drop 방식은 서버 함수가 동작하지 않아요.
   그 방식으로 올리면 학습지는 보이지만, 선생님 수정 내용이 저장되지 않아요.
1. github.com 가입 → New repository 만들기 (예: hanmadang-2026)
2. 저장소 화면에서 "uploading an existing file" → 이 폴더 안의 내용 전체를 끌어다 놓고 Commit
   (public, netlify 폴더와 netlify.toml, package.json이 맨 위에 보여야 해요)
3. app.netlify.com → Add new project → Import an existing project → GitHub → 저장소 선택 → Deploy
   (설정은 netlify.toml에 들어 있어서 따로 바꿀 것 없어요)
4. Project configuration에서 주소 이름 바꾸기 (예: cnmath2026.netlify.app)
5. [주소]/qr.html 에서 QR 인쇄

■ 비밀번호
기본 2026. 바꾸려면 넷리파이 Project configuration → Environment variables에
ADMIN_PASSWORD 를 추가하고 다시 배포하세요.

■ 선생님 편집 방법
화면 맨 아래 '부스 담당 선생님 (학습지 수정)' → 비밀번호 →
 - 부스 화면의 '이 학습지 수정·교체' : 제목·목표·체험 순서·원리·문항 수정, 문항 추가/삭제/순서 바꾸기
 - '활동지 전부 비우고 새로 쓰기' : 학습지 교체
 - '이 부스 삭제' / '처음 내용으로 되돌리기'
 - 부스 목록 맨 위 '+ 새 부스 추가'
저장하면 모든 학생 화면에 바로 반영돼요.
