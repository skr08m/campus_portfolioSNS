// package com.example.campus_portfolio.config;

// import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
// import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
// import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
// import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
// import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
// import com.google.api.client.http.javanet.NetHttpTransport;
// import com.google.api.client.json.JsonFactory;
// import com.google.api.client.json.jackson2.JacksonFactory;
// import com.google.api.client.util.store.FileDataStoreFactory;
// import com.google.api.client.auth.oauth2.Credential;
// import com.google.api.services.drive.Drive;
// import com.google.api.services.drive.DriveScopes;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.io.*;
// import java.util.List;

// @Configuration
// public class GoogleDriveConfig {

//     private static final String APPLICATION_NAME = "AI_driveApp";
//     private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
//     private static final List<String> SCOPES = List.of(DriveScopes.DRIVE); // 全権限
//     private static final String TOKENS_DIRECTORY_PATH = "tokens"; // 認証トークン保存場所

//     @Bean
//     public Drive driveInitialSetup() throws Exception {
//         final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

//         // resources 内のクライアント情報
//         InputStream in = getClass().getResourceAsStream("/oAuth2.0Client.json");
//         if (in == null) {
//             throw new FileNotFoundException("credentials.json not found in resources.");
//         }

//         GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

//         // OAuth 認証フロー
//         GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
//                 HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
//                 .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
//                 .setAccessType("offline")
//                 .build();

//         LocalServerReceiver receiver = new LocalServerReceiver.Builder()
//                 .setPort(8080)
//                 .setCallbackPath("/Callback")
//                 .build();

//         AuthorizationCodeInstalledApp app = new AuthorizationCodeInstalledApp(flow, receiver) {
//             @Override
//             protected void onAuthorization(com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl url)
//                     throws java.io.IOException {
//                 url.set("prompt", "consent");
//                 url.set("access_type", "offline");
//                 super.onAuthorization(url);
//             }
//         };

//         Credential cred = app.authorize("user");
//         System.out.println("refreshToken=" + cred.getRefreshToken());

//         return new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, cred)
//                 .setApplicationName(APPLICATION_NAME)
//                 .build();
//     }
// }
