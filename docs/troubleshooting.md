# 트러블슈팅 로그 (Troubleshooting Log)

개발 중 발생한 주요 에러와 해결 방법을 기록합니다.

## 1. 환경 변수 읽기 실패 (`supabaseUrl is required`)

**증상:**
앱 실행 시 `Error: supabaseUrl is required.` 에러 발생하며 크래시.

**원인:**
Expo 클라이언트(앱)에서 `process.env`로 환경 변수에 접근하려면 변수명이 반드시 `EXPO_PUBLIC_`으로 시작해야 함.

**해결:**

1.  `.env` 파일의 변수명을 모두 `EXPO_PUBLIC_` 접두사를 붙여 변경.
    ```env
    EXPO_PUBLIC_SUPABASE_URL=...
    ```
2.  `supabase.ts` 등 코드에서도 참조하는 변수명 변경.

---

## 2. Google 로그인 URL Scheme 누락

**증상:**
iOS에서 구글 로그인 시도 시 `Your app is missing support for the following URL schemes: com.googleusercontent.apps...` 에러 발생.

**원인:**
iOS 앱이 구글 인증 후 다시 앱으로 돌아오기 위한 URL Scheme 설정이 `app.json`에 누락됨.

**해결:**
`app.json`의 `ios.config.infoPlist.CFBundleURLTypes`에 `CFBundleURLSchemes` 추가.
(값은 구글 클라우드 콘솔의 `iOS URL scheme` 사용)

---

## 3. Google Provider 비활성화

**증상:**
로그인 시 `AuthApiError: Provider (issuer "https://accounts.google.com") is not enabled` 발생.

**원인:**
Supabase 대시보드에서 Google 로그인 제공자가 활성화되지 않음.

**해결:**
Supabase Dashboard > Authentication > Providers > Google에서 "Enable Google" 활성화.

---

## 4. Google 로그인 Nonce 불일치

**증상:**
`AuthApiError: Passed nonce and nonce in id_token should either both exist or not.`

**원인:**
`GoogleSignin.configure()`에 `iosClientId`를 제공하면 iOS 네이티브 SDK가 자동으로 Nonce를 생성하여 포함함. 하지만 Supabase는 Web Client ID 기반 검증을 수행하므로, Nonce가 포함된 토큰을 받으면 검증에 실패함.

**해결 (최종):**
복잡한 Nonce 수동 생성 및 해싱 로직 대신, **Supabase 설정에서 Nonce 검사를 건너뛰도록 설정**하여 해결했습니다.

1.  Supabase 대시보드 > Authentication > Providers > Google
2.  **"Skip nonce check"** 옵션을 **활성화 (Enable)**.
3.  앱 코드는 복잡한 Nonce 관리 없이 표준 SDK 사용 (`GoogleService-Info.plist` 필수).

---

## 5. GoogleService-Info.plist 파일 누락

**증상:**
`Error: RNGoogleSignin: failed to determine clientID - GoogleService-Info.plist was not found...`

**원인:**
`@react-native-google-signin/google-signin` 라이브러리는 iOS에서 초기화 시 `GoogleService-Info.plist` 파일을 찾으려 함. (Firebase를 안 써도 필요)

**해결:**

1.  `GoogleService-Info.plist` 파일을 직접 생성 (CLIENT_ID, REVERSED_CLIENT_ID 포함).
2.  `app.json`의 `ios.googleServicesFile` 경로에 해당 파일을 연결.
3.  앱 재빌드 (`yarn build:mobile:ios`).
