제공된 파일들의 내용을 바탕으로, **네이버 웨일 확장앱 개발**을 위한 상세 가이드 문서를 작성했습니다. 요청하신 대로 각 API의 **메서드 인자(Parameters), 반환값, 매니페스트 설정 옵션** 등을 디테일하게 정리했습니다.

---

# 네이버 웨일 확장앱 개발 상세 가이드 (Manifest V3 기준)

이 문서는 네이버 웨일 브라우저 확장앱 개발을 위한 API 명세 및 구현 방법을 상세히 다룹니다.

## 1. 매니페스트 (Manifest V3)

확장앱의 설정 파일인 `manifest.json`의 주요 항목과 MV3 변경 사항입니다.

### 1.1 필수 및 주요 설정
```json
{
  "manifest_version": 3,
  "name": "확장앱 이름",
  "version": "1.0.0",
  "description": "확장앱 설명",
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  // [MV3] 백그라운드 처리는 서비스 워커 사용
  "background": {
    "service_worker": "background.js",
    "type": "module" // ES 모듈 사용 시 필요
  },
  // [MV3] 호스트 권한 분리
  "host_permissions": [
    "https://*.naver.com/*"
  ],
  "permissions": [
    "tabs", "storage", "contextMenus"
  ],
  // 툴바 버튼 설정 (구 browser_action)
  "action": {
    "default_icon": "icon.png",
    "default_popup": "popup.html"
  }
}
```

---

## 2. 웨일 전용 UI: 사이드바 (Sidebar Action)

웨일 브라우저의 핵심 기능인 사이드바 영역을 제어합니다.

### 2.1 매니페스트 설정
`manifest.json`에 `sidebar_action`을 정의합니다.
```json
"sidebar_action": {
  "default_page": "sidebar.html",  // [필수] 사이드바에 표시할 로컬 HTML 경로
  "default_icon": {                // [필수] 아이콘
      "16": "images/icon16.png"
  },
  "default_title": "사이드바 타이틀", // [선택] 마우스 오버 시 툴팁
  "use_navigation_bar": true       // [선택] 하단 네비게이션바(뒤로/앞으로) 표시 여부 (기본: true)
}
```

### 2.2 `whale.sidebarAction` API 메서드 상세

#### `show(windowId, details, callback)`
사이드바를 열고 포커스를 줍니다.
*   **windowId** (Integer, Optional): 대상 윈도우 ID. 생략 시 현재 윈도우.
*   **details** (Object, Optional):
    *   `url` (String): 표시할 페이지 URL.
    *   `reload` (Boolean): 현재 URL과 같을 때 새로고침 여부 (기본 `false`).
*   **callback** (Function): `function(windowId) {...}`

#### `hide(windowId, callback)`
사이드바를 닫습니다. (현재 확장앱에 포커스가 있을 때만 동작)
*   **windowId** (Integer, Optional): 대상 윈도우 ID.
*   **callback** (Function): `function(windowId) {...}`

#### `dock(windowId, details, callback)`
팝업 윈도우나 특정 탭을 사이드바 영역에 도킹(삽입)합니다.
*   **windowId** (Integer): 도킹할 팝업 윈도우 ID 또는 탭이 속한 윈도우 ID.
*   **details** (Object):
    *   `parentWindowId` (Integer): 부모 윈도우 ID.
    *   `tabId` (Integer): 대상이 탭인 경우 탭 ID 지정.
*   **callback** (Function): `function(windowId) {...}` (도킹된 부모 윈도우 ID 반환)

#### `undock(parentWindowId, callback)`
도킹된 윈도우나 탭을 사이드바에서 분리하여 원래 상태(팝업/탭)로 복원합니다.
*   **parentWindowId** (Integer): 부모 윈도우 ID.
*   **callback** (Function):
    ```javascript
    function(result) {
        // result.popupId: 팝업으로 복원된 윈도우 ID
        // result.tabId: 탭으로 복원된 탭 ID
    }
    ```

#### UI 동적 변경 메서드
*   `setTitle({title: "새 제목"})`: 툴팁 변경.
*   `setIcon({path: "icon.png"})`: 아이콘 변경.
*   `setBadgeText({text: "5"})`: 아이콘 위 뱃지 텍스트 설정.
*   `setBadgeBackgroundColor({color: "#FF0000"})`: 뱃지 배경색 설정.

---

## 3. UI 확장: 툴바 & 콘텍스트 메뉴

### 3.1 툴바 버튼 (Action)
`manifest.json`의 `"action"` 키를 사용합니다.

*   **이벤트 리스너:** 팝업이 없는 경우 클릭 시 실행됩니다.
    ```javascript
    whale.action.onClicked.addListener((tab) => {
        // tab: 클릭된 탭의 정보 객체
        console.log(tab.url);
    });
    ```

### 3.2 콘텍스트 메뉴 (Context Menus)
우클릭 메뉴를 커스터마이징합니다. `permissions: ["contextMenus"]`가 필요합니다.

#### `whale.contextMenus.create(createProperties, callback)`
*   **createProperties** (Object):
    *   `type` (String): "normal", "checkbox", "radio", "separator".
    *   `title` (String): 메뉴 제목. `%s`를 사용하면 선택한 텍스트가 들어갑니다.
    *   `contexts` (Array): 메뉴가 나타날 상황.
        *   `"all"`, `"page"`, `"selection"`, `"link"`, `"image"`, `"video"`, `"audio"` 등.
    *   `onclick` (Function): `function(info, tab) {...}`
*   **onclick 콜백 인자 `info` (Object) 상세:**
    *   `menuItemId`: 메뉴 아이템 ID.
    *   `selectionText`: 선택한 텍스트 문자열.
    *   `linkUrl`: 우클릭한 링크 URL.
    *   `srcUrl`: 우클릭한 이미지/미디어 URL.
    *   `pageUrl`: 현재 페이지 URL.

---

## 4. 메시지 교환 (통신 API)

콘텐츠 스크립트, 백그라운드(서비스 워커), 팝업 간의 데이터 통신을 담당합니다.

### 4.1 단방향 메시지 (One-time requests)

#### 보내기: `sendMessage`
```javascript
// 확장앱 내부 통신
whale.runtime.sendMessage(message, [options], [responseCallback]);

// 특정 탭의 콘텐츠 스크립트로 전송 (백그라운드 -> 탭)
whale.tabs.sendMessage(tabId, message, [options], [responseCallback]);
```

#### 받기: `onMessage`
```javascript
whale.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // message: 보낸 데이터
    // sender: 보낸 곳의 정보 (tab, id, url 등)
    // sendResponse: 응답을 보내는 함수

    if (message === "hello") {
        sendResponse({data: "world"});
    }
    return true; // 비동기로 sendResponse를 호출할 경우 필수
});
```

### 4.2 연결형 메시지 (Long-lived connections)
*   **연결 생성:** `var port = whale.runtime.connect({name: "채널명"});`
*   **메시지 전송:** `port.postMessage({msg: "..."});`
*   **수신 리스너:**
    ```javascript
    whale.runtime.onConnect.addListener((port) => {
        console.assert(port.name === "채널명");
        port.onMessage.addListener((msg) => { ... });
    });
    ```

---

## 5. 웨일 전용 Web API (HTML/JS)

확장앱 권한 없이 HTML 속성과 JS만으로 웨일의 특수 기능을 제어합니다.

### 5.1 창 열기 제어 (Rel 속성 & Window.open)
링크가 열리는 대상을 제어합니다.

#### HTML `rel` 속성 값
*   `whale-sidebar`: 사이드바 패널에서 열기 (이미 열려있으면 재사용).
*   `whale-space`: 듀얼 탭(스페이스)에서 열기.
*   `whale-mobile`: 모바일 뷰 창으로 열기.
*   `web-app`: 웹 앱 창(독립된 창)으로 열기.

**예시:**
```html
<a href="https://m.naver.com" rel="whale-mobile">모바일창 열기</a>
```

#### JavaScript `window.open` 확장
세 번째 인자(`windowFeatures`)에 웨일 전용 속성을 추가합니다.
```javascript
// 사이드바 열기
window.open('url', '_blank', 'whale-sidebar');

// 듀얼탭 열기
window.open('url', '_blank', 'whale-space');

// 웹앱 열기 (크기 지정 가능)
window.open('url', '_blank', 'web-app, width=300, height=400');
```

### 5.2 바코드 인식 API (BarcodeDetector)
이미지 내의 바코드를 인식합니다. (지원 환경: macOS 10.14+ 등)

#### 사용법
```javascript
// 1. 지원 여부 확인
const formats = await BarcodeDetector.getSupportedFormats();

// 2. 인스턴스 생성 (포맷 지정 가능)
const detector = new BarcodeDetector({ formats: ['qr_code', 'code_128'] });

// 3. 인식 수행
const barcodes = await detector.detect(imageElement); // image, video, canvas 요소

barcodes.forEach(code => {
    console.log(code.rawValue); // 바코드 데이터
    console.log(code.boundingBox); // 위치 {x, y, width, height}
    console.log(code.cornerPoints); // 모서리 좌표 배열
});
```

### 5.3 미디어 세션 API
브라우저의 글로벌 미디어 컨트롤(GMC) UI와 연동합니다.

#### 메타데이터 설정
```javascript
navigator.mediaSession.metadata = new MediaMetadata({
    title: '곡 제목',
    artist: '아티스트',
    album: '앨범명',
    artwork: [{ src: '이미지URL', sizes: '128x128', type: 'image/png' }]
});
```

#### 액션 핸들러 등록
지원 액션: `play`, `pause`, `previoustrack`, `nexttrack`, `seekbackward`, `seekforward`
```javascript
navigator.mediaSession.setActionHandler('nexttrack', () => {
    // 다음 곡 재생 로직
});
```

---

## 6. 기타 주요 브라우저 API

### 6.1 다운로드 (`whale.downloads`)
*   권한: `downloads`
*   **다운로드 시작:**
    ```javascript
    whale.downloads.download({
        url: "http://...",
        filename: "path/file.zip",
        saveAs: true // '다른 이름으로 저장' 대화상자 표시 여부
    }, (downloadId) => { ... });
    ```
*   **검색:** `whale.downloads.search({orderBy: ['-startTime'], limit: 5}, callback)`
*   **이벤트:** `whale.downloads.onCreated`, `whale.downloads.onChanged`

### 6.2 방문 기록 (`whale.history`)
*   권한: `history`
*   **방문 조회:** `whale.history.getVisits({url: "..."})` (방문 횟수 등 확인)
*   **삭제:** `whale.history.deleteUrl({url: "..."})`

### 6.3 단축키 (`whale.commands`)
*   **Manifest 설정:**
    ```json
    "commands": {
        "my-command": {
            "suggested_key": { "default": "Ctrl+Shift+Y", "mac": "Command+Shift+Y" },
            "description": "단축키 설명"
        }
    }
    ```
*   **리스너:**
    ```javascript
    whale.commands.onCommand.addListener((command) => {
        if (command === "my-command") { ... }
    });
    ```

---

## 7. MV3 마이그레이션 핵심 체크리스트

기존 MV2 확장앱을 MV3로 변환할 때 필수적으로 수정해야 하는 사항입니다.

1.  **백그라운드 페이지 삭제:**
    *   `background.scripts` 또는 `background.page` ➔ **`background.service_worker`**로 변경.
    *   DOM 접근 불가, `window`, `document` 사용 불가.
    *   타이머(`setTimeout`) 대신 `whale.alarms` 사용 권장.
2.  **API 통합:**
    *   `browser_action`, `page_action` ➔ **`action`**으로 통합.
3.  **네트워크 요청 제어:**
    *   `webRequestBlocking` (차단) 사용 불가 ➔ **`declarativeNetRequest`** API로 규칙 기반 차단으로 변경.
4.  **원격 코드 실행 금지:**
    *   외부 CDN의 JS 로드 불가 ➔ 패키지 내에 JS 파일 포함.
    *   `eval()`, `new Function()` 사용 불가.
    *   문자열 코드 실행(`executeScript({code: ...})`) 불가 ➔ 파일/함수 주입(`executeScript({files: ...} / {func: ...})`)으로 변경.