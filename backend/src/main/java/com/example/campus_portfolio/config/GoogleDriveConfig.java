package com.example.campus_portfolio.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.*;
import java.util.Collections;

@Configuration
public class GoogleDriveConfig {

    @Bean
    public Drive googleDrive() throws Exception {

        // service-account.json を resources に置く
        InputStream serviceAccountStream = getClass().getResourceAsStream("/service-account.json");

        if (serviceAccountStream == null) {
            throw new FileNotFoundException("service-account.json not found");
        }

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(serviceAccountStream)
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                requestInitializer).setApplicationName("campus-portfolio")
                .build();
    }
}
